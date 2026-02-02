import Notification from '../models/Notification.js';

import { SensorData, PestAlert } from '../models/FarmManagement.js';
import User from '../models/User.js';

class NotificationService {
  // Create a new notification
  async createNotification({
    userId,
    type,
    title,
    message,
    data = {},
    priority = 'medium',
    actionUrl = null
  }) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        data,
        priority,
        actionUrl
      });

      // Emit real-time notification if socket.io is available
      if (global.io) {
        global.io.to(userId.toString()).emit('new_notification', notification);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send notifications to multiple users
  async sendBulkNotifications(userIds, notificationData) {
    try {
      const notifications = userIds.map(userId => ({
        userId,
        ...notificationData
      }));

      const createdNotifications = await Notification.insertMany(notifications);

      // Emit to all users
      if (global.io) {
        userIds.forEach((userId, index) => {
          global.io.to(userId.toString()).emit('new_notification', createdNotifications[index]);
        });
      }

      return createdNotifications;
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw error;
    }
  }

  // Price update notifications
  async sendPriceUpdateNotification(userId, productName, oldPrice, newPrice) {
    const priceChange = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1);
    const isIncrease = newPrice > oldPrice;
    
    await this.createNotification({
      userId,
      type: 'price_update',
      title: `Price Update: ${productName}`,
      message: `${productName} price ${isIncrease ? 'increased' : 'decreased'} by ${Math.abs(priceChange)}%`,
      priority: Math.abs(priceChange) > 10 ? 'high' : 'medium',
      data: { productName, oldPrice, newPrice, priceChange }
    });
  }

  // Order notifications
  async sendOrderNotification(userId, orderId, status, message, orderData = {}) {
    await this.createNotification({
      userId,
      type: 'order',
      title: `Order ${status}`,
      message,
      actionUrl: `/orders/${orderId}`,
      data: { orderId, status, ...orderData }
    });
  }
  
  // Farmer order notification - notify farmer about new orders
  async sendFarmerOrderNotification(farmerId, orderId, buyerName, totalAmount, deliveryAddress) {
    await this.createNotification({
      userId: farmerId,
      type: 'order',
      title: 'New Order Received',
      message: `You have received a new order of ₹${totalAmount} from ${buyerName}`,
      priority: 'high',
      actionUrl: `/farmer/orders/${orderId}`,
      data: { 
        orderId, 
        buyerName, 
        totalAmount,
        deliveryAddress,
        status: 'new'
      }
    });
  }

  // Payment notifications
  async sendPaymentNotification(userId, orderId, status, amount) {
    const title = status === 'success' ? 'Payment Successful' : 'Payment Failed';
    const message = status === 'success' 
      ? `Payment of ₹${amount} completed successfully`
      : `Payment of ₹${amount} failed. Please try again.`;

    await this.createNotification({
      userId,
      type: 'payment',
      title,
      message,
      priority: status === 'failed' ? 'high' : 'medium',
      actionUrl: `/orders/${orderId}`,
      data: { orderId, status, amount }
    });
  }
  
  // Order verification code notifications
  async sendVerificationCodeNotification(userId, orderId, code) {
    await this.createNotification({
      userId,
      type: 'order',
      title: 'Order Verification Code',
      message: `Your verification code for order #${orderId.toString().slice(-6)} is: ${code}. Show this to the delivery person when receiving your order.`,
      priority: 'high',
      actionUrl: `/orders/${orderId}`,
      data: { orderId, code, isVerification: true }
    });
  }

  // Pest alert notifications
  async sendPestAlertNotification(farmId, pestType, severity) {
    try {
      // Find farm owner
      const farm = await User.findById(farmId);
      if (!farm) return;

      await this.createNotification({
        userId: farmId,
        type: 'pest_alert',
        title: 'Pest Alert',
        message: `${pestType} detected on your farm with ${severity} severity`,
        priority: severity === 'high' ? 'critical' : 'high',
        actionUrl: '/farm-management',
        data: { pestType, severity }
      });
    } catch (error) {
      console.error('Error sending pest alert notification:', error);
    }
  }

  // Appointment notifications
  async sendAppointmentNotification(userId, type, appointmentData) {
    const titles = {
      booked: 'Appointment Booked',
      confirmed: 'Appointment Confirmed',
      cancelled: 'Appointment Cancelled',
      reminder: 'Appointment Reminder',
      completed: 'Appointment Completed'
    };

    const messages = {
      booked: `Your appointment with Dr. ${appointmentData.doctorName} has been booked`,
      confirmed: `Your appointment with Dr. ${appointmentData.doctorName} is confirmed`,
      cancelled: `Your appointment with Dr. ${appointmentData.doctorName} has been cancelled`,
      reminder: `Reminder: You have an appointment with Dr. ${appointmentData.doctorName} tomorrow`,
      completed: `Your appointment with Dr. ${appointmentData.doctorName} is completed`
    };

    await this.createNotification({
      userId,
      type: 'appointment',
      title: titles[type],
      message: messages[type],
      actionUrl: '/appointments',
      data: appointmentData
    });
  }

  // System notifications
  async sendSystemNotification(userIds, title, message, priority = 'medium') {
    await this.sendBulkNotifications(userIds, {
      type: 'system',
      title,
      message,
      priority
    });
  }

  // Check and send automatic alerts based on sensor data
  async checkSensorAlerts() {
    try {
      const recentSensorData = await SensorData.find({
        timestamp: {
          $gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }).populate('farmId');

      for (const data of recentSensorData) {
        const alerts = [];

        if (data.temperature > 35) {
          alerts.push({
            type: 'High Temperature Alert',
            message: `Temperature is ${data.temperature}°C. Consider increasing irrigation.`,
            priority: 'high'
          });
        }

        if (data.soilMoisture < 20) {
          alerts.push({
            type: 'Low Soil Moisture',
            message: `Soil moisture is ${data.soilMoisture}%. Irrigation recommended.`,
            priority: 'high'
          });
        }

        if (data.soilPH < 6 || data.soilPH > 8) {
          alerts.push({
            type: 'Soil pH Alert',
            message: `Soil pH is ${data.soilPH}. Consider soil treatment.`,
            priority: 'medium'
          });
        }

        // Send alerts to farm owner
        for (const alert of alerts) {
          await this.createNotification({
            userId: data.farmId._id,
            type: 'system',
            title: alert.type,
            message: alert.message,
            priority: alert.priority,
            actionUrl: '/farm-management'
          });
        }
      }
    } catch (error) {
      console.error('Error checking sensor alerts:', error);
    }
  }

  // Schedule periodic notifications
  startPeriodicTasks() {
    // Check sensor alerts every hour
    setInterval(() => {
      this.checkSensorAlerts();
    }, 60 * 60 * 1000);

    // Clean up old notifications every day
    setInterval(async () => {
      try {
        await Notification.deleteMany({
          createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });
      } catch (error) {
        console.error('Error cleaning up notifications:', error);
      }
    }, 24 * 60 * 60 * 1000);
  }
}

export default new NotificationService();

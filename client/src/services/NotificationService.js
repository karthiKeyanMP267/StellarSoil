import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const sendNotification = (title, options = {}) => {
    if (permission === 'granted') {
      return new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      });
    }
    return null;
  };

  return {
    permission,
    requestPermission,
    sendNotification
  };
};

// Notification service for order updates
export const NotificationService = {
  async orderStatusUpdate(order) {
    const notification = {
      title: 'Order Status Update',
      body: `Your order #${order.orderNumber} is now ${order.status}`,
      data: { url: `/orders/${order.id}` }
    };

    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    try {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, notification);
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(notification.title, notification);
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  async newMessage(message) {
    const notification = {
      title: 'New Message',
      body: message.preview,
      data: { url: `/messages/${message.id}` }
    };

    if (!('Notification' in window)) {
      return;
    }

    try {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, notification);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
};

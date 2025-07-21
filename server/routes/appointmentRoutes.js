import express from 'express';
import {
  bookAppointment,
  getUserAppointments,
  getAllAppointments,
  markAppointmentCompleted,
  deleteAppointment,
  getDoctorAppointments,
  getDoctorStats,
  rescheduleAppointment,
  rescheduleAppointmentByUser
} from '../controllers/appointmentController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, bookAppointment);
router.get('/my', protect, getUserAppointments);

// Admin route
router.get('/', protect, admin, getAllAppointments);

// Mark appointment as completed
router.patch('/:id/complete', protect, markAppointmentCompleted);

// Delete appointment (user or doctor)
router.delete('/:id', protect, deleteAppointment);

// Doctor routes
router.get('/doctor', protect, getDoctorAppointments);
router.get('/doctor/stats', protect, getDoctorStats);
router.patch('/:id/reschedule', protect, rescheduleAppointment);

// User reschedule appointment
router.patch('/:id/user-reschedule', protect, rescheduleAppointmentByUser);

export default router;

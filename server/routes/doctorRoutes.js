import express from 'express';
import {
  createDoctor,
  getAllDoctors,     // ✅ use the correct name
  deleteDoctor,
  updateDoctor,
  updateDoctorProfile
} from '../controllers/doctorController.js';
import { getAvailableSlots } from '../controllers/slotController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public: anyone can view doctors
router.get('/', getAllDoctors);

// ✅ Protected (admin only): add, update, delete
router.post('/', protect, admin, createDoctor);
router.put('/:id', protect, admin, updateDoctor);
router.delete('/:id', protect, admin, deleteDoctor);

// Doctor updates their own profile
router.put('/profile', protect, updateDoctorProfile);

// Get available slots for a doctor on a specific date
router.get('/:doctorId/slots', getAvailableSlots);

export default router;

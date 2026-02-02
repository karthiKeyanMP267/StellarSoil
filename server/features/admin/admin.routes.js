import express from 'express';
import {
  getPendingFarmers,
  approveFarmer,
  rejectFarmer,
  toggleUserStatus,
  getAllFarmsAdmin,
  getAllUsersAdmin,
  deleteUser
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes with authentication and admin middleware
router.use(protect);
router.use(admin);

router.get('/pending-farmers', getPendingFarmers);
router.get('/farms', getAllFarmsAdmin);
router.get('/users', getAllUsersAdmin);
router.put('/approve-farmer/:id', approveFarmer);
router.put('/reject-farmer/:id', rejectFarmer);
router.put('/toggle-user-status/:id', toggleUserStatus);
router.delete('/users/:id', deleteUser);

export default router;

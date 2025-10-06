import express from 'express';
import {
  getUsers, deleteUser, getUserProfile, updateUserProfile, updateUserProfilePicture
} from '../controllers/userController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js';
const router = express.Router();

router.route('/').get(protect, isAdmin, getUsers);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/profile/avatar', protect, upload.single('avatar'), updateUserProfilePicture);

router.route('/:id').delete(protect, isAdmin, deleteUser);

export default router;

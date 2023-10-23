import express from 'express';
import {
    authUser,
    deleteUser,
    getUserById,
    getUserProfile,
    getUsers,
    logoutUser,
    registerUser,
    updateUser,
    updateUserProfile,
} from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers).post(registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router
    .route('/:id')
    .get(protect, admin, getUserById)
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUser);

export default router;

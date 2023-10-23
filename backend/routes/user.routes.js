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

const router = express.Router();

router.route('/').get(getUsers).post(registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(getUserProfile).put(updateUserProfile);
router.route('/:id').get(getUserById).delete(deleteUser).put(updateUser);

export default router;

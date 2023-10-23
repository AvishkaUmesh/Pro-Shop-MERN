import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';

/**
 * @function
 * @async
 * @desc Auth user & get token
 * @param {Response} res - The Express.js response object.
 * @param {Request} req - The Express.js request object.
 * @route POST /api/users/auth
 * @access Public
 * @returns {Object} - user object
 */
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // set JWT as HTTP-Only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV !== 'development' ||
                process.env.NODE_ENV !== 'test',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const registerUser = asyncHandler(async (req, res) => {
    res.send('register user');
});

const logoutUser = asyncHandler(async (req, res) => {
    res.send('logout user');
});

const getUserProfile = asyncHandler(async (req, res) => {
    res.send('get user profile');
});

const updateUserProfile = asyncHandler(async (req, res) => {
    res.send('update user profile');
});

const getUsers = asyncHandler(async (req, res) => {
    res.send('get users');
});

const getUserById = asyncHandler(async (req, res) => {
    res.send('get user by id');
});

const deleteUser = asyncHandler(async (req, res) => {
    res.send('delete user');
});

const updateUser = asyncHandler(async (req, res) => {
    res.send('update user');
});

export {
    authUser,
    deleteUser,
    getUserById,
    getUserProfile,
    getUsers,
    logoutUser,
    registerUser,
    updateUser,
    updateUserProfile,
};

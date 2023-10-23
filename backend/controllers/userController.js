import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

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
        // Generate JWT Cookie
        generateToken(res, user._id);

        res.status(200).json({
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

/**
 * @function
 * @async
 * @desc Logout user by clearing the jwt cookie and sending a success message.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response with success message.
 * @route POST /api/users/logout
 * @access Private
 */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        // Generate JWT Cookie
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }

    res.status(400);
    throw new Error('Invalid user data');
});

/**
 * @function
 * @async
 * @desc Logout user by clearing the jwt cookie and sending a success message.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON user object with JWT cookie.
 * @route POST /api/users/logout
 * @access Private
 */
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure:
            process.env.NODE_ENV !== 'development' ||
            process.env.NODE_ENV !== 'test',
        sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * @function
 * @async
 * @desc Get user profile
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response with user profile.
 * @route GET /api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }

    res.status(404).json({ message: 'User not found' });
});

/**
 * @function
 * @async
 * @desc Update user profile
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response with user profile.
 * @route PUT /api/users/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }

    res.status(404).json({ message: 'User not found' });
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

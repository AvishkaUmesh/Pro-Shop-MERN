import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @function
 * @async
 * @description Create new order
 * @route POST /api/orders
 * @access Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
    res.send('Order Created');
});

/**
 * @function
 * @async
 * @description Get logged in user orders
 * @route GET /api/orders/myorders
 * @access Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
    res.send('My Orders');
});

/**
 * @function
 * @async
 * @description Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
const getOrderById = asyncHandler(async (req, res) => {
    res.send('Order by ID');
});

/**
 * @function
 * @async
 * @description Update order to paid
 * @route PUT /api/orders/:id/pay
 * @access Private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
    res.send('Order updated to paid');
});

/**
 * @function
 * @async
 * @description Update order to delivered
 * @route PUT /api/orders/:id/deliver
 * @access Private/Admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    res.send('Order updated to delivered');
});

/**
 * @function
 * @async
 * @description Get all orders
 * @route GET /api/orders
 * @access Private/Admin
 */
const getOrders = asyncHandler(async (req, res) => {
    res.send('All Orders');
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
};

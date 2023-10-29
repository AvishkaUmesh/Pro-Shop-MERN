import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

/**
 * @function
 * @async
 * @description Fetch all products
 * @route GET /api/products
 * @access Public

 * @returns {Object[]} Array of product objects
 */
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

/**
 * @function
 * @desc    Fetch a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 * @returns {object} JSON object containing the product data if found, or an error message if not found
 */
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @function
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

export { createProduct, getProductById, getProducts };

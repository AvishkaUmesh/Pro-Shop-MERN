import express from 'express';
import {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
} from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
    .route('/:id')
    .get(checkObjectId, getProductById)
    .put(protect, admin, checkObjectId, updateProduct);

export default router;

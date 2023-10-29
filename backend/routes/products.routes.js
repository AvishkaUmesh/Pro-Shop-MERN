import express from 'express';
import {
    createProduct,
    getProductById,
    getProducts,
} from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(checkObjectId, getProductById);

export default router;

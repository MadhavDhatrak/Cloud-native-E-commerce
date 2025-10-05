import express from 'express';
const router = express.Router();
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/ProductController.js';
router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;

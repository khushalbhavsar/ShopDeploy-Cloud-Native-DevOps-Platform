import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.put('/:itemId', authMiddleware, updateCartItem);
router.delete('/:itemId', authMiddleware, removeFromCart);
router.delete('/', authMiddleware, clearCart);

export default router;

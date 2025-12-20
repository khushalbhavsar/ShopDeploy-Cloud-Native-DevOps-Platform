import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }

        return successResponse(res, 200, 'Cart retrieved successfully', { cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
    try {
        const { productId, qty = 1 } = req.body;

        // Check if product exists and has stock
        const product = await Product.findById(productId);
        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        if (product.stock < qty) {
            return errorResponse(res, 400, 'Insufficient stock');
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }

        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].qty += qty;
        } else {
            // Add new item
            cart.items.push({
                productId,
                qty,
                priceAtAdd: product.price,
            });
        }

        await cart.save();
        await cart.populate('items.productId');

        return successResponse(res, 200, 'Item added to cart', { cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
    try {
        const { qty } = req.body;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return errorResponse(res, 404, 'Cart not found');
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return errorResponse(res, 404, 'Item not found in cart');
        }

        // Check stock
        const product = await Product.findById(item.productId);
        if (product.stock < qty) {
            return errorResponse(res, 400, 'Insufficient stock');
        }

        item.qty = qty;
        await cart.save();
        await cart.populate('items.productId');

        return successResponse(res, 200, 'Cart updated successfully', { cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return errorResponse(res, 404, 'Cart not found');
        }

        cart.items.pull(itemId);
        await cart.save();
        await cart.populate('items.productId');

        return successResponse(res, 200, 'Item removed from cart', { cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return errorResponse(res, 404, 'Cart not found');
        }

        cart.items = [];
        await cart.save();

        return successResponse(res, 200, 'Cart cleared successfully', { cart });
    } catch (error) {
        next(error);
    }
};

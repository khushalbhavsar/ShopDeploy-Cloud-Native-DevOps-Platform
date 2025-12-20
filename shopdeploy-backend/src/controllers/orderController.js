import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { createPaymentIntent } from '../services/paymentService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // Get user cart
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return errorResponse(res, 400, 'Cart is empty');
        }

        // Validate stock and prepare order items
        const orderItems = [];
        let itemsPrice = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.productId._id);

            if (!product) {
                return errorResponse(res, 404, `Product ${item.productId.title} not found`);
            }

            if (product.stock < item.qty) {
                return errorResponse(res, 400, `Insufficient stock for ${product.title}`);
            }

            orderItems.push({
                productId: product._id,
                title: product.title,
                price: product.price,
                qty: item.qty,
                image: product.images[0]?.url || '',
            });

            itemsPrice += product.price * item.qty;

            // Reduce stock
            product.stock -= item.qty;
            await product.save();
        }

        // Calculate prices
        const shippingPrice = itemsPrice > 500 ? 0 : 50;
        const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // 18% GST
        const totalAmount = itemsPrice + shippingPrice + taxPrice;

        // Create order
        const order = await Order.create({
            userId: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalAmount,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        });

        // Handle Stripe payment
        if (paymentMethod === 'stripe') {
            const paymentIntent = await createPaymentIntent(totalAmount);
            order.paymentId = paymentIntent.id;
            await order.save();
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        return successResponse(res, 201, 'Order created successfully', { order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;
        const orders = await Order.find({ userId: req.user._id })
            .sort('-createdAt')
            .limit(Number(limit))
            .skip(skip);

        const total = await Order.countDocuments({ userId: req.user._id });

        return successResponse(res, 200, 'Orders retrieved successfully', {
            orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const query = status ? { currentStatus: status } : {};
        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .populate('userId', 'name email')
            .sort('-createdAt')
            .limit(Number(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        return successResponse(res, 200, 'Orders retrieved successfully', {
            orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email');

        if (!order) {
            return errorResponse(res, 404, 'Order not found');
        }

        // Check if user owns the order or is admin
        if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return errorResponse(res, 403, 'Not authorized to view this order');
        }

        return successResponse(res, 200, 'Order retrieved successfully', { order });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return errorResponse(res, 404, 'Order not found');
        }

        order.currentStatus = status;
        order.statusHistory.push({
            status,
            note,
            timestamp: new Date(),
        });

        if (status === 'delivered') {
            order.deliveredAt = new Date();
            order.paymentStatus = 'paid';
        }

        if (status === 'cancelled') {
            order.cancelledAt = new Date();

            // Restore stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.qty },
                });
            }
        }

        await order.save();

        return successResponse(res, 200, 'Order status updated successfully', { order });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order (user)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return errorResponse(res, 404, 'Order not found');
        }

        // Check if user owns the order
        if (order.userId.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to cancel this order');
        }

        // Check if order can be cancelled
        if (order.currentStatus === 'cancelled') {
            return errorResponse(res, 400, 'Order is already cancelled');
        }

        if (order.currentStatus === 'delivered') {
            return errorResponse(res, 400, 'Cannot cancel delivered order');
        }

        // Update order status
        order.currentStatus = 'cancelled';
        order.cancelledAt = new Date();
        order.statusHistory.push({
            status: 'cancelled',
            note: 'Cancelled by user',
            timestamp: new Date(),
        });

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.qty },
            });
        }

        await order.save();

        return successResponse(res, 200, 'Order cancelled successfully', { order });
    } catch (error) {
        next(error);
    }
};

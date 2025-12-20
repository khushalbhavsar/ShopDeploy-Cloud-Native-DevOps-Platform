import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    qty: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    priceAtAdd: {
        type: Number,
        required: true,
    },
});

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

// Calculate total items and price
cartSchema.virtual('totalItems').get(function () {
    return this.items.reduce((total, item) => total + item.qty, 0);
});

cartSchema.virtual('totalPrice').get(function () {
    return this.items.reduce((total, item) => total + item.qty * item.priceAtAdd, 0);
});

// Ensure virtuals are included in JSON
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

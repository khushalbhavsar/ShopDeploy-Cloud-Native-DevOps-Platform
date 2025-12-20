import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: 0,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        images: [{
            url: { type: String, required: true },
            publicId: { type: String },
        }],
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        ratingAvg: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
        brand: {
            type: String,
            trim: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Index for search and filtering
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ categoryId: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;

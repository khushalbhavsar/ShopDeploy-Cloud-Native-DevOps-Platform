import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { saveLocalFile, deleteLocalFile } from '../config/cloudinary.js';

// @desc    Get all products with filters, search, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 12,
            search = '',
            category = '',
            minPrice,
            maxPrice,
            sort = '-createdAt',
        } = req.query;

        // Build query
        const query = { isActive: true };

        if (search) {
            query.$text = { $search: search };
        }

        if (category) {
            query.categoryId = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .populate('categoryId', 'name slug')
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        return successResponse(res, 200, 'Products retrieved successfully', {
            products,
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

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId', 'name slug');

        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        return successResponse(res, 200, 'Product retrieved successfully', { product });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
    try {
        const { title, description, price, categoryId, stock, brand, featured } = req.body;

        // Handle image uploads
        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await saveLocalFile(file);
                images.push(result);
            }
        }

        const product = await Product.create({
            title,
            description,
            price,
            categoryId,
            stock,
            brand,
            featured,
            images,
        });

        return successResponse(res, 201, 'Product created successfully', { product });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        // Handle new image uploads
        let newImages = product.images;
        if (req.files && req.files.length > 0) {
            // Delete old images from local storage
            for (const img of product.images) {
                if (img.publicId) {
                    await deleteLocalFile(img.publicId);
                }
            }

            // Upload new images
            newImages = [];
            for (const file of req.files) {
                const result = await saveLocalFile(file);
                newImages.push(result);
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, images: newImages },
            { new: true, runValidators: true }
        );

        return successResponse(res, 200, 'Product updated successfully', { product: updatedProduct });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return errorResponse(res, 404, 'Product not found');
        }

        // Delete images from local storage
        for (const img of product.images) {
            if (img.publicId) {
                await deleteLocalFile(img.publicId);
            }
        }

        await product.deleteOne();

        return successResponse(res, 200, 'Product deleted successfully');
    } catch (error) {
        next(error);
    }
};

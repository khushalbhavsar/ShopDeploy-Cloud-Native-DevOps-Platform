import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true }).sort('name');

        return successResponse(res, 200, 'Categories retrieved successfully', { categories });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }

        return successResponse(res, 200, 'Category retrieved successfully', { category });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
    try {
        const { name, description, image } = req.body;

        const category = await Category.create({
            name,
            description,
            image,
        });

        return successResponse(res, 201, 'Category created successfully', { category });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }

        return successResponse(res, 200, 'Category updated successfully', { category });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }

        return successResponse(res, 200, 'Category deleted successfully');
    } catch (error) {
        next(error);
    }
};

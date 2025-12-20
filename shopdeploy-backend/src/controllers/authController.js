import User from '../models/User.js';
import { generateTokens, setTokenCookies, clearTokenCookies } from '../services/tokenService.js';
import { verifyRefreshToken } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 400, 'User already exists with this email');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            passwordHash: password,
        });

        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user._id);

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        return successResponse(res, 201, 'User registered successfully', {
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user._id);

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        // Remove password from response
        user.passwordHash = undefined;

        return successResponse(res, 200, 'Login successful', {
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return errorResponse(res, 401, 'Refresh token required');
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(token);

        // Find user and verify refresh token matches
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            return errorResponse(res, 401, 'Invalid refresh token');
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

        // Set cookies
        setTokenCookies(res, accessToken, newRefreshToken);

        return successResponse(res, 200, 'Token refreshed successfully', {
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
    try {
        // Clear refresh token from database
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

        // Clear cookies
        clearTokenCookies(res);

        return successResponse(res, 200, 'Logout successful');
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
    try {
        return successResponse(res, 200, 'User retrieved successfully', { user: req.user });
    } catch (error) {
        next(error);
    }
};

import User from '../models/User.js';
import { verifyAccessToken } from '../utils/generateToken.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header or cookie
        let token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        // Get user from database
        const user = await User.findById(decoded.userId).select('-passwordHash -refreshToken');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.',
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.',
            error: error.message,
        });
    }
};

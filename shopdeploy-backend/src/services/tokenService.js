import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import User from '../models/User.js';

export const generateTokens = async (userId) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Save refresh token to database
    await User.findByIdAndUpdate(userId, { refreshToken });

    return { accessToken, refreshToken };
};

export const setTokenCookies = (res, accessToken, refreshToken) => {
    // Set access token cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const clearTokenCookies = (res) => {
    res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
};

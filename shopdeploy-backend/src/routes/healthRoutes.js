import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Ready check endpoint
router.get('/ready', (req, res) => {
    // Add database connection check if needed
    res.status(200).json({
        status: 'READY',
        timestamp: new Date().toISOString()
    });
});

export default router;

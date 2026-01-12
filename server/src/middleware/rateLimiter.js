const rateLimit = require('express-rate-limit');

// Rate limiter: 60 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60,
    message: {
        error: 'Too many requests. Please try again in 15 minutes.',
        retryAfter: 15 * 60
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter };

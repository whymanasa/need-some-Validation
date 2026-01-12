const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const decisionRoutes = require('./routes/decisionRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// CORS - configure for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size

// Rate limiting
app.use('/api', apiLimiter);

// Routes
app.use('/api', decisionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/', (req, res) => {
    res.send('Decision Validator API is running');
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} in ${process.env.NODE_ENV || 'development'} mode`);
});

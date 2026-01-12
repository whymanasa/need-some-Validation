// Global error handler middleware
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);

    // Don't leak stack traces in production
    const isDev = process.env.NODE_ENV !== 'production';

    res.status(err.status || 500).json({
        error: err.message || 'Something went wrong',
        ...(isDev && { stack: err.stack })
    });
}

// 404 handler
function notFoundHandler(req, res) {
    res.status(404).json({ error: 'Endpoint not found' });
}

module.exports = { errorHandler, notFoundHandler };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Error handling middleware
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    console.error('Error:', err.message);
    // If the error doesn't have a status code, default to 500 (Internal Server Error)
    const statusCode = err.status || 500;
    // Send JSON error response
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        status: statusCode,
    });
};
exports.errorHandler = errorHandler;

import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

// Error handling middleware
export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error('Error:', err.message);

  // If the error doesn't have a status code, default to 500 (Internal Server Error)
  const statusCode = err.status || 500;

  // Send JSON error response
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    status: statusCode,
  });
};
// Don't really need this as site is protected, just configure this out on the client side.
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Extend Express Request to include `user`
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Corrected extraction from "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, token is missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden, invalid token' });
      }

      req.user = user; // Attach user information to the request
      next(); // Continue to the protected route
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }
};

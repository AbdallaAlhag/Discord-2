"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
// Don't really need this as site is protected, just configure this out on the client side.
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Corrected extraction from "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token is missing' });
        }
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden, invalid token' });
            }
            req.user = user; // Attach user information to the request
            next(); // Continue to the protected route
        });
    }
    else {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }
};
exports.authenticateJWT = authenticateJWT;

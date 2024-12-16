"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const prisma_1 = __importDefault(require("../db/prisma"));
const passport_jwt_1 = require("passport-jwt");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
// JWT Strategy for protected routes
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}, 
// jwtPayload is the decoded JWT payload
async (jwtPayload, done) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: jwtPayload.id },
        });
        return user ? done(null, user) : done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;

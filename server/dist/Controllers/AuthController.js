"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markOffline = exports.setDefaultPfp = exports.loginAsGuest = exports.login = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../db/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "a santa cat";
const signUp = async (req, res, next) => {
    try {
        const { username, email, name, password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        res
            .status(200)
            .json({ success: true, message: "Successfully Signed up", user });
    }
    catch (err) {
        if (!res.headersSent) {
            next(err); // Passes the error to the error handler only if headers aren't sent
        }
    }
};
exports.signUp = signUp;
// // basic login
// exports.login = (req, res, next) => {
//     passport.authenticate("local", {
//         successRedirect: "/",
//         failureRedirect: "/"
//     })(req, res, next)
//     // don't know if i need (req,res, next) but it works
// }
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
        await prisma_1.default.user.update({
            where: { email },
            data: { onlineStatus: true },
        });
        res.status(200).json({ message: "Successfully Logged in", token, user });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const loginAsGuest = async (req, res, next) => {
    try {
        // Find or create the guest user in the database
        let guestUser = await prisma_1.default.user.findUnique({
            where: { username: "guest" },
        });
        if (!guestUser) {
            // If guest user doesn't exist, create the user
            guestUser = await prisma_1.default.user.create({
                data: {
                    username: "guest",
                    email: "guest@example.com",
                    password: await bcryptjs_1.default.hash("guestguest", 10),
                },
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: guestUser.id, username: guestUser.username }, JWT_SECRET, {
            expiresIn: "1h", // Token expires in 1 hour
        });
        // Send the token and user details back to the client
        res.status(200).json({ message: "Logged in as guest", token });
    }
    catch (error) {
        console.error("Error during guest login:", error);
        next(error);
    }
};
exports.loginAsGuest = loginAsGuest;
// Don't need logout when dealing with authentication with JWT, handled by client side by removing token
// export const logOut = (req: Request, res: Response, next: NextFunction) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     res.status(201).json({ message: 'Successfully logged out' });
//   });
// };
const setDefaultPfp = async (req, res, next) => {
    try {
        const userEmail = req.params.email;
        const { pfp: userPfp } = req.body;
        console.log("userEmail: ", userEmail);
        console.log("userPfp: ", userPfp);
        const user = await prisma_1.default.user.update({
            where: { email: userEmail },
            data: {
                avatarUrl: userPfp,
            },
        });
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        if (!res.headersSent) {
            next(err); // Passes the error to the error handler only if headers aren't sent
        }
    }
};
exports.setDefaultPfp = setDefaultPfp;
const markOffline = async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { onlineStatus: false },
        });
        res.status(200).json({ success: true });
    }
    catch (err) {
        if (!res.headersSent) {
            next(err); // Passes the error to the error handler only if headers aren't sent
        }
    }
};
exports.markOffline = markOffline;

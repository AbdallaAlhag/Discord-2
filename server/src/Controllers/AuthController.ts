import bcrypt from "bcryptjs";
import prisma from "../db/prisma";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "a santa cat";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Successfully Signed up", user });
  } catch (err) {
    if (!res.headersSent) {
      next(err); // Passes the error to the error handler only if headers aren't sent
    }
  }
};
// // basic login
// exports.login = (req, res, next) => {
//     passport.authenticate("local", {
//         successRedirect: "/",
//         failureRedirect: "/"
//     })(req, res, next)
//     // don't know if i need (req,res, next) but it works
// }

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
    res.status(200).json({ message: "Successfully Logged in", token, user });
  } catch (err) {
    next(err);
  }
};
export const loginAsGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find or create the guest user in the database
    let guestUser = await prisma.user.findUnique({
      where: { username: "guest" },
    });

    if (!guestUser) {
      // If guest user doesn't exist, create the user
      guestUser = await prisma.user.create({
        data: {
          username: "guest",
          email: "guest@example.com",
          password: await bcrypt.hash("guestguest", 10),
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: guestUser.id, username: guestUser.username },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    // Send the token and user details back to the client
    res.status(200).json({ message: "Logged in as guest", token });
  } catch (error) {
    console.error("Error during guest login:", error);
    next(error);
  }
};

// Don't need logout when dealing with authentication with JWT, handled by client side by removing token
// export const logOut = (req: Request, res: Response, next: NextFunction) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     res.status(201).json({ message: 'Successfully logged out' });
//   });
// };

export const setDefaultPfp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = req.params.email;
    const { pfp: userPfp } = req.body;
    console.log("userEmail: ", userEmail);
    console.log("userPfp: ", userPfp);
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: {
        avatarUrl: userPfp,
      },
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    if (!res.headersSent) {
      next(err); // Passes the error to the error handler only if headers aren't sent
    }
  }
};

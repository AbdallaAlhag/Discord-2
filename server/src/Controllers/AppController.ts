import { Request, Response, NextFunction } from "express";
import { getServers, getFriends, getUser } from "../db/Queries";
import prisma from "../db/prisma";
import axios from "axios";

export const getServersInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const servers = await getServers(userId);
    res.status(200).json({ servers });
  } catch (err) {
    if (!res.headersSent) {
      next(err); // Passes the error to the error handler only if headers aren't sent
    }
  }
};

export const getFriendsInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const friends = await getFriends(userId);
    res.status(200).json({ friends });
  } catch (err) {
    if (!res.headersSent) {
      next(err); // Passes the error to the error handler only if headers aren't sent
    }
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const user = await getUser(userId);
    // console.log(user);
    res.status(200).json({ user });
  } catch (err) {
    if (!res.headersSent) {
      next(err); // Passes the error to the error handler only if headers aren't sent
    }
  }
};
export const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const { avatarUrl } = req.body;

    if (avatarUrl && avatarUrl !== "") {
      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: avatarUrl },
      });
    } else {
      // find avatarURL
      const avatarIcon = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true },
      });
      if (
        avatarIcon &&
        typeof avatarIcon.avatarUrl === "string" &&
        !avatarIcon.avatarUrl.startsWith("/src/assets/")
      ) {
        const fileKey = avatarIcon.avatarUrl.split("/").pop();
        if (fileKey) {
          try {
            await axios.post(
              `${process.env.VITE_API_BASE_URL}/upload/delete-object`,
              {
                fileKey,
              }
            );
          } catch (error) {
            console.error("Error deleting S3 file:", error);
            throw new Error("Failed to delete server icon from S3.");
          }
        }
        // reset to default pic
        await prisma.user.update({
          where: { id: userId },
          data: { avatarUrl: "/src/assets/defaultPfp/Solid-Blue.png" },
        });
      }
    }
    // console.log(user);
    res.status(200).json({ success: true });
  } catch (err) {
    if (!res.headersSent) {
      next(err); // Passes the error to the error handler only if headers aren't sent
    }
  }
};

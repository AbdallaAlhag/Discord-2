import { Request, Response, NextFunction } from "express";
import { getServers, getFriends, getUser } from "../db/Queries";
export const getServersInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);
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
    const userId = Number(req.params.userId);
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
    const userId = Number(req.params.id);
    const user = await getUser(userId);
    // console.log(user);
    res.status(200).json({ user });
  } catch (err) {
    if (!res.headersSent) {
      next(err); // Passes the error to the error handler only if headers aren't sent
    }
  }
};

import express, { Router, Request, Response, NextFunction } from "express";
import { getChannels } from "../db/Queries";
export const getChannelsInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);
    const channels = await getChannels(userId);
    res.status(200).json({ success: true, channels });
  } catch (err) {
    if (!res.headersSent) {
      next(err); // Passes the error to the error handler only if headers aren't sent
    }
  }
};

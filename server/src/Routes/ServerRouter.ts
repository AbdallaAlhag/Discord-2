import express, { Router, Request, Response, NextFunction } from "express";
import {
  handleCreateServer,
  handleServerChannelsInfo,
  handleCreateChannel,
} from "../Controllers/ServerController";
const router = express.Router();

router.post("/create", (req: Request, res: Response, next: NextFunction) => {
  handleCreateServer(req, res, next);
});

router.post("/createChannel", (req: Request, res: Response, next: NextFunction) => {
  handleCreateChannel(req, res, next);
});

router.get(
  "/channels/:serverId",
  (req: Request, res: Response, next: NextFunction) => {
    handleServerChannelsInfo(req, res, next);
  }
);
export default router;

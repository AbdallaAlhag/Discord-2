import express, { Router, Request, Response, NextFunction } from "express";
import {
  handleCreateServer,
  handleServerChannelsInfo,
  handleCreateChannel,
  handleServerInvite,
  handleAddToServer,
  handleDeleteServer,
  handleGetAllServers,
  handleLeaveServer,
} from "../Controllers/ServerController";
const router = express.Router();

router.get("/servers", (req: Request, res: Response, next: NextFunction) => {
  handleGetAllServers(req, res, next);
});

router.post("/create", (req: Request, res: Response, next: NextFunction) => {
  handleCreateServer(req, res, next);
});

router.post(
  "/createChannel",
  (req: Request, res: Response, next: NextFunction) => {
    handleCreateChannel(req, res, next);
  }
);

router.get(
  "/channels/:serverId",
  (req: Request, res: Response, next: NextFunction) => {
    handleServerChannelsInfo(req, res, next);
  }
);

router.post(
  "/invite/:serverId",
  (req: Request, res: Response, next: NextFunction) => {
    handleServerInvite(req, res, next);
  }
);

router.post(
  "/join/:userId/:serverId",
  (req: Request, res: Response, next: NextFunction) => {
    handleAddToServer(req, res, next);
  }
);

router.delete('/delete/:serverId', (req: Request, res: Response, next: NextFunction) => {
  handleDeleteServer(req, res);
});

router.delete('/leave/:serverId/:userId', (req: Request, res: Response, next: NextFunction) => {
  handleLeaveServer(req, res);
})
export default router;

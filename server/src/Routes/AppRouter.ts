import express, { Router, Request, Response, NextFunction } from "express";
import { getChannelsInfo, getFriendsInfo } from "../Controllers/AppController";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World!");
});

router.get(
  "/channels/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    getChannelsInfo(req, res, next);
  }
);

router.get(
  "/friends/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    getFriendsInfo(req, res, next);
  }
);

export default router;

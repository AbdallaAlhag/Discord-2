import express, { Router, Request, Response, NextFunction } from "express";
import {
  getServersInfo,
  getFriendsInfo,
  getUserInfo,
  updateUserAvatar,
} from "../Controllers/AppController";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World!");
});

router.get(
  "/servers/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    getServersInfo(req, res, next);
  }
);

router.get(
  "/friends/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    getFriendsInfo(req, res, next);
  }
);

router.get("/user/:id", (req: Request, res: Response, next: NextFunction) => {
  getUserInfo(req, res, next);
});

router.post("/user/:id", (req: Request, res: Response, next: NextFunction) => {
  updateUserAvatar(req, res, next);
});
export default router;

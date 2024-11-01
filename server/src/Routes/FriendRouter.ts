// server/src/Routes/friendRouter.ts
import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
} from "../Controllers/FriendController";

const router = express.Router();

// Friend request routes
router.post("/request", sendFriendRequest);
router.post("/accept/:requestId", acceptFriendRequest);

export default router;

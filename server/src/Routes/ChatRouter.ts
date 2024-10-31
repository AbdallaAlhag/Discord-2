// src/Routes/chatRouter.ts
import express from "express";
import {
  handleCreateChannelMessage,
  handleGetChannelMessages,
  handleCreatePrivateMessage,
  handleGetPrivateMessages,
} from "../Controllers/ChatController";

const router = express.Router();

// Routes for channel messages
router.post("/channel/messages", handleCreateChannelMessage);
router.get("/channel/messages/:channelId", handleGetChannelMessages);

// Routes for private messages
router.post("/private/messages", handleCreatePrivateMessage);
router.get("/private/messages/:userId/:friendId", handleGetPrivateMessages);

export default router;

// src/Routes/chatRouter.ts
import express from "express";
import {
  handleCreateChannelMessage,
  handleGetChannelMessages,
  handleCreatePrivateMessage,
  handleGetPrivateMessages,
  handleReadReceipt
} from "../Controllers/ChatController";

const router = express.Router();

// I could probably remove messages from these guys... 

// Routes for channel messages
router.post("/channel/messages", handleCreateChannelMessage);
router.get("/channel/messages/:channelId", handleGetChannelMessages);


// Routes for private messages
router.post("/private/messages", handleCreatePrivateMessage);
router.get("/private/messages/:userId/:friendId", handleGetPrivateMessages);
router.post('/private/messages/:messageId/:userId/read', handleReadReceipt);

export default router;

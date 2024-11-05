// src/Controllers/chatController.ts
import {
  createChannelMessage,
  getChannelMessages,
  createPrivateMessage,
  getPrivateMessages,
} from "../db/messageQueries";
import { Request, Response } from "express";

// Handle creating a channel message
const handleCreateChannelMessage = async (req: Request, res: Response) => {
  const { content, userId, channelId } = req.body;

  try {
    const message = await createChannelMessage(content, userId, channelId);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create channel message" });
  }
};

// Handle retrieving channel messages
const handleGetChannelMessages = async (req: Request, res: Response) => {
  const { channelId } = req.params;

  try {
    const messages = await getChannelMessages(parseInt(channelId));
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve channel messages" });
  }
};

// Handle creating a private message
const handleCreatePrivateMessage = async (req: Request, res: Response) => {
  const { content, senderId, recipientId } = req.body;
  if (!content || !senderId || !recipientId) {
    console.error("Invalid message parameters:", {
      content,
      senderId,
      recipientId,
    });
    return;
  }
  try {
    console.log("flag1");
    const message = await createPrivateMessage(content, senderId, recipientId);
    console.log("flag 2");
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create private message" });
  }
};

// Handle retrieving private messages between users
const handleGetPrivateMessages = async (req: Request, res: Response) => {
  const { userId, friendId } = req.params;

  try {
    const messages = await getPrivateMessages(
      parseInt(userId),
      parseInt(friendId)
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve private messages" });
  }
};

export {
  handleCreateChannelMessage,
  handleGetChannelMessages,
  handleCreatePrivateMessage,
  handleGetPrivateMessages,
};

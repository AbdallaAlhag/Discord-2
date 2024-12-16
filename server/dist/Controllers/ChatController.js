"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReadReceipt = exports.handleGetPrivateMessages = exports.handleCreatePrivateMessage = exports.handleGetChannelMessages = exports.handleCreateChannelMessage = void 0;
// src/Controllers/chatController.ts
const messageQueries_1 = require("../db/messageQueries");
// Handle creating a channel message
const handleCreateChannelMessage = async (req, res) => {
    const { content, userId, channelId } = req.body;
    try {
        const message = await (0, messageQueries_1.createChannelMessage)(content, userId, Number(channelId));
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create channel message" });
    }
};
exports.handleCreateChannelMessage = handleCreateChannelMessage;
// Handle retrieving channel messages
const handleGetChannelMessages = async (req, res) => {
    const { channelId } = req.params;
    try {
        const messages = await (0, messageQueries_1.getChannelMessages)(parseInt(channelId));
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve channel messages" });
    }
};
exports.handleGetChannelMessages = handleGetChannelMessages;
// Handle creating a private message
const handleCreatePrivateMessage = async (req, res) => {
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
        const message = await (0, messageQueries_1.createPrivateMessage)(content, senderId, recipientId);
        // console.log("Private message created:", message);
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create private message" });
    }
};
exports.handleCreatePrivateMessage = handleCreatePrivateMessage;
// Handle retrieving private messages between users
const handleGetPrivateMessages = async (req, res) => {
    const { userId, friendId } = req.params;
    try {
        const messages = await (0, messageQueries_1.getPrivateMessages)(parseInt(userId), parseInt(friendId));
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve private messages" });
    }
};
exports.handleGetPrivateMessages = handleGetPrivateMessages;
const handleReadReceipt = async (req, res) => {
    const { messageId, userId } = req.params;
    try {
        await (0, messageQueries_1.updateReadReceipts)(messageId, Number(userId));
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
};
exports.handleReadReceipt = handleReadReceipt;

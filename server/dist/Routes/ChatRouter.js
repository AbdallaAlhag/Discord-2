"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/Routes/chatRouter.ts
const express_1 = __importDefault(require("express"));
const ChatController_1 = require("../Controllers/ChatController");
const router = express_1.default.Router();
// I could probably remove messages from these guys... 
// Routes for channel messages
router.post("/channel/messages", ChatController_1.handleCreateChannelMessage);
router.get("/channel/messages/:channelId", ChatController_1.handleGetChannelMessages);
// Routes for private messages
router.post("/private/messages", ChatController_1.handleCreatePrivateMessage);
router.get("/private/messages/:userId/:friendId", ChatController_1.handleGetPrivateMessages);
router.post('/private/messages/:messageId/:userId/read', ChatController_1.handleReadReceipt);
exports.default = router;

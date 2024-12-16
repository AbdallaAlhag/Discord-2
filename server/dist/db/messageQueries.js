"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReadReceipts = void 0;
exports.createChannelMessage = createChannelMessage;
exports.getChannelMessages = getChannelMessages;
exports.createPrivateMessage = createPrivateMessage;
exports.getPrivateMessages = getPrivateMessages;
const prisma_1 = __importDefault(require("./prisma"));
// Create a message in a channel
async function createChannelMessage(content, userId, channelId) {
    const message = await prisma_1.default.message.create({
        data: {
            content,
            userId,
            channelId,
            messageType: "CHANNEL",
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatarUrl: true,
                },
            },
        },
    });
    return {
        ...message,
        username: message.user.username,
        avatarUrl: message.user.avatarUrl,
    };
}
// Get all messages for a channel
async function getChannelMessages(channelId) {
    return prisma_1.default.message.findMany({
        where: {
            channelId,
            messageType: "CHANNEL",
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                    createdAt: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}
// Save a new private message
async function createPrivateMessage(content, senderId, recipientId) {
    try {
        // console.log(
        //   "content:",
        //   content,
        //   "senderId:",
        //   senderId,
        //   "recipientId:",
        //   recipientId
        // );
        prisma_1.default.message.create({
            data: {
                content,
                userId: senderId,
                recipientId,
                messageType: "PRIVATE",
            },
        });
        const createdMessage = await prisma_1.default.message.create({
            data: {
                content,
                userId: senderId,
                recipientId,
                messageType: "PRIVATE",
            },
        });
        const sender = await prisma_1.default.user.findUnique({
            where: { id: senderId },
            select: { username: true, avatarUrl: true },
        });
        const recipient = await prisma_1.default.user.findUnique({
            where: { id: recipientId },
            select: { username: true },
        });
        return {
            id: createdMessage.id,
            content: createdMessage.content,
            senderId: createdMessage.userId,
            // senderUsername: sender?.username,
            // senderAvatarUrl: sender?.avatarUrl,
            user: { username: sender?.username, avatarUrl: sender?.avatarUrl },
            createdAt: createdMessage.createdAt,
            recipientId: createdMessage.recipientId,
            recipientUsername: recipient?.username,
        };
    }
    catch (err) {
        console.error("Bug is here creating message:", err);
    }
}
// Get all private messages between two users
async function getPrivateMessages(userId, friendId) {
    return prisma_1.default.message.findMany({
        where: {
            OR: [
                { userId, recipientId: friendId },
                { userId: friendId, recipientId: userId },
            ],
            messageType: "PRIVATE",
        },
        include: {
            user: {
                select: { username: true, avatarUrl: true },
            },
            readReceipts: true,
        },
        orderBy: { createdAt: "asc" },
    });
}
const updateReadReceipts = async (messageId, userId) => {
    try {
        await prisma_1.default.messageReadReceipt.upsert({
            where: {
                messageId_userId: {
                    messageId: parseInt(messageId),
                    userId: userId,
                },
            },
            update: {
                readAt: new Date(),
            },
            create: {
                messageId: parseInt(messageId),
                userId: userId,
            },
        });
    }
    catch (error) {
        console.error("Error updating read receipts:", error);
    }
};
exports.updateReadReceipts = updateReadReceipts;

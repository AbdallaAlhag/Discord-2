"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.declineFriendRequest = exports.getPendingRequests = exports.acceptFriendRequest = exports.sendFriendRequest = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
// Send a friend request
const sendFriendRequest = async (req, res) => {
    const { senderId, recipientId } = req.body;
    try {
        try {
            const existingFriendship = await prisma_1.default.friend.findFirst({
                where: {
                    OR: [
                        { userId: senderId, friendId: recipientId },
                        { userId: recipientId, friendId: senderId },
                    ],
                },
            });
            console.log("Existing friendship:", existingFriendship);
        }
        catch (error) {
            console.error("Error finding friendship:", error);
        }
        // Create a new friend request
        const friendRequest = await prisma_1.default.friendRequest.create({
            data: { senderId, recipientId, status: "PENDING" },
        });
        res.status(201).json(friendRequest);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to send friend request" });
    }
};
exports.sendFriendRequest = sendFriendRequest;
// Accept a friend request
const acceptFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        const request = await prisma_1.default.friendRequest.update({
            where: { id: parseInt(requestId) },
            data: { status: "ACCEPTED" },
            include: { sender: true, recipient: true },
        });
        // Create friendship records for both users
        await prisma_1.default.friend.createMany({
            data: [
                { userId: request.senderId, friendId: request.recipientId },
                { userId: request.recipientId, friendId: request.senderId },
            ],
        });
        res.status(200).json(request);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to accept friend request" });
    }
};
exports.acceptFriendRequest = acceptFriendRequest;
const declineFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        await prisma_1.default.friendRequest.update({
            where: { id: parseInt(requestId) },
            data: { status: "DECLINED" },
        });
        res.status(200).json({ message: "Friend request declined" });
    }
    catch (error) {
        console.error("Error declining friend request:", error);
        res.status(500).json({ error: "Failed to decline friend request" });
    }
};
exports.declineFriendRequest = declineFriendRequest;
const getPendingRequests = async (req, res) => {
    const { userId } = req.params;
    try {
        const pendingRequests = await prisma_1.default.friendRequest.findMany({
            where: {
                recipientId: parseInt(userId),
                status: "PENDING",
            },
            include: {
                sender: {
                    select: { id: true, username: true },
                },
            },
        });
        res.status(200).json(pendingRequests);
        // TODO: Sort pending requests by sender's username
        pendingRequests.sort((a, b) => a.sender.username.localeCompare(b.sender.username));
    }
    catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({ error: "Failed to fetch pending requests" });
    }
};
exports.getPendingRequests = getPendingRequests;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getChannel = exports.getMessages = exports.getFriends = exports.getServers = void 0;
const prisma_1 = __importDefault(require("./prisma"));
// src/db/Queries.ts
// Find all servers where the user is a member
// Include all channels for each server
// Include the user's role information in each server
// Handle errors appropriately
const getServers = async (userId) => {
    if (!userId || isNaN(userId)) {
        console.error("Invalid userId:", userId);
        throw new Error("Valid userId is required");
    }
    try {
        return await prisma_1.default.server.findMany({
            where: {
                members: {
                    some: {
                        userId: {
                            equals: userId,
                        },
                    },
                },
            },
            include: {
                channels: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
    }
    catch (error) {
        console.error("Error fetching channels:", error);
        throw error;
    }
};
exports.getServers = getServers;
const getFriends = async (userId) => {
    try {
        // Retrieve friends where the user is the initiator or recipient in the Friend relationship
        const userWithFriends = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                friends: {
                    include: {
                        friend: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true,
                                onlineStatus: true,
                            },
                        },
                    },
                },
                friendOf: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true,
                                onlineStatus: true,
                            },
                        },
                    },
                },
            },
        });
        // Combine both friend lists, filtering out duplicates by unique `id`
        const friendsList = [
            ...(userWithFriends?.friends.map((f) => f.friend) || []),
            ...(userWithFriends?.friendOf.map((f) => f.user) || []),
        ];
        // Filter out duplicates by unique friend `id`
        const uniqueFriendsList = Array.from(new Map(friendsList.map((friend) => [friend.id, friend])).values());
        // console.log("Unique Friends List:", uniqueFriendsList);
        return uniqueFriendsList;
    }
    catch (error) {
        console.error("Error fetching friends:", error);
        throw error;
    }
};
exports.getFriends = getFriends;
const getMessages = async (channelId) => await prisma_1.default.message.findMany({
    where: { channelId },
    orderBy: { createdAt: "desc" },
    include: { user: true },
});
exports.getMessages = getMessages;
const getChannel = async (channelId) => await prisma_1.default.channel.findUnique({ where: { id: channelId } });
exports.getChannel = getChannel;
const getUser = async (userId) => await prisma_1.default.user.findUnique({
    where: { id: userId },
    select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
    },
});
exports.getUser = getUser;

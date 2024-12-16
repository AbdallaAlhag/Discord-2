"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServer = exports.addToServer = exports.createServerInvite = exports.createChannel = exports.getServerChannelsInfo = exports.createServer = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const createServer = async (name, userId) => {
    return await prisma_1.default.server.create({
        data: {
            name,
            channels: {
                create: [
                    {
                        name: "general",
                    },
                    {
                        name: "General",
                        isVoice: true,
                    },
                ],
            },
            members: {
                create: {
                    userId,
                },
            },
        },
    });
};
exports.createServer = createServer;
const createChannel = async (name, type, isPrivate, serverId) => {
    let isVoice = false;
    if (type === "voice") {
        isVoice = true;
    }
    return await prisma_1.default.channel.create({
        data: {
            name,
            isVoice,
            serverId,
        },
    });
};
exports.createChannel = createChannel;
const getServerChannelsInfo = async (serverId) => {
    return await prisma_1.default.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    user: {
                        select: {
                            username: true,
                            onlineStatus: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
        },
    });
};
exports.getServerChannelsInfo = getServerChannelsInfo;
const createServerInvite = async (serverId, invitedUserId, createdById) => {
    // Generate a random invite code (you can make this more sophisticated)
    const inviteCode = Math.random().toString(36).substring(2, 10);
    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    // Create the invite in the database
    const invite = await prisma_1.default.serverInvite.create({
        data: {
            inviteCode,
            expiresAt,
            server: { connect: { id: serverId } },
            createdBy: { connect: { id: createdById } },
            maxUses: 1,
        },
        include: {
            server: {
                select: {
                    name: true,
                },
            },
        },
    });
    // Create a message to store the invite
    const message = await prisma_1.default.message.create({
        data: {
            content: JSON.stringify({
                type: "invite",
                inviteCode: invite.inviteCode,
                serverName: invite.server.name,
                expiresAt: invite.expiresAt,
                serverId: invite.serverId,
            }),
            messageType: "PRIVATE",
            user: { connect: { id: createdById } },
            recipient: { connect: { id: invitedUserId } },
        },
    });
    return {
        inviteCode: invite.inviteCode,
        expiresAt: invite.expiresAt,
        serverName: invite.server.name,
        serverId: invite.serverId,
    };
};
exports.createServerInvite = createServerInvite;
const addToServer = async (serverId, userId) => {
    try {
        const userExists = await prisma_1.default.user.findUnique({
            where: { id: Number(userId) },
        });
        if (!userExists) {
            console.log("User not found, user id is: ", userId);
            throw new Error("User not found");
        }
        const existingMember = await prisma_1.default.server.findFirst({
            where: {
                id: parseInt(serverId),
                members: {
                    some: {
                        userId: parseInt(userId),
                    },
                },
            },
        });
        if (!existingMember) {
            return await prisma_1.default.server.update({
                where: { id: parseInt(serverId) },
                data: {
                    members: {
                        create: {
                            userId: parseInt(userId),
                        },
                    },
                },
            });
        }
        throw new Error("User is already a member of the server");
    }
    catch (error) {
        console.error("Error adding user to server:", error);
        throw error;
    }
};
exports.addToServer = addToServer;
const deleteServer = async (serverId) => {
    // Delete all reactions related to messages in the server's channels
    await prisma_1.default.reaction.deleteMany({
        where: {
            message: {
                channel: {
                    serverId,
                },
            },
        },
    });
    // Delete all messages in the server's channels
    await prisma_1.default.message.deleteMany({
        where: {
            channelId: {
                in: (await prisma_1.default.channel.findMany({
                    where: { serverId },
                })).map((channel) => channel.id),
            },
        },
    });
    // Delete all permissions related to the server
    await prisma_1.default.permission.deleteMany({
        where: { serverId },
    });
    // Delete all roles related to the server
    await prisma_1.default.role.deleteMany({
        where: { serverId },
    });
    // Delete all invites related to the server
    await prisma_1.default.serverInvite.deleteMany({
        where: { serverId },
    });
    // Delete all server members related to the server
    await prisma_1.default.serverMember.deleteMany({
        where: { serverId },
    });
    // Delete all channels related to the server
    await prisma_1.default.channel.deleteMany({
        where: { serverId },
    });
    // Finally, delete the server
    await prisma_1.default.server.delete({
        where: { id: serverId },
    });
};
exports.deleteServer = deleteServer;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteServer = exports.handleAddToServer = exports.handleServerInvite = exports.handleCreateChannel = exports.handleServerChannelsInfo = exports.handleCreateServer = void 0;
const serverQueries_1 = require("../db/serverQueries");
const prisma_1 = __importDefault(require("../db/prisma"));
const handleCreateServer = async (req, res, next) => {
    const { name, userId } = req.body;
    if (!name || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const serverChannels = await (0, serverQueries_1.createServer)(name, userId);
        return res.status(201).json(serverChannels); // Ensure a response is always returned
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to create server" });
    }
};
exports.handleCreateServer = handleCreateServer;
const handleCreateChannel = async (req, res, next) => {
    const { data: { name, type, isPrivate }, serverId, } = req.body;
    console.log(req.body);
    if (!name || !type || isPrivate === undefined || !serverId) {
        // console.log("name: ", name);
        // console.log("type: ", type);
        // console.log("isPrivate: ", isPrivate);
        // console.log("serverId: ", serverId);
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const serverChannels = await (0, serverQueries_1.createChannel)(name, type, isPrivate, serverId);
        return res.status(201).json(serverChannels); // Ensure a response is always returned
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to create server" });
    }
};
exports.handleCreateChannel = handleCreateChannel;
const handleServerChannelsInfo = async (req, res, next) => {
    const { serverId } = req.params; // Use req.params instead of req.body
    if (!serverId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    // console.log("Requested serverId:", serverId);
    try {
        const serverChannels = await (0, serverQueries_1.getServerChannelsInfo)(Number(serverId));
        // console.log("Server channels:", serverChannels);
        return res.status(201).json(serverChannels); // Ensure a response is always returned
    }
    catch (error) {
        console.error("Error getting server info", error);
        return res.status(500).json({ error: "Failed to get server info" });
    }
};
exports.handleServerChannelsInfo = handleServerChannelsInfo;
const handleServerInvite = async (req, res, next) => {
    const { serverId } = req.params;
    const { invitedUserId, invitedBy } = req.body;
    if (!serverId || !invitedUserId || !invitedBy) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        // Create the invite in the database
        const invite = await (0, serverQueries_1.createServerInvite)(parseInt(serverId), parseInt(invitedUserId), parseInt(invitedBy));
        // Get the server details for the response
        const server = await prisma_1.default.server.findUnique({
            where: { id: parseInt(serverId) },
            select: { name: true },
        });
        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }
        // Return the created invite data
        return res.status(201).json(invite);
    }
    catch (error) {
        console.error("Error creating invite:", error);
        return res.status(500).json({ error: "Failed to create invite" });
    }
};
exports.handleServerInvite = handleServerInvite;
const handleAddToServer = async (req, res, next) => {
    const { userId, serverId } = req.params;
    const { inviteData } = req.body;
    if (!serverId || !userId || !inviteData) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        // make sure server is valid
        const server = await prisma_1.default.server.findUnique({
            where: { id: parseInt(serverId) },
            select: { name: true },
        });
        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }
        // Check if the user is already a member of the server
        const isMember = await prisma_1.default.server.findFirst({
            where: {
                id: parseInt(serverId),
                members: {
                    some: {
                        userId: parseInt(userId),
                    },
                },
            },
        });
        const response = await (0, serverQueries_1.addToServer)(serverId, userId);
        if (isMember) {
            return res
                .status(400)
                .json({ error: "User is already a member of the server" });
        }
        // Return the created invite data
        return res.status(201).json(response);
    }
    catch (error) {
        console.error("Error creating invite:", error);
        return res.status(500).json({ error: "Failed to create invite" });
    }
};
exports.handleAddToServer = handleAddToServer;
const handleDeleteServer = async (req, res, next) => {
    const { serverId } = req.params; // Use req.params instead of req.body
    if (!serverId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    // console.log("Requested serverId:", serverId);
    try {
        const deletedServer = await (0, serverQueries_1.deleteServer)(Number(serverId));
        // console.log("Server channels:", serverChannels);
        return res.status(201).json(deletedServer); // Ensure a response is always returned
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete server" });
    }
};
exports.handleDeleteServer = handleDeleteServer;

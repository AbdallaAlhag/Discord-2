import { Request, Response, NextFunction } from "express";
import {
  createServer,
  createChannel,
  getServerChannelsInfo,
  createServerInvite,
  addToServer,
  deleteServer,
  leaveServer,
} from "../db/serverQueries";
import prisma from "../db/prisma";

const handleGetAllServers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const servers = await prisma.server.findMany({
      include: {
        members: {
          select: { user: { select: { onlineStatus: true, id: true } } },
        },
      },
    });
    return res.status(201).json(servers); // Ensure a response is always returned
  } catch (error) {
    return res.status(500).json({ error: "Failed to get servers" });
  }
};

const handleCreateServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, userId, iconUrl } = req.body;
  if (!name || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const serverChannels = await createServer(name, userId, iconUrl);
    return res.status(201).json(serverChannels); // Ensure a response is always returned
  } catch (error) {
    return res.status(500).json({ error: "Failed to create server" });
  }
};

const handleCreateChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    data: { name, type, isPrivate },
    serverId,
  } = req.body;
  console.log(req.body);
  if (!name || !type || isPrivate === undefined || !serverId) {
    // console.log("name: ", name);
    // console.log("type: ", type);
    // console.log("isPrivate: ", isPrivate);
    // console.log("serverId: ", serverId);
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const serverChannels = await createChannel(name, type, isPrivate, serverId);
    return res.status(201).json(serverChannels); // Ensure a response is always returned
  } catch (error) {
    return res.status(500).json({ error: "Failed to create server" });
  }
};

const handleServerChannelsInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serverId } = req.params; // Use req.params instead of req.body
  if (!serverId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // console.log("Requested serverId:", serverId);

  try {
    const serverChannels = await getServerChannelsInfo(serverId);
    // console.log("Server channels:", serverChannels);
    return res.status(201).json(serverChannels); // Ensure a response is always returned
  } catch (error) {
    console.error("Error getting server info", error);
    return res.status(500).json({ error: "Failed to get server info" });
  }
};

const handleServerInvite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serverId } = req.params;
  const { invitedUserId, invitedBy } = req.body;

  if (!serverId || !invitedUserId || !invitedBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create the invite in the database
    const invite = await createServerInvite(serverId, invitedUserId, invitedBy);

    // Get the server details for the response
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      select: { name: true },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // Return the created invite data
    return res.status(201).json(invite);
  } catch (error) {
    console.error("Error creating invite:", error);
    return res.status(500).json({ error: "Failed to create invite" });
  }
};

const handleAddToServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, serverId } = req.params;
  const { inviteData } = req.body;

  // if (!serverId || !userId || !inviteData) {
  if (!serverId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // make sure server is valid
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      select: { name: true },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // Check if the user is already a member of the server
    const isMember = await prisma.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    const response = await addToServer(serverId, userId);

    if (isMember) {
      return res
        .status(400)
        .json({ error: "User is already a member of the server" });
    }

    // Return the created invite data
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error creating invite:", error);
    return res.status(500).json({ error: "Failed to create invite" });
  }
};

const handleDeleteServer = async (req: Request, res: Response) => {
  const { serverId } = req.params; // Use req.params instead of req.body
  if (!serverId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // console.log("Requested serverId:", serverId);

  try {
    const deletedServer = await deleteServer(serverId);
    // console.log("Server channels:", serverChannels);
    return res.status(201).json(deletedServer); // Ensure a response is always returned
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete server" });
  }
};

const handleLeaveServer = async (req: Request, res: Response) => {
  const { serverId, userId } = req.params; // Use req.params instead of req.body

  if (!serverId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await leaveServer(serverId, userId);
    // console.log("Server channels:", serverChannels);
    return res.status(201); // Ensure a response is always returned
  } catch (error) {
    return res.status(500).json({ error: "Failed to leave server" });
  }
};

export {
  handleCreateServer,
  handleServerChannelsInfo,
  handleCreateChannel,
  handleServerInvite,
  handleAddToServer,
  handleDeleteServer,
  handleGetAllServers,
  handleLeaveServer,
};

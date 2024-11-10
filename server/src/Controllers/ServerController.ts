import { Request, Response, NextFunction } from "express";
import {
  createServer,
  createChannel,
  getServerChannelsInfo,
  createServerInvite,
  addToServer,
} from "../db/serverQueries";
import prisma from "../db/prisma";

const handleCreateServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, userId } = req.body;
  if (!name || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const serverChannels = await createServer(name, userId);
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
    console.log("name: ", name);
    console.log("type: ", type);
    console.log("isPrivate: ", isPrivate);
    console.log("serverId: ", serverId);
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
  console.log("Requested serverId:", serverId);

  try {
    const serverChannels = await getServerChannelsInfo(Number(serverId));
    // console.log("Server channels:", serverChannels);
    return res.status(201).json(serverChannels); // Ensure a response is always returned
  } catch (error) {
    return res.status(500).json({ error: "Failed to create server" });
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
    const invite = await createServerInvite(
      parseInt(serverId),
      parseInt(invitedUserId),
      parseInt(invitedBy)
    );

    // Get the server details for the response
    const server = await prisma.server.findUnique({
      where: { id: parseInt(serverId) },
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

  if (!serverId || !userId || !inviteData) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // make sure server is valid
    const server = await prisma.server.findUnique({
      where: { id: parseInt(serverId) },
      select: { name: true },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // Check if the user is already a member of the server
    const isMember = await prisma.server.findFirst({
      where: {
        id: parseInt(serverId),
        members: {
          some: {
            userId: parseInt(userId),
          },
        },
      },
    });

    const response = await addToServer(userId, serverId);

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
export {
  handleCreateServer,
  handleServerChannelsInfo,
  handleCreateChannel,
  handleServerInvite,
  handleAddToServer,
};

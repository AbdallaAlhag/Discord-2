import { Request, Response, NextFunction } from "express";
import {
  createServer,
  createChannel,
  getServerChannelsInfo,
} from "../db/serverQueries";

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
  const { data: { name, type, isPrivate }, serverId } = req.body;
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

export { handleCreateServer, handleServerChannelsInfo, handleCreateChannel };

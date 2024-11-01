// server/src/Controllers/FriendController.ts
import { Request, Response } from "express";
import prisma from "../db/prisma";

// Send a friend request
const sendFriendRequest = async (req: Request, res: Response): Promise<any> => {
  const { senderId, recipientId } = req.body;

  try {
    // Check if the friendship already exists
    const existingFriendship = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: senderId, friendId: recipientId },
          { userId: recipientId, friendId: senderId },
        ],
      },
    });

    if (existingFriendship) {
      return res.status(400).json({ error: "Friendship already exists" });
    }

    // Create a new friend request
    const friendRequest = await prisma.friendRequest.create({
      data: { senderId, recipientId, status: "PENDING" },
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to send friend request" });
  }
};

// Accept a friend request
const acceptFriendRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;

  try {
    const request = await prisma.friendRequest.update({
      where: { id: parseInt(requestId) },
      data: { status: "ACCEPTED" },
      include: { sender: true, recipient: true },
    });

    // Create friendship records for both users
    await prisma.friend.createMany({
      data: [
        { userId: request.senderId, friendId: request.recipientId },
        { userId: request.recipientId, friendId: request.senderId },
      ],
    });

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: "Failed to accept friend request" });
  }
};

export { sendFriendRequest, acceptFriendRequest };

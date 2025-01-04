// server/src/Controllers/FriendController.ts
import { Request, Response } from "express";
import prisma from "../db/prisma";

// Send a friend request
const sendFriendRequest = async (req: Request, res: Response): Promise<any> => {
  const { senderId, recipientId } = req.body;
  try {
    try {
      const existingFriendship = await prisma.friend.findFirst({
        where: {
          OR: [
            { userId: senderId, friendId: recipientId },
            { userId: recipientId, friendId: senderId },
          ],
        },
      });
      console.log("Existing friendship:", existingFriendship);
    } catch (error) {
      console.error("Error finding friendship:", error);
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
      where: { id: requestId },
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

const declineFriendRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;

  try {
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "DECLINED" },
    });

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.error("Error declining friend request:", error);
    res.status(500).json({ error: "Failed to decline friend request" });
  }
};

const getPendingRequests = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const pendingRequests = await prisma.friendRequest.findMany({
      where: {
        recipientId: userId,
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
    pendingRequests.sort((a, b) =>
      a.sender.username.localeCompare(b.sender.username)
    );
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
};

export {
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
  declineFriendRequest,
};

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

const grabSuggestedUsers = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Step 1: Get the friends of the user
    const friends = await prisma.friend.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            onlineStatus: true,
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            onlineStatus: true,
          },
        },
      },
    });

    // Step 2: If the user has friends, get their friends, filtering out those already friends with the user
    if (friends.length > 0) {
      const suggestedUsers = friends
        .flatMap((f) => [f.user, f.friend])
        .filter((u) => u.id !== userId) // Exclude the user from the suggestions
        .reduce((acc, cur) => {
          if (!acc.find((u) => String(u.id) === cur.id)) {
            acc.push(cur);
          }
          return acc;
        }, [] as { id: string; username: string; avatarUrl: string | null; onlineStatus: boolean }[]);

      // Step 3: Fetch friends of friends who are not already friends with the user
      const secondDegreeFriends = await prisma.friend.findMany({
        where: {
          OR: [
            { userId: { in: friends.map((f) => f.friendId) } },
            { friendId: { in: friends.map((f) => f.friendId) } },
          ],
          NOT: {
            OR: [{ userId: userId }, { friendId: userId }], // Filter out direct friends
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              onlineStatus: true,
            },
          },
          friend: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              onlineStatus: true,
            },
          },
        },
      });

      const filteredSecondDegreeFriends = secondDegreeFriends
        .flatMap((f) => [f.user, f.friend])
        .filter((u) => u.id !== userId) // Exclude the user
        .reduce((acc, cur) => {
          if (!acc.find((u) => String(u.id) === cur.id)) {
            acc.push(cur);
          }
          return acc;
        }, [] as { id: string; username: string; avatarUrl: string | null; onlineStatus: boolean }[]);

      // Combine the suggested first-degree and second-degree friends
      const allSuggestedUsers = [
        ...suggestedUsers,
        ...filteredSecondDegreeFriends,
      ];

      console.log("Suggested users:", allSuggestedUsers);

      // Return suggested users
      res.json(allSuggestedUsers);
    } else {
      // Step 4: If no friends, get 5 random users who are not friends
      const randomUsers = await prisma.user.findMany({
        take: 5,
        skip: Math.floor(Math.random() * (await prisma.user.count())),
        where: {
          id: {
            notIn: friends.flatMap((f) => [f.userId, f.friendId]),
          },
        },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          onlineStatus: true,
        },
      });
      console.log("random users:", randomUsers);

      res.json(randomUsers);
    }
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    res.status(500).json({ error: "Failed to fetch suggested users" });
  }
};

export {
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
  declineFriendRequest,
  grabSuggestedUsers,
};

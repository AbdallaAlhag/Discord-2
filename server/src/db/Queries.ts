import prisma from "./prisma";

// src/db/Queries.ts
// Find all servers where the user is a member
// Include all channels for each server
// Include the user's role information in each server
// Handle errors appropriately
export const getServers = async (userId: number) => {
  if (!userId || isNaN(userId)) {
    console.error("Invalid userId:", userId);
    throw new Error("Valid userId is required");
  }

  try {
    return await prisma.server.findMany({
      where: {
        members: {
          some: {
            userId: {
              equals: String(userId),
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
  } catch (error) {
    console.error("Error fetching channels:", error);
    throw error;
  }
};

export const getFriends = async (userId: number) => {
  try {
    // Retrieve friends where the user is the initiator or recipient in the Friend relationship
    const userWithFriends = await prisma.user.findUnique({
      where: { id: userId.toString() },
      include: {
        friends: {
          include: {
            friend: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
                onlineStatus: true,
                memberships: {
                  select: {
                    serverId: true,
                    role: true,
                  },
                },
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
                memberships: {
                  select: {
                    serverId: true,
                    role: true,
                  },
                },
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
    const uniqueFriendsList = Array.from(
      new Map(friendsList.map((friend) => [friend.id, friend])).values()
    );

    // console.log("Unique Friends List:", uniqueFriendsList);
    return uniqueFriendsList;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const getMessages = async (channelId: number) =>
  await prisma.message.findMany({
    where: { channelId: channelId.toString() },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

export const getChannel = async (channelId: number) =>
  await prisma.channel.findUnique({ where: { id: String(channelId) } });

export const getUser = async (userId: number) =>
  await prisma.user.findUnique({
    where: { id: String(userId) },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      memberships: {
        select: {
          serverId: true,
          role: true,
          server: {
            select: {
              name: true,
              iconUrl: true,
            },
          },
        },
      },
    },
  });

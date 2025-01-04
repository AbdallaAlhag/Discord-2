import prisma from "./prisma";
import axios from "axios";

const createServer = async (name: string, userId: number, iconUrl: string) => {
  return await prisma.server.create({
    data: {
      name,
      iconUrl,
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
          userId: String(userId),
          role: "OWNER", // Server creator is automatically owner
        },
      },
    },
  });
};

const createChannel = async (
  name: string,
  type: "text" | "voice",
  isPrivate: boolean,
  serverId: number
) => {
  let isVoice = false;
  if (type === "voice") {
    isVoice = true;
  }
  return await prisma.channel.create({
    data: {
      name,
      isVoice,
      serverId: serverId.toString(),
    },
  });
};
const getServerChannelsInfo = async (serverId: number) => {
  return await prisma.server.findUnique({
    where: {
      id: String(serverId),
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
              id: true,
            },
          },
        },
      },
    },
  });
};

const createServerInvite = async (
  serverId: number,
  invitedUserId: number,
  createdById: number
) => {
  // Generate a random invite code (you can make this more sophisticated)
  const inviteCode = Math.random().toString(36).substring(2, 10);

  // Calculate expiration date (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create the invite in the database
  const invite = await prisma.serverInvite.create({
    data: {
      inviteCode,
      expiresAt,
      server: { connect: { id: serverId.toString() } },
      createdBy: { connect: { id: createdById.toString() } },
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
  const message = await prisma.message.create({
    data: {
      content: JSON.stringify({
        type: "invite",
        inviteCode: invite.inviteCode,
        serverName: invite.server.name,
        expiresAt: invite.expiresAt,
        serverId: invite.serverId,
      }),
      messageType: "PRIVATE",
      user: { connect: { id: createdById.toString() } },
      recipient: { connect: { id: invitedUserId.toString() } },
    },
  });

  return {
    inviteCode: invite.inviteCode,
    expiresAt: invite.expiresAt,
    serverName: invite.server.name,
    serverId: invite.serverId,
  };
};

const addToServer = async (serverId: string, userId: string) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.log("User not found, user id is: ", userId);
      throw new Error("User not found");
    }

    const existingMember = await prisma.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!existingMember) {
      return await prisma.server.update({
        where: { id: serverId },
        data: {
          members: {
            create: {
              userId: userId,
            },
          },
        },
      });
    }

    throw new Error("User is already a member of the server");
  } catch (error) {
    console.error("Error adding user to server:", error);
    throw error;
  }
};

const deleteServer = async (serverId: number) => {
  // Fetch the server to get the icon URL
  const server = await prisma.server.findUnique({
    where: { id: serverId.toString() },
    select: { iconUrl: true },
  });

  if (!server) {
    throw new Error(`Server with ID ${serverId} not found.`);
  }

  if (server.iconUrl) {
    // Parse the file name from the icon URL
    const iconUrl = server.iconUrl;
    const fileKey = iconUrl.split("/").pop(); // Extracts the file name from the URL
    // Call the delete-object route if iconUrl exists
    if (fileKey) {
      try {
        await axios.post(
          `${process.env.VITE_API_BASE_URL}/upload/delete-object`,
          {
            fileKey,
          }
        );
      } catch (error) {
        console.error("Error deleting S3 file:", error);
        throw new Error("Failed to delete server icon from S3.");
      }
    }
  }

  // Delete all reactions related to messages in the server's channels
  await prisma.reaction.deleteMany({
    where: {
      message: {
        channel: {
          serverId: serverId.toString(),
        },
      },
    },
  });

  // Delete all messages in the server's channels
  await prisma.message.deleteMany({
    where: {
      channelId: {
        in: (
          await prisma.channel.findMany({
            where: { serverId: serverId.toString() },
          })
        ).map((channel) => channel.id),
      },
    },
  });

  await prisma.serverInvite.deleteMany({
    where: { serverId: serverId.toString() },
  });

  // Delete all server members related to the server
  await prisma.serverMember.deleteMany({
    where: { serverId: serverId.toString() },
  });

  // Delete all channels related to the server
  await prisma.channel.deleteMany({
    where: { serverId: serverId.toString() },
  });

  // Finally, delete the server
  await prisma.server.delete({
    where: { id: serverId.toString() },
  });
};

const leaveServer = async (serverId: number, userId: number) => {
  try {
    const deletedMember = await prisma.serverMember.delete({
      where: {
        userId_serverId: {
          userId: userId.toString(),
          serverId: serverId.toString(),
        },
      },
    });
    console.log(`User with ID ${userId} left server with ID ${serverId}`);
    return deletedMember;
  } catch (error) {
    console.error("Error leaving server:", error);
    throw new Error("Could not leave server. Please check the inputs.");
  }
};

export {
  createServer,
  getServerChannelsInfo,
  createChannel,
  createServerInvite,
  addToServer,
  deleteServer,
  leaveServer,
};

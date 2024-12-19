import prisma from "./prisma";

const createServer = async (name: string, userId: number) => {
  return await prisma.server.create({
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
      serverId,
    },
  });
};
const getServerChannelsInfo = async (serverId: number) => {
  return await prisma.server.findUnique({
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

const addToServer = async (serverId: string, userId: string) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      console.log("User not found, user id is: ", userId);
      throw new Error("User not found");
    }

    const existingMember = await prisma.server.findFirst({
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
      return await prisma.server.update({
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
  } catch (error) {
    console.error("Error adding user to server:", error);
    throw error;
  }
};

const deleteServer = async (serverId: number) => {
  // Delete all reactions related to messages in the server's channels
  await prisma.reaction.deleteMany({
    where: {
      message: {
        channel: {
          serverId,
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
            where: { serverId },
          })
        ).map((channel) => channel.id),
      },
    },
  });

  // Delete all permissions related to the server
  await prisma.permission.deleteMany({
    where: { serverId },
  });

  // Delete all roles related to the server
  await prisma.role.deleteMany({
    where: { serverId },
  });

  // Delete all invites related to the server
  await prisma.serverInvite.deleteMany({
    where: { serverId },
  });

  // Delete all server members related to the server
  await prisma.serverMember.deleteMany({
    where: { serverId },
  });

  // Delete all channels related to the server
  await prisma.channel.deleteMany({
    where: { serverId },
  });

  // Finally, delete the server
  await prisma.server.delete({
    where: { id: serverId },
  });
};

const leaveServer = async (serverId: number, userId: number) => {
  try {
    const deletedMember = await prisma.serverMember.delete({
      where: {
        userId_serverId: {
          userId,
          serverId,
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

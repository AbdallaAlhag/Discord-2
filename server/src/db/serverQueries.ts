import prisma from "./prisma";

const createServer = async (name: string, userId: number) => {
  return await prisma.server.create({
    data: {
      name,
      channels: {
        create: {
          name: "general",
        },
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
  };
};

export {
  createServer,
  getServerChannelsInfo,
  createChannel,
  createServerInvite,
};

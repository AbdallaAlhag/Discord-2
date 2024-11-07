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

export { createServer, getServerChannelsInfo, createChannel };

import prisma from "./prisma";

// src/db/Queries.ts
// Find all servers where the user is a member
// Include all channels for each server
// Include the user's role information in each server
// Handle errors appropriately
export const getChannels = async (userId: number) => {
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
              equals: userId,
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
export const getMessages = async (channelId: number) =>
  await prisma.message.findMany({
    where: { channelId },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

export const getChannel = async (channelId: number) =>
  await prisma.channel.findUnique({ where: { id: channelId } });

export const getUser = async (userId: number) =>
  await prisma.user.findUnique({ where: { id: userId } });

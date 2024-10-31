import prisma from "./prisma";

// Create a message in a channel
async function createChannelMessage(
  content: string,
  userId: number,
  channelId: number
) {
  return prisma.message.create({
    data: {
      content,
      userId,
      channelId,
      messageType: "CHANNEL",
    },
  });
}

// Get all messages for a channel
async function getChannelMessages(channelId: number) {
  return prisma.message.findMany({
    where: {
      channelId,
      messageType: "CHANNEL",
    },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
}

// Save a new private message
async function createPrivateMessage(
  content: string,
  userId: number,
  recipientId: number
) {
  return prisma.message.create({
    data: {
      content,
      userId,
      recipientId,
      messageType: "PRIVATE",
    },
  });
}

// Get all private messages between two users
async function getPrivateMessages(userId: number, friendId: number) {
  return prisma.message.findMany({
    where: {
      OR: [
        { userId, recipientId: friendId },
        { userId: friendId, recipientId: userId },
      ],
      messageType: "PRIVATE",
    },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
}

export {
  createChannelMessage,
  getChannelMessages,
  createPrivateMessage,
  getPrivateMessages,
};

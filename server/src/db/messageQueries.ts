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
  senderId: number,
  recipientId: number
) {
  try {
    // console.log(
    //   "content:",
    //   content,
    //   "senderId:",
    //   senderId,
    //   "recipientId:",
    //   recipientId
    // );
    prisma.message.create({
      data: {
        content,
        userId: senderId,
        recipientId,
        messageType: "PRIVATE",
      },
    });
    const createdMessage = await prisma.message.create({
      data: {
        content,
        userId: senderId,
        recipientId,
        messageType: "PRIVATE",
      },
    });

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { username: true },
    });

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { username: true },
    });

    return {
      id: createdMessage.id,
      content: createdMessage.content,
      senderId: createdMessage.userId,
      senderUsername: sender?.username,
      createdAt: createdMessage.createdAt,
      recipientId: createdMessage.recipientId,
      recipientUsername: recipient?.username,
    };
  } catch (err) {
    console.error("Bug is here creating message:", err);
  }
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
    include: {
      user: {
        select: { username: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export {
  createChannelMessage,
  getChannelMessages,
  createPrivateMessage,
  getPrivateMessages,
};

import prisma from "./prisma";

// Create a message in a channel
async function createChannelMessage(
  content: string,
  userId: number,
  channelId: number
) {
  const message = await prisma.message.create({
    data: {
      content,
      userId: userId.toString(),
      channelId: channelId.toString(),
      messageType: "CHANNEL",
    },
    include: {
      user: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return {
    ...message,
    username: message.user.username,
    avatarUrl: message.user.avatarUrl,
  };
}

// Get all messages for a channel
async function getChannelMessages(channelId: number) {
  return prisma.message.findMany({
    where: {
      channelId: channelId.toString(),
      messageType: "CHANNEL",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          createdAt: true,
          email: true,
        },
      },
    },
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
        userId: senderId.toString(),
        recipientId: recipientId.toString(),
        messageType: "PRIVATE",
      },
    });
    const createdMessage = await prisma.message.create({
      data: {
        content,
        userId: senderId.toString(),
        recipientId: recipientId.toString(),
        messageType: "PRIVATE",
      },
    });

    const sender = await prisma.user.findUnique({
      where: { id: String(senderId) },
      select: { username: true, avatarUrl: true },
    });

    const recipient = await prisma.user.findUnique({
      where: { id: String(recipientId) },
      select: { username: true },
    });

    return {
      id: createdMessage.id,
      content: createdMessage.content,
      senderId: createdMessage.userId,
      // senderUsername: sender?.username,
      // senderAvatarUrl: sender?.avatarUrl,
      user: { username: sender?.username, avatarUrl: sender?.avatarUrl },
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
        { userId: String(userId), recipientId: String(friendId) },
        { userId: String(friendId), recipientId: String(userId) },
      ],
      messageType: "PRIVATE",
    },
    include: {
      user: {
        select: { username: true, avatarUrl: true },
      },
      readReceipts: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

const updateReadReceipts = async (messageId: string, userId: number) => {
  try {
    await prisma.messageReadReceipt.upsert({
      where: {
        messageId_userId: {
          messageId: messageId,
          userId: userId.toString(),
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        messageId: messageId,
        userId: userId.toString(),
      },
    });
  } catch (error) {
    console.error("Error updating read receipts:", error);
  }
};

export {
  createChannelMessage,
  getChannelMessages,
  createPrivateMessage,
  getPrivateMessages,
  updateReadReceipts,
};

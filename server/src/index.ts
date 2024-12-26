import dotenv from "dotenv";
dotenv.config();
import express from "express";
import prisma from "./db/prisma";
import cors from "cors";
import authRouter from "./Routes/AuthRouter";
import appRouter from "./Routes/AppRouter";
import chatRouter from "./Routes/ChatRouter";
import friendRouter from "./Routes/FriendRouter";
import serverRouter from "./Routes/ServerRouter";
import uploadRouter from "./Routes/UploadRouter";
import { errorHandler } from "./Middleware/ErrorHandler";
import passport from "./Auth/passportConfig";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost:5713";
// socket.io setup
const server = http.createServer(app); // Create HTTP server with Express app
// Socket.IO cors Configuration: Added CORS settings specifically for the Socket.IO instance, targeting http://localhost:5173 (the default for Vite) to avoid connection issues.
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://discord-2.netlify.app",
      "https://discord-2-production.up.railway.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

console.log("Backend server has started..."); // This should log when the server starts

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// Set up routing and middleware
app.use("/", appRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/friends", friendRouter);
app.use("/server", serverRouter);
app.use("/upload", uploadRouter);
app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://discord-2.netlify.app",
      "https://discord-2-production.up.railway.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Track active users
const activeUsers = new Map();
let activeRooms = new Map(); // Track active room memberships

io.on("connection", async (socket) => {
  // console.log(socket.id, " has connected");
  const { userId } = socket.handshake.query;
  if (!userId || userId === null) {
    console.log("User connected without userId!");
    return;
  }

  const numericUserId = Number(userId);
  if (isNaN(numericUserId)) {
    console.error("Invalid userId:", userId);
    return;
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: numericUserId },
    });

    if (!userExists) {
      console.error("User not found with ID:", numericUserId);
      return;
    }

    await prisma.user.update({
      where: { id: numericUserId },
      data: { onlineStatus: true },
    });
    console.log(`User ${numericUserId} marked as online.`);
  } catch (err) {
    console.error("Error updating user status:", err);
  }

  // Join user-specific room
  userId && socket.join(userId.toString());
  activeUsers.set(userId, socket.id);
  // console.log("activeUsers: ", activeUsers);
  // console.log(`User ${userId} connected and joined room`);

  // Handle private message
  socket.on("private_message", async (messageData) => {
    console.log("messageData: ", messageData);
    if (messageData.recipientId) {
      //       io.to(`${messageData.recipientId}`).to(`${messageData.senderId}`).emit(
      io.to(messageData.recipientId.toString()).emit(
        "private_message",
        messageData
      );
    }

    // Count unread messages for recipient
    const unreadCount = await prisma.message.count({
      where: {
        recipientId: messageData.recipientId,
        userId: messageData.senderId,
        readReceipts: {
          none: {}, // Messages with no read receipts
        },
      },
    });

    // Emit to specific user
    io.to(messageData.recipientId.toString()).emit(
      "private-message-notification",
      {
        message: messageData,
        unreadCount: unreadCount,
      }
    );
  });

  // Handle server and channel messages
  socket.on("join_server", (serverId) => {
    socket.join(`server-${serverId}`);
    // console.log(`User ${userId} joined server ${serverId}`);
  });

  socket.on("join_channel", (channelId) => {
    socket.join(`channel-${channelId}`);
    // console.log(`User ${userId} joined channel ${channelId}`);
  });

  socket.on("leave_channel", (channelId) => {
    socket.leave(`channel-${channelId}`);
    // console.log(`User ${userId} left channel ${channelId}`);
  });

  socket.on("server_message", (messageData) => {
    // console.log("server message data: ", messageData);
    if (messageData.channelId) {
      // console.log("server message recieved");
      io.to(`channel-${messageData.channelId}`).emit(
        "server_message",
        messageData
      );
    }
  });

  // Handle typing indicator
  socket.on("typing", (recipientId) => {
    const recipientSocketId = activeUsers.get(recipientId.toString());
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("user_typing", userId);
    }
  });

  // server typing indicator
  socket.on("group_typing", ({ groupId, userId }) => {
    // Broadcast typing event to other group members
    socket.to(`channel-${groupId}`).emit("user_group_typing", {
      groupId,
      userId,
    });
  });

  socket.on("stop_group_typing", ({ groupId, userId }) => {
    // Broadcast stop typing event to other group members
    socket.to(`channel-${groupId}`).emit("user_stop_group_typing", {
      groupId,
      userId,
    });
  });

  // Handle read receipt
  socket.on("read_receipt", ({ messageId, senderId, readBy, readAt }) => {
    console.log("read receipt: ", messageId, readBy.toString());
    const senderSocketId = activeUsers.get(senderId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("message_read", {
        messageId,
        senderId,
        readBy,
        readAt,
      });
    }
  });

  socket.on("ping_presence", ({ userId }) => {
    prisma.user
      .update({
        where: { id: userId },
        data: { onlineStatus: true },
      })
      .catch((err) => console.error("Error updating ping presence:", err));
  });
  // Handle disconnect
  // socket.on("disconnect", () => {
  //   // console.log(`User ${userId} disconnected`);
  //   activeUsers.delete(userId);
  // });
  socket.on("disconnect", () => {
    const userSession = activeUsers.get(socket.id);
    prisma.user
      .update({
        where: { id: Number(userId) },
        data: {
          onlineStatus: false,
        },
      })
      .catch((err) =>
        console.error("Error updating user status on disconnect:", err)
      );

    if (userSession) {
      const { roomId, userId } = userSession;
      // console.log(`[DEBUG]User ${userId} left room voice ${roomId}`);

      // Notify others in the room
      socket.to(roomId).emit("peer_left", {
        socketId: socket.id,
        userId: userId,
      });

      activeUsers.delete(socket.id);
    }
  });

  // webrtc setup
  socket.on("join_room", (roomId, streamId) => {
    const userId = socket.handshake.query.userId;
    if (activeRooms.has(userId)) return;
    // console.log("[DEBUG] user has joined room");
    if (!userId) {
      console.error("User tried to join room without userId");
      return;
    }

    activeRooms.set(socket.id, { roomId, userId, streamId });
    // activeRooms.set(userId, { roomId, userId, streamId });
    // console.log("[DEBUG] activeRooms: ", activeRooms);

    const room = io.sockets.adapter.rooms.get(roomId) || new Set();
    socket.join(roomId);
    // console.log(`[DEBUG] User ${userId} joined room voice ${roomId}`);

    socket.to(roomId).emit("user_joined", { socketId: socket.id, userId });
  });

  // WebRTC Signaling for Peer Connection
  socket.on("offer", (data) => {
    socket.to(data.to).emit("offer", {
      offer: data.offer,
      from: socket.id,
      userId: userId,
    });
  });

  socket.on("answer", (data) => {
    socket.to(data.to).emit("answer", {
      answer: data.answer,
      from: socket.id,
    });
  });

  socket.on("ice_candidate", (data) => {
    socket.to(data.to).emit("ice_candidate", {
      candidate: data.candidate,
      from: socket.id,
    });
  });

  // socket.on("leave_room", (roomId) => {
  //   console.log(`User left room voice ${roomId}`);
  //   socket.leave(roomId);
  //   socket.to(roomId).emit("peer_left", { socketId: socket.id });
  // });
  socket.on("leave_room", (roomId, socketId) => {
    const userSession = activeRooms.get(socketId);
    // console.log("[DEBUG] are we receiving this? ", userSession);
    if (userSession) {
      const { userId, streamId } = userSession;
      socket.leave(roomId);
      // console.log(`[DEBUG] User ${userId} left room voice ${roomId}`);

      socket.to(roomId).emit("peer_left", {
        socketId: socket.id,
        userId,
        streamId,
      });

      activeRooms.delete(socketId);
      // console.log("[DEBUG] activeRooms after delete: ", activeRooms);
    } else {
      console.warn(`No session found for socket ID: ${socket.id}`);
    }

    if (activeRooms.size === 0) {
      // console.log("[DEBUG] activeRooms is empty");
      activeRooms.clear();
    }
  });
});

// Handle graceful shutdowns for Prisma
// process.on("SIGINT", async () => {
//   console.log("Received SIGINT, disconnecting from database");
//   await prisma.$disconnect();
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   console.log("Received SIGTERM, disconnecting from database");
//   await prisma.$disconnect();
//   process.exit(0);
// });

// Add graceful shutdown handlers
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed");

    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  await prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Start the combined HTTP and WebSocket server
// Single server.listen Call: We call server.listen(PORT) instead of app.listen, ensuring that both the Express and WebSocket servers are served from the same port.
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

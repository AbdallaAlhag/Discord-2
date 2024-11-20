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
import { errorHandler } from "./Middleware/ErrorHandler";
import passport from "./Auth/passportConfig";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;

// socket.io setup
const server = http.createServer(app); // Create HTTP server with Express app
// Socket.IO cors Configuration: Added CORS settings specifically for the Socket.IO instance, targeting http://localhost:5173 (the default for Vite) to avoid connection issues.

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Client origin for CORS policy
    methods: ["GET", "POST"],
    credentials: true,
  },
});

console.log("Backend server has started..."); // This should log when the server starts

// Track active users
const activeUsers = new Map();

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  if (!userId) {
    console.warn("User connected without userId!");
    return;
  }

  // Join user-specific room
  socket.join(userId.toString());
  activeUsers.set(userId, socket.id);
  console.log(`User ${userId} connected and joined room ${userId}`);

  // Handle private message
  socket.on("private_message", (messageData) => {
    if (messageData.recipientId) {
      io.to(messageData.recipientId.toString()).emit(
        "private_message",
        messageData
      );
    }
  });
  // Handle server and channel messages
  socket.on("join_server", (serverId) => {
    socket.join(`server-${serverId}`);
    console.log(`User ${userId} joined server ${serverId}`);
  });

  socket.on("join_channel", (channelId) => {
    socket.join(`channel-${channelId}`);
    console.log(`User ${userId} joined channel ${channelId}`);
  });

  socket.on("leave_channel", (channelId) => {
    socket.leave(`channel-${channelId}`);
    console.log(`User ${userId} left channel ${channelId}`);
  });

  socket.on("server_message", (messageData) => {
    if (messageData.channelId) {
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

  // Handle read receipt
  socket.on("read_receipt", ({ messageId, senderId }) => {
    const senderSocketId = activeUsers.get(senderId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("message_read", { messageId, readBy: userId });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
    activeUsers.delete(userId);
  });

  // webrtc setup
  socket.on("join_room", (roomId) => {
    const rooms = io.sockets.adapter.rooms;
    const room = rooms.get(roomId);

    // if (room && room.size >= 2) {
    //   socket.emit("room_full");
    //   return;
    // }

    socket.join(roomId);
    console.log(`User joined room ${roomId}`);

    // Notify other users in the room
    socket.to(roomId).emit("user_joined", {
      socketId: socket.id,
      userId: socket.handshake.query.userId,
    });
  });

  // WebRTC Signaling for Peer Connection
  socket.on("offer", (data) => {
    socket.to(data.to).emit("offer", {
      offer: data.offer,
      from: socket.id,
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

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit("peer_left", { socketId: socket.id });
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173", // Client origin for CORS policy
  })
);
app.use(passport.initialize());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Set up routing and middleware
app.use("/", appRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/friends", friendRouter);
app.use("/server", serverRouter);
app.use(errorHandler);

// Handle graceful shutdowns for Prisma
process.on("SIGINT", async () => {
  console.log("Received SIGINT, disconnecting from database");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, disconnecting from database");
  await prisma.$disconnect();
  process.exit(0);
});

// Start the combined HTTP and WebSocket server
// Single server.listen Call: We call server.listen(PORT) instead of app.listen, ensuring that both the Express and WebSocket servers are served from the same port.
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

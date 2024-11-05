import express from "express";
import dotenv from "dotenv";
import prisma from "./db/prisma";
import cors from "cors";
import authRouter from "./Routes/AuthRouter";
import appRouter from "./Routes/AppRouter";
import chatRouter from "./Routes/ChatRouter";
import friendRouter from "./Routes/FriendRouter";
import { errorHandler } from "./Middleware/ErrorHandler";
import passport from "./Auth/passportConfig";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// socket.io setup
const server = http.createServer(app); // Create HTTP server with Express app
// Socket.IO cors Configuration: Added CORS settings specifically for the Socket.IO instance, targeting http://localhost:5173 (the default for Vite) to avoid connection issues.

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Client origin for CORS policy
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for private messages
  socket.on("private_message", async (messageData) => {
    // Emit to the recipient without saving to the database again
    io.to(messageData.recipientId.toString()).emit(
      "private_message",
      messageData
    );
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
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

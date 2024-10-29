import express from "express";
import dotenv from "dotenv";
import prisma from "./db/prisma";
import cors from "cors";
import authRouter from "./Routes/AuthRouter";
import { errorHandler } from "./Middleware/ErrorHandler"; // Import your error handler
import passport from "./Auth/passportConfig";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173", // or use '*' to allow all origins (not recommended for production)
  })
);
app.use(passport.initialize()); // Initialize passport middleware
app.use(errorHandler);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// The following code is for handling graceful shutdowns of the server
// We use these events to disconnect from the database before the process exits
// This is important because Prisma will otherwise throw an error when the process
// is killed, as it will not be able to properly disconnect from the database.

// Handle SIGINT (e.g. Ctrl+C in the terminal)
process.on("SIGINT", async () => {
  console.log("Received SIGINT, disconnecting from database");
  await prisma.$disconnect();
  process.exit(0);
});

// Handle SIGTERM (e.g. kill command in the terminal)
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, disconnecting from database");
  await prisma.$disconnect();
  process.exit(0);
});

//  FIX these two routes
app.get("/", (req, res) => {
  res.send("Hello from the API");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

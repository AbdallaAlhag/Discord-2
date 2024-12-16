"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// prisma.js
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = prisma; // Use ES Module syntax for exporting

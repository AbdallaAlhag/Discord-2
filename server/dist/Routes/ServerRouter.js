"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ServerController_1 = require("../Controllers/ServerController");
const router = express_1.default.Router();
router.post("/create", (req, res, next) => {
    (0, ServerController_1.handleCreateServer)(req, res, next);
});
router.post("/createChannel", (req, res, next) => {
    (0, ServerController_1.handleCreateChannel)(req, res, next);
});
router.get("/channels/:serverId", (req, res, next) => {
    (0, ServerController_1.handleServerChannelsInfo)(req, res, next);
});
router.post("/invite/:serverId", (req, res, next) => {
    (0, ServerController_1.handleServerInvite)(req, res, next);
});
router.post("/join/:userId/:serverId", (req, res, next) => {
    (0, ServerController_1.handleAddToServer)(req, res, next);
});
router.delete('/delete/:serverId', (req, res, next) => {
    (0, ServerController_1.handleDeleteServer)(req, res, next);
});
exports.default = router;

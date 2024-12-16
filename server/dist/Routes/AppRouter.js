"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppController_1 = require("../Controllers/AppController");
const router = express_1.default.Router();
router.get("/", (req, res, next) => {
    res.send("Hello World!");
});
router.get("/servers/:userId", (req, res, next) => {
    (0, AppController_1.getServersInfo)(req, res, next);
});
router.get("/friends/:userId", (req, res, next) => {
    (0, AppController_1.getFriendsInfo)(req, res, next);
});
router.get("/user/:id", (req, res, next) => {
    (0, AppController_1.getUserInfo)(req, res, next);
});
exports.default = router;

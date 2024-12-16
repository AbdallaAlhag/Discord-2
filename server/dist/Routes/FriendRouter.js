"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/Routes/friendRouter.ts
const express_1 = __importDefault(require("express"));
const FriendController_1 = require("../Controllers/FriendController");
const router = express_1.default.Router();
// Friend request routes
router.post("/request", FriendController_1.sendFriendRequest);
// router.post("/accept/:requestId", acceptFriendRequest);
router.post("/request/:requestId/accept", FriendController_1.acceptFriendRequest);
router.post("/request/:requestId/decline", FriendController_1.declineFriendRequest);
// pending and blocked list, just return nothing -> for now
router.get("/pending/:userId", FriendController_1.getPendingRequests);
router.get("/blocked/:userId", (req, res) => {
    res.status(200).json([]); // Return an empty array
});
exports.default = router;

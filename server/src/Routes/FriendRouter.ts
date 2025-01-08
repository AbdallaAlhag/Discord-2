// server/src/Routes/friendRouter.ts
import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
  declineFriendRequest,
  grabSuggestedUsers,
} from "../Controllers/FriendController";

const router = express.Router();

// Friend request routes
router.post("/request", sendFriendRequest);
// router.post("/accept/:requestId", acceptFriendRequest);

router.post("/request/:requestId/accept", acceptFriendRequest);
router.post("/request/:requestId/decline", declineFriendRequest);

// pending and blocked list, just return nothing -> for now
router.get("/pending/:userId", getPendingRequests);

router.get("/blocked/:userId", (req, res) => {
  res.status(200).json([]); // Return an empty array
});

router.get("/suggested/:userId", (req, res) => {
  grabSuggestedUsers(req, res);
});
export default router;

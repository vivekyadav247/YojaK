const router = require("express").Router();
const {
  sendInvite,
  getInvites,
  respondToInvite,
  deleteInvite,
  inviteRequests,
} = require("../controllers/invites.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.get("/invites/received/:userId", authMiddleware, getInvites);
router.post("/trips/:tripId", authMiddleware, sendInvite);
router.put("/invites/respond", authMiddleware, respondToInvite);
router.delete("/invites/:inviteId", authMiddleware, deleteInvite);
router.post("/requests/:userId", authMiddleware, inviteRequests);

module.exports = router;

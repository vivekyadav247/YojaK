const router = require("express").Router();
const profileComplete = require("../middlewares/profileComplete.middleware.js");
const {
  sendInvite,
  getInvites,
  respondToInvite,
  deleteInvite,
  inviteRequests,
} = require("../controllers/invites.controller.js");

router.get("/invites/received", getInvites);
router.post("/invites/send", profileComplete, sendInvite);
router.put("/invites/respond", profileComplete, respondToInvite);
router.delete("/invites/:inviteId", profileComplete, deleteInvite);
router.get("/invites/sent", inviteRequests);

module.exports = router;

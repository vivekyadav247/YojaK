const router = require("express").Router();
const {
  sendInvite,
  getInvites,
  respondToInvite,
  deleteInvite,
  inviteRequests,
} = require("../controllers/invites.controller.js");

router.get("/invites/received", getInvites);
router.post("/invites/send", sendInvite);
router.put("/invites/respond", respondToInvite);
router.delete("/invites/:inviteId", deleteInvite);
router.get("/invites/sent", inviteRequests);

module.exports = router;

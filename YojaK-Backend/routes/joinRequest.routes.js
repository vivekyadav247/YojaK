const router = require("express").Router();
const profileComplete = require("../middlewares/profileComplete.middleware.js");
const {
  sendJoinRequest,
  myJoinRequests,
  getTripJoinRequests,
  respondToJoinRequest,
} = require("../controllers/joinRequest.controller");

router.post("/send", profileComplete, sendJoinRequest);
router.get("/my", myJoinRequests);
router.get("/trip/:tripId", getTripJoinRequests);
router.put("/respond", profileComplete, respondToJoinRequest);

module.exports = router;

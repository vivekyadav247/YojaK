const router = require("express").Router();
const {
  sendJoinRequest,
  myJoinRequests,
  getTripJoinRequests,
  respondToJoinRequest,
} = require("../controllers/joinRequest.controller");

router.post("/send", sendJoinRequest);
router.get("/my", myJoinRequests);
router.get("/trip/:tripId", getTripJoinRequests);
router.put("/respond", respondToJoinRequest);

module.exports = router;

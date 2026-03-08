const router = require("express").Router();
const profileComplete = require("../middlewares/profileComplete.middleware.js");
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripMembers,
  addTripMember,
  removeTripMember,
  leaveTrip,
  createChecklistofTrip,
  getChecklistByTripId,
  updateChecklistofTrip,
  deleteChecklistofTrip,
} = require("../controllers/trip.controller.js");

router.post("/", profileComplete, createTrip);
router.get("/trips", getTrips);
router.get("/:id", getTripById);
router.put("/:id", profileComplete, updateTrip);
router.delete("/:id", profileComplete, deleteTrip);
router.get("/:id/members", getTripMembers);
router.post("/:id/members", profileComplete, addTripMember);
router.delete("/:id/members/:memberId", profileComplete, removeTripMember);
router.post("/:id/leave", profileComplete, leaveTrip);
router.post("/:id/checklist", profileComplete, createChecklistofTrip);
router.get("/:id/checklist", getChecklistByTripId);
router.put(
  "/:id/checklist/:checklistId",
  profileComplete,
  updateChecklistofTrip,
);
router.delete(
  "/:id/checklist/:checklistId",
  profileComplete,
  deleteChecklistofTrip,
);
module.exports = router;

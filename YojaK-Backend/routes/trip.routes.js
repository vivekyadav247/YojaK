const router = require("express").Router();
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
  getAllPublicTrips,
} = require("../controllers/trip.controller.js");

router.post("/", createTrip);
router.get("/", getAllPublicTrips);
router.get("/trips", getTrips);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.get("/:id/members", getTripMembers);
router.post("/:id/members", addTripMember);
router.delete("/:id/members/:memberId", removeTripMember);
router.post("/:id/leave", leaveTrip);
router.post("/:id/checklist", createChecklistofTrip);
router.get("/:id/checklist", getChecklistByTripId);
router.put("/:id/checklist/:checklistId", updateChecklistofTrip);
router.delete("/:id/checklist/:checklistId", deleteChecklistofTrip);
module.exports = router;

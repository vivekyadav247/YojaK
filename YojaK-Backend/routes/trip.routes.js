const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware.js");
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

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getAllPublicTrips);
router.get("/trips", authMiddleware, getTrips);
router.get("/:id", authMiddleware, getTripById);
router.put("/:id", authMiddleware, updateTrip);
router.delete("/:id", authMiddleware, deleteTrip);
router.get("/:id/members", authMiddleware, getTripMembers);
router.post("/:id/members", authMiddleware, addTripMember);
router.delete("/:id/members/:memberId", authMiddleware, removeTripMember);
router.post("/:id/leave", authMiddleware, leaveTrip);
router.post("/:id/checklist", authMiddleware, createChecklistofTrip);
router.get("/:id/checklist", authMiddleware, getChecklistByTripId);
router.put(
  "/:id/checklist/:checklistId",
  authMiddleware,
  updateChecklistofTrip,
);
router.delete(
  "/:id/checklist/:checklistId",
  authMiddleware,
  deleteChecklistofTrip,
);
module.exports = router;

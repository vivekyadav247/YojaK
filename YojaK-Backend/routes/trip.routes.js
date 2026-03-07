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
} = require("../controllers/trip.controller.js");

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.get("/:id", authMiddleware, getTripById);
router.put("/:id", authMiddleware, updateTrip);
router.delete("/:id", authMiddleware, deleteTrip);
router.get("/:id/members", authMiddleware, getTripMembers);
router.post("/:id/members", authMiddleware, addTripMember);
router.delete("/:id/members/:memberId", authMiddleware, removeTripMember);

module.exports = router;

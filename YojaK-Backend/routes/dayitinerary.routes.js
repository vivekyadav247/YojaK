const router = require("express").Router();
const {
  createDayItineraryofTrip,
  getDayItineraryByTripId,
  updateDayItineraryofTrip,
  deleteDayItineraryofTrip,
} = require("../controllers/dayItinerary.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.post("/trip/:tripId", authMiddleware, createDayItineraryofTrip);
router.get("/trip/:tripId", authMiddleware, getDayItineraryByTripId);
router.put("/trip/:tripId", authMiddleware, updateDayItineraryofTrip);
router.delete("/trip/:tripId", authMiddleware, deleteDayItineraryofTrip);

module.exports = router;

const router = require("express").Router();
const {
  createDayItineraryofTrip,
  getDayItineraryByTripId,
  updateDayItineraryofTrip,
  deleteDayItineraryofTrip,
  addActivityToDayItinerary,
  getActivitiesOfDayItinerary,
  removeActivityFromDayItinerary,
  updateActivityInDayItinerary,
  addCommentToDayItinerary,
  getAllCommentsOfDayItinerary,
  updateCommentInDayItinerary,
  removeCommentFromDayItinerary,
  addCommentToActivity,
  getCommentsOfActivity,
  removeCommentFromActivity,
} = require("../controllers/dayItinerary.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.post("/trip/:tripId", authMiddleware, createDayItineraryofTrip);
router.get("/trip/:tripId", authMiddleware, getDayItineraryByTripId);
router.put("/trip/:tripId", authMiddleware, updateDayItineraryofTrip);
router.delete("/trip/:tripId", authMiddleware, deleteDayItineraryofTrip);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  authMiddleware,
  addActivityToDayItinerary,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activities",
  authMiddleware,
  getActivitiesOfDayItinerary,
);
router.put(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  authMiddleware,
  updateActivityInDayItinerary,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  authMiddleware,
  removeActivityFromDayItinerary,
);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  authMiddleware,
  addCommentToDayItinerary,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comments",
  authMiddleware,
  getAllCommentsOfDayItinerary,
);
router.put(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  authMiddleware,
  updateCommentInDayItinerary,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  authMiddleware,
  removeCommentFromDayItinerary,
);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comment",
  authMiddleware,
  addCommentToActivity,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comments",
  authMiddleware,
  getCommentsOfActivity,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comment",
  authMiddleware,
  removeCommentFromActivity,
);
module.exports = router;

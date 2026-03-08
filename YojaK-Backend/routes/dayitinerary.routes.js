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
  reorderActivitiesInDayItinerary,
} = require("../controllers/dayItinerary.controller.js");

router.post("/trip/:tripId", createDayItineraryofTrip);
router.get("/trip/:tripId", getDayItineraryByTripId);
router.put("/trip/:tripId", updateDayItineraryofTrip);
router.delete("/trip/:tripId", deleteDayItineraryofTrip);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  addActivityToDayItinerary,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activities",
  getActivitiesOfDayItinerary,
);
router.put(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  updateActivityInDayItinerary,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  removeActivityFromDayItinerary,
);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  addCommentToDayItinerary,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comments",
  getAllCommentsOfDayItinerary,
);
router.put(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  updateCommentInDayItinerary,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  removeCommentFromDayItinerary,
);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comment",
  addCommentToActivity,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comments",
  getCommentsOfActivity,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comment",
  removeCommentFromActivity,
);
router.put(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activities/reorder",
  reorderActivitiesInDayItinerary,
);

module.exports = router;

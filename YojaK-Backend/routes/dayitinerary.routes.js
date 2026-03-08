const router = require("express").Router();
const profileComplete = require("../middlewares/profileComplete.middleware.js");
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

router.post("/trip/:tripId", profileComplete, createDayItineraryofTrip);
router.get("/trip/:tripId", getDayItineraryByTripId);
router.put("/trip/:tripId", profileComplete, updateDayItineraryofTrip);
router.delete("/trip/:tripId", profileComplete, deleteDayItineraryofTrip);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  profileComplete,
  addActivityToDayItinerary,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activities",
  getActivitiesOfDayItinerary,
);
router.put(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  profileComplete,
  updateActivityInDayItinerary,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity",
  profileComplete,
  removeActivityFromDayItinerary,
);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  profileComplete,
  addCommentToDayItinerary,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comments",
  getAllCommentsOfDayItinerary,
);
router.put(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  profileComplete,
  updateCommentInDayItinerary,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/comment",
  profileComplete,
  removeCommentFromDayItinerary,
);
router.post(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comment",
  profileComplete,
  addCommentToActivity,
);
router.get(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comments",
  getCommentsOfActivity,
);
router.delete(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activity/comment",
  profileComplete,
  removeCommentFromActivity,
);
router.put(
  "/trip/:tripId/dayItinerary/:dayItineraryId/activities/reorder",
  profileComplete,
  reorderActivitiesInDayItinerary,
);

module.exports = router;

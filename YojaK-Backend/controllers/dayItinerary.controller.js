const DayItinerary = require("../models/dayitinerary.model");

const Trip = require("../models/trip.model");

exports.createDayItineraryofTrip = async (req, res) => {
  try {
    const { dayNumber, activities, comments } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = new DayItinerary({
      trip: trip._id,
      dayNumber,
      activities,
      comments,
    });
    await dayItinerary.save();
    trip.dayItineraryIds.push(dayItinerary._id);
    await trip.save();
    res.status(201).json(dayItinerary);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating day itinerary", error: error.message });
  }
};

exports.getDayItineraryByTripId = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItineraries = await DayItinerary.find({ trip: trip._id });
    res.json(dayItineraries);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching day itineraries",
      error: error.message,
    });
  }
};

exports.updateDayItineraryofTrip = async (req, res) => {
  try {
    const { dayItineraryId, dayNumber, activities, comments } = req.body; // ADD dayItineraryId
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: dayItineraryId, // USE SPECIFIC ID
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    dayItinerary.dayNumber = dayNumber || dayItinerary.dayNumber;
    dayItinerary.activities = activities || dayItinerary.activities;
    dayItinerary.comments = comments || dayItinerary.comments;
    await dayItinerary.save();
    res.json(dayItinerary);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating day itinerary", error: error.message });
  }
};

exports.deleteDayItineraryofTrip = async (req, res) => {
  try {
    const { dayItineraryId } = req.body; // ADD dayItineraryId
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: dayItineraryId, // USE SPECIFIC ID
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    await DayItinerary.findByIdAndDelete(dayItinerary._id);
    trip.dayItineraryIds.pull(dayItinerary._id);
    await trip.save();
    res.json({ message: "Day itinerary deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting day itinerary", error: error.message });
  }
};

exports.addActivityToDayItinerary = async (req, res) => {
  try {
    const { activity } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    dayItinerary.activities.push(activity);
    await dayItinerary.save();
    res.json(dayItinerary);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding activity", error: error.message });
  }
};

exports.getActivitiesOfDayItinerary = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    res.json(dayItinerary.activities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message });
  }
};

exports.updateActivityInDayItinerary = async (req, res) => {
  try {
    const { activityId, time, description, isCompleted } = req.body;

    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }

    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }

    const activity = dayItinerary.activities.id(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (time !== undefined) activity.time = time;
    if (description !== undefined) activity.description = description;
    if (isCompleted !== undefined) activity.isCompleted = isCompleted;

    await dayItinerary.save();
    res.json(dayItinerary);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating activity", error: error.message });
  }
};

exports.removeActivityFromDayItinerary = async (req, res) => {
  try {
    const { activityId } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    dayItinerary.activities.pull({ _id: activityId });
    await dayItinerary.save();
    res.json(dayItinerary);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing activity", error: error.message });
  }
};

exports.addCommentToActivity = async (req, res) => {
  try {
    const { activityId, text } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    const activity = dayItinerary.activities.id(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    activity.comments.push({ user: req.user._id, text });
    await dayItinerary.save();
    res.status(201).json(activity);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error adding comment to activity",
        error: error.message,
      });
  }
};

exports.getCommentsOfActivity = async (req, res) => {
  try {
    const { activityId } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    const activity = dayItinerary.activities.id(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity.comments);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching activity comments",
        error: error.message,
      });
  }
};

exports.removeCommentFromActivity = async (req, res) => {
  try {
    const { activityId, commentId } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    const activity = dayItinerary.activities.id(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    activity.comments.pull({ _id: commentId });
    await dayItinerary.save();
    res.json(activity);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error removing comment from activity",
        error: error.message,
      });
  }
};

exports.addCommentToDayItinerary = async (req, res) => {
  try {
    const { text } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    dayItinerary.comments.push({ user: req.user._id, text });
    await dayItinerary.save();
    res.status(201).json(dayItinerary.comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

exports.getAllCommentsOfDayItinerary = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    res.json(dayItinerary.comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
};

exports.updateCommentInDayItinerary = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    const commentObj = dayItinerary.comments.id(commentId);
    if (!commentObj) {
      return res.status(404).json({ message: "Comment not found" });
    }
    commentObj.text = text;
    await dayItinerary.save();
    res.json(dayItinerary.comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating comment", error: error.message });
  }
};

exports.removeCommentFromDayItinerary = async (req, res) => {
  try {
    const { commentId } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const dayItinerary = await DayItinerary.findOne({
      _id: req.params.dayItineraryId,
      trip: req.params.tripId,
    });
    if (!dayItinerary) {
      return res.status(404).json({ message: "Day itinerary not found" });
    }
    dayItinerary.comments.pull({ _id: commentId });
    await dayItinerary.save();
    res.json(dayItinerary.comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing comment", error: error.message });
  }
};

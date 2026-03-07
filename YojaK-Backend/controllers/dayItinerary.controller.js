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

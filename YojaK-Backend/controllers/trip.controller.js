const Trip = require("../models/trip.model");
const User = require("../models/user.model");

exports.createTrip = async (req, res) => {
  try {
    const {
      title,
      destinations,
      places,
      startDate,
      endDate,
      type,
      limitofPeople,
    } = req.body;
    const trip = new Trip({
      title,
      destinations,
      places,
      startDate,
      endDate,
      type,
      limitofPeople,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
    });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating trip", error: error.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ "members.user": req.user._id })
      .populate("members.user", "name email")
      .populate("budgetTracker")
      .populate("dayItineraryIds");
    res.json(trips);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching trips", error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("members.user", "name email")
      .populate("budgetTracker")
      .populate("dayItineraryIds");
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!trip.members.some((m) => m.user._id.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(trip);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching trip", error: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (
      !trip.members.some(
        (m) =>
          (m.user.equals(req.user._id) && m.role === "owner") ||
          (m.user.equals(req.user._id) && m.role === "editor"),
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    const {
      title,
      destinations,
      places,
      startDate,
      endDate,
      type,
      limitofPeople,
      status,
    } = req.body;
    if (title) trip.title = title;
    if (destinations) trip.destinations = destinations;
    if (places) trip.places = places;
    if (startDate) trip.startDate = startDate;
    if (endDate) trip.endDate = endDate;
    if (type) trip.type = type;
    if (limitofPeople) trip.limitofPeople = limitofPeople;
    if (status) trip.status = status;

    await trip.save();
    res.json(trip);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating trip", error: error.message });
  }
};
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (
      !trip.members.some(
        (m) => m.user.equals(req.user._id) && m.role === "owner",
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    await Trip.findByIdAndDelete(req.params.id); // Use this instead of trip.remove()
    res.json({ message: "Trip deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting trip", error: error.message });
  }
};

exports.getTripMembers = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      "members.user",
      "name email",
    );
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!trip.members.some((m) => m.user._id.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(trip.members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching members", error: error.message });
  }
};

exports.addTripMember = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (
      !trip.members.some(
        (m) => m.user.equals(req.user._id) && m.role === "owner",
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (trip.members.some((m) => m.user.equals(user._id))) {
      return res.status(400).json({ message: "User already a member" });
    }
    trip.members.push({ user: user._id, role: "viewer" });
    await trip.save();
    res.json(trip.members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding member", error: error.message });
  }
};

exports.removeTripMember = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (
      !trip.members.some(
        (m) => m.user.equals(req.user._id) && m.role === "owner",
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    const memberIndex = trip.members.findIndex(
      (m) => m.user.equals(req.params.memberId), // FIX: use req.params.memberId not req.body.userId
    );
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found" });
    }
    trip.members.splice(memberIndex, 1);
    await trip.save();
    res.json(trip.members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing member", error: error.message });
  }
};

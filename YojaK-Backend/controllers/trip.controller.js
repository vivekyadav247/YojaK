const Trip = require("../models/trip.model");
const User = require("../models/user.model");
const { isMember, isOwnerOrEditor, isOwner } = require("../utils/tripAuth");

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

    // Validate dates are not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(startDate) < today) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the past" });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "End date cannot be before start date" });
    }

    const trip = new Trip({
      title,
      destinations,
      places,
      startDate,
      endDate,
      type,
      limitofPeople: type === "solo" ? 1 : limitofPeople,
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

exports.getAllPublicTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ type: "public" });
    res.json(trips);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching public trips", error: error.message });
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
    }
    // Allow viewing public trips; private/solo trips require membership
    if (trip.type !== "public" && !isMember(trip, req.user._id)) {
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
    } else if (!isOwnerOrEditor(trip, req.user._id)) {
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
    } else if (!isOwner(trip, req.user._id)) {
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
    }
    if (trip.type !== "public" && !isMember(trip, req.user._id)) {
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
    } else if (!isOwner(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (isMember(trip, user._id)) {
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
    } else if (!isOwner(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const memberIndex = trip.members.findIndex(
      (m) => (m.user._id || m.user).toString() === req.params.memberId,
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

exports.updateMemberRole = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!isOwner(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { role } = req.body;
    if (!["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const member = trip.members.find(
      (m) => (m.user._id || m.user).toString() === req.params.memberId,
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    if (member.role === "owner") {
      return res.status(400).json({ message: "Cannot change owner role" });
    }
    member.role = role;
    await trip.save();
    res.json(trip.members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating role", error: error.message });
  }
};

exports.leaveTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const memberIndex = trip.members.findIndex(
      (m) => (m.user._id || m.user).toString() === req.user._id.toString(),
    );
    trip.members.splice(memberIndex, 1);
    await trip.save();
    res.json(trip.members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error leaving trip", error: error.message });
  }
};

exports.createChecklistofTrip = async (req, res) => {
  try {
    const { item, value } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    trip.checklist.set(item, value ?? false);
    await trip.save();
    res.status(201).json(Object.fromEntries(trip.checklist));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating checklist", error: error.message });
  }
};

exports.getChecklistByTripId = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    const isTripMember = isMember(trip, req.user._id);
    if (trip.type !== "public" && !isTripMember) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(trip.checklist);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching checklist", error: error.message });
  }
};

exports.updateChecklistofTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { value } = req.body;
    trip.checklist.set(req.params.checklistId, value ?? false);
    await trip.save();
    res.json(Object.fromEntries(trip.checklist));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating checklist", error: error.message });
  }
};

exports.deleteChecklistofTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    trip.checklist.delete(req.params.checklistId);
    await trip.save();
    res.json(Object.fromEntries(trip.checklist));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting checklist", error: error.message });
  }
};

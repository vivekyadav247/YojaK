const JoinRequest = require("../models/joinRequest.model");
const Trip = require("../models/trip.model");
const { isMember, isOwnerOrEditor } = require("../utils/tripAuth");
const { syncTripStatus } = require("./trip.controller");

// POST /join-requests/send  — user requests to join a public trip
exports.sendJoinRequest = async (req, res) => {
  try {
    const { tripId } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    if (trip.type !== "public") {
      return res
        .status(400)
        .json({ error: "Can only request to join public trips" });
    }
    await syncTripStatus(trip);
    if (trip.status !== "planned") {
      return res
        .status(400)
        .json({ error: "Can only join trips that are in planned status" });
    }
    if (isMember(trip, req.user._id)) {
      return res
        .status(400)
        .json({ error: "You are already a member of this trip" });
    }
    if (trip.members.length >= trip.limitofPeople) {
      return res.status(400).json({ error: "Trip is full" });
    }

    const existing = await JoinRequest.findOne({
      sender: req.user._id,
      trip: tripId,
      status: "pending",
    });
    if (existing) {
      return res.status(400).json({ error: "Request already sent" });
    }

    const jr = await JoinRequest.create({ sender: req.user._id, trip: tripId });
    const populated = await jr.populate("sender trip");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: "Failed to send join request" });
  }
};

// GET /join-requests/my  — current user's sent join requests
exports.myJoinRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({ sender: req.user._id }).populate(
      "trip",
    );
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch join requests" });
  }
};

// GET /join-requests/trip/:tripId  — join requests for a trip (owner only)
exports.getTripJoinRequests = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    if (!isOwnerOrEditor(trip, req.user._id)) {
      return res
        .status(403)
        .json({ error: "Only trip owner or editor can view join requests" });
    }

    const requests = await JoinRequest.find({
      trip: trip._id,
      status: "pending",
    }).populate("sender trip");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch join requests" });
  }
};

// PUT /join-requests/respond  — owner accepts/rejects a request
exports.respondToJoinRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Status must be accepted or rejected" });
    }

    const jr = await JoinRequest.findById(requestId);
    if (!jr) return res.status(404).json({ error: "Join request not found" });

    const trip = await Trip.findById(jr.trip);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    if (!isOwnerOrEditor(trip, req.user._id)) {
      return res.status(403).json({ error: "Only trip owner or editor can respond" });
    }

    if (status === "accepted") {
      await syncTripStatus(trip);
      if (trip.status !== "planned") {
        return res
          .status(400)
          .json({
            error: "Can only accept members when trip is in planned status",
          });
      }
    }

    jr.status = status;
    await jr.save();

    if (status === "accepted") {
      if (
        !isMember(trip, jr.sender) &&
        trip.members.length < trip.limitofPeople
      ) {
        trip.members.push({ user: jr.sender, role: "viewer" });
        await trip.save();
      }
    }

    res.json(jr);
  } catch (error) {
    res.status(500).json({ error: "Failed to respond to join request" });
  }
};


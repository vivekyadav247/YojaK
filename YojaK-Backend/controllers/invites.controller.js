const Invite = require("../models/invites.model");
const User = require("../models/user.model");
const Trip = require("../models/trip.model");
const { isMember } = require("../utils/tripAuth");
const { sendInviteEmail } = require("../utils/sendEmail");

const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

exports.sendInvite = async (req, res) => {
  try {
    const { emailOrMobile, tripId } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    // Find receiver by email or mobile
    const receiver = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }],
    });

    if (receiver) {
      // Registered user flow
      if (receiver._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ error: "Cannot invite yourself" });
      }

      const existing = await Invite.findOne({
        sender: req.user._id,
        receiver: receiver._id,
        trip: tripId,
        status: "pending",
      });
      if (existing) {
        return res.status(400).json({ error: "Invite already sent" });
      }

      const invite = new Invite({
        sender: req.user._id,
        receiver: receiver._id,
        trip: tripId,
      });
      await invite.save();

      // If invited by email, also send email notification
      if (isEmail(emailOrMobile)) {
        sendInviteEmail({
          to: receiver.email,
          senderName: req.user.name || req.user.email,
          tripTitle: trip.title,
          tripDestination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
        }).catch((err) =>
          console.error("Failed to send invite email:", err.message),
        );
      }

      const populated = await invite.populate("sender receiver trip");
      return res.status(201).json(populated);
    }

    // Unregistered user flow — only works with email
    if (!isEmail(emailOrMobile)) {
      return res
        .status(404)
        .json({ error: "User not found with that mobile number" });
    }

    if (emailOrMobile.toLowerCase() === req.user.email?.toLowerCase()) {
      return res.status(400).json({ error: "Cannot invite yourself" });
    }

    const existing = await Invite.findOne({
      sender: req.user._id,
      receiverEmail: emailOrMobile.toLowerCase(),
      trip: tripId,
      status: "pending",
    });
    if (existing) {
      return res.status(400).json({ error: "Invite already sent" });
    }

    const invite = new Invite({
      sender: req.user._id,
      receiverEmail: emailOrMobile.toLowerCase(),
      trip: tripId,
    });
    await invite.save();

    // Send email in background — don't block response
    sendInviteEmail({
      to: emailOrMobile,
      senderName: req.user.name || req.user.email,
      tripTitle: trip.title,
      tripDestination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
    }).catch((err) =>
      console.error("Failed to send invite email:", err.message),
    );

    const populated = await invite.populate("sender trip");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: "Failed to send invite" });
  }
};

exports.getInvites = async (req, res) => {
  try {
    const invites = await Invite.find({
      $or: [
        { receiver: req.user._id },
        { receiverEmail: req.user.email, receiver: null },
      ],
    }).populate("sender receiver trip");
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invites" });
  }
};

exports.respondToInvite = async (req, res) => {
  try {
    const { inviteId, status } = req.body;
    const invite = await Invite.findById(inviteId);
    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    // Allow if receiver matches by ObjectId OR by email
    const isReceiver =
      (invite.receiver &&
        invite.receiver.toString() === req.user._id.toString()) ||
      (!invite.receiver && invite.receiverEmail === req.user.email);

    if (!isReceiver) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Link the invite to this user if it was email-only
    if (!invite.receiver) {
      invite.receiver = req.user._id;
    }

    invite.status = status;
    await invite.save();

    if (status === "accepted") {
      const trip = await Trip.findById(invite.trip);
      if (trip && !isMember(trip, req.user._id)) {
        trip.members.push({ user: req.user._id, role: "viewer" });
        await trip.save();
      }
    }

    res.status(200).json(invite);
  } catch (error) {
    res.status(500).json({ error: "Failed to respond to invite" });
  }
};

exports.deleteInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    await Invite.findByIdAndDelete(inviteId);
    res.status(200).json({ message: "Invite deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete invite" });
  }
};

exports.inviteRequests = async (req, res) => {
  try {
    const invites = await Invite.find({ sender: req.user._id }).populate(
      "receiver trip",
    );
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invite requests" });
  }
};

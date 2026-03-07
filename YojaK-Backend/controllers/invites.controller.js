const Invite = require("../models/invites.model");

exports.sendInvite = async (req, res) => {
  try {
    const { receiver, trip } = req.body;
    const invite = new Invite({ sender: req.user._id, receiver, trip });
    await invite.save();
    res.status(201).json(invite);
  } catch (error) {
    res.status(500).json({ error: "Failed to send invite" });
  }
};

exports.getInvites = async (req, res) => {
  try {
    const { userId } = req.params;
    const invites = await Invite.find({ receiver: userId }).populate(
      "sender trip",
    );
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
    invite.status = status;
    await invite.save();
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
    const { userId } = req.params;
    const invites = await Invite.find({ sender: userId }).populate(
      "receiver trip",
    );
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invite requests" });
  }
};

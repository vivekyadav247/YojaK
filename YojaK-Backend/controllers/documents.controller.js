const Document = require("../models/documents.model");
const Trip = require("../models/trip.model"); // ADD THIS

exports.uploadDocument = async (req, res) => {
  try {
    const { tripId, title, url } = req.body;

    // ADD AUTH CHECK
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }

    const document = new Document({
      tripId,
      files: [{ filename: title, url }],
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading document", error: error.message });
  }
};

exports.getDocumentsByTripId = async (req, res) => {
  try {
    // ADD AUTH CHECK
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }

    const documents = await Document.find({ tripId: req.params.tripId });
    res.json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching documents", error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // ADD AUTH CHECK
    const trip = await Trip.findById(document.tripId);
    if (!trip.members.some((m) => m.user.equals(req.user._id))) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting document", error: error.message });
  }
};

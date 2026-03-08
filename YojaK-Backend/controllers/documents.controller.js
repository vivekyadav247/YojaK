const Document = require("../models/documents.model");
const Trip = require("../models/trip.model");
const { isMember } = require("../utils/tripAuth");
const { cloudinary } = require("../middlewares/upload.middleware");

exports.uploadDocument = async (req, res) => {
  try {
    const { tripId } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((f) => ({
      filename: f.originalname,
      url: f.path,
      publicId: f.filename,
    }));

    let document = await Document.findOne({ tripId });
    if (document) {
      document.files.push(...files);
      await document.save();
    } else {
      document = await Document.create({ tripId, files });
    }

    res.status(201).json(document);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading document", error: error.message });
  }
};

exports.getDocumentsByTripId = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const isTripMember = isMember(trip, req.user._id);
    if (trip.type !== "public" && !isTripMember) {
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
    // Delete from Cloudinary
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // ADD AUTH CHECK
    const trip = await Trip.findById(document.tripId);
    if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Remove files from Cloudinary
    for (const file of document.files) {
      if (file.publicId) {
        await cloudinary.uploader
          .destroy(file.publicId, { resource_type: "raw" })
          .catch(() => {});
      }
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting document", error: error.message });
  }
};

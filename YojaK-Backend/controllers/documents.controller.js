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
      uploadedBy: req.user._id,
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
    if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const documents = await Document.find({ tripId: req.params.tripId });

    // Filter: show user's own files + files marked "everyone"
    const userId = req.user._id.toString();
    const filtered = documents
      .map((doc) => {
        const visibleFiles = doc.files
          .filter(
            (f) =>
              f.uploadedBy?.toString() === userId ||
              f.visibility === "everyone",
          )
          .map((f) => ({
            ...f.toObject(),
            isOwn: f.uploadedBy?.toString() === userId,
          }));
        return { ...doc.toObject(), files: visibleFiles };
      })
      .filter((doc) => doc.files.length > 0);

    res.json(filtered);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching documents", error: error.message });
  }
};

exports.toggleFileVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileId, visibility } = req.body;

    const document = await Document.findById(id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    const file = document.files.id(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (file.uploadedBy?.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Can only change visibility of your own files" });
    }

    if (visibility && !["private", "everyone"].includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility option" });
    }

    file.visibility =
      visibility || (file.visibility === "everyone" ? "private" : "everyone");
    await document.save();
    res.json({ fileId, visibility: file.visibility });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling visibility", error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileId } = req.body;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const trip = await Trip.findById(document.tripId);
    if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (fileId) {
      // Delete a specific file
      const file = document.files.id(fileId);
      if (!file) return res.status(404).json({ message: "File not found" });
      if (file.uploadedBy?.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Can only delete your own files" });
      }
      if (file.publicId) {
        await cloudinary.uploader
          .destroy(file.publicId, { resource_type: "raw" })
          .catch(() => {});
      }
      document.files.pull(fileId);
      await document.save();
      return res.json({ message: "File deleted" });
    }

    // Delete entire document — only if all files belong to this user
    const userFiles = document.files.filter(
      (f) => f.uploadedBy?.toString() === req.user._id.toString(),
    );
    for (const file of userFiles) {
      if (file.publicId) {
        await cloudinary.uploader
          .destroy(file.publicId, { resource_type: "raw" })
          .catch(() => {});
      }
    }

    if (userFiles.length === document.files.length) {
      await Document.findByIdAndDelete(id);
    } else {
      userFiles.forEach((f) => document.files.pull(f._id));
      await document.save();
    }

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting document", error: error.message });
  }
};

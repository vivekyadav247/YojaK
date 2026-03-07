const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByTripId,
  deleteDocument,
} = require("../controllers/documents.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
router.post("/", authMiddleware, uploadDocument);
router.get("/trip/:tripId", authMiddleware, getDocumentsByTripId);
router.delete("/:id", authMiddleware, deleteDocument);
module.exports = router;

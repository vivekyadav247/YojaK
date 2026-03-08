const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByTripId,
  deleteDocument,
} = require("../controllers/documents.controller.js");
const upload = require("../middlewares/upload.middleware.js");

router.post("/", upload.array("files", 5), uploadDocument);
router.get("/trip/:tripId", getDocumentsByTripId);
router.delete("/:id", deleteDocument);
module.exports = router;

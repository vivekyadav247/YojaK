const router = require("express").Router();
const {
  uploadDocument,
  getDocumentsByTripId,
  deleteDocument,
  toggleFileVisibility,
} = require("../controllers/documents.controller.js");
const upload = require("../middlewares/upload.middleware.js");

const profileComplete = require("../middlewares/profileComplete.middleware.js");

router.post("/", profileComplete, upload.array("files", 5), uploadDocument);
router.get("/trip/:tripId", getDocumentsByTripId);
router.put("/:id/visibility", profileComplete, toggleFileVisibility);
router.delete("/:id", profileComplete, deleteDocument);
module.exports = router;

const router = require("express").Router();
const {
  createBudgetTrackerofTrip,
  getBudgetTrackerByTripId,
  updateBudgetTrackerofTrip,
  deleteBudgetTrackerofTrip,
} = require("../controllers/budgetTracker.controller.js");

const profileComplete = require("../middlewares/profileComplete.middleware.js");

router.post("/trip/:tripId", profileComplete, createBudgetTrackerofTrip);
router.get("/trip/:tripId", getBudgetTrackerByTripId);
router.put("/trip/:tripId", profileComplete, updateBudgetTrackerofTrip);
router.delete("/trip/:tripId", profileComplete, deleteBudgetTrackerofTrip);

module.exports = router;

const router = require("express").Router();
const {
  createBudgetTrackerofTrip,
  getBudgetTrackerByTripId,
  updateBudgetTrackerofTrip,
  deleteBudgetTrackerofTrip,
} = require("../controllers/budgetTracker.controller.js");

router.post("/trip/:tripId", createBudgetTrackerofTrip);
router.get("/trip/:tripId", getBudgetTrackerByTripId);
router.put("/trip/:tripId", updateBudgetTrackerofTrip);
router.delete("/trip/:tripId", deleteBudgetTrackerofTrip);

module.exports = router;

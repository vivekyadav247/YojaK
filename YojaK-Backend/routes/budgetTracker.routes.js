const router = require("express").Router();
const {
  createBudgetTrackerofTrip,
  getBudgetTrackerByTripId,
  updateBudgetTrackerofTrip,
  deleteBudgetTrackerofTrip,
} = require("../controllers/budgetTracker.controller.js");

const authMiddleware = require("../middlewares/auth.middleware.js");

router.post("/trip/:tripId", authMiddleware, createBudgetTrackerofTrip);
router.get("/trip/:tripId", authMiddleware, getBudgetTrackerByTripId);
router.put("/trip/:tripId", authMiddleware, updateBudgetTrackerofTrip);
router.delete("/trip/:tripId", authMiddleware, deleteBudgetTrackerofTrip);

module.exports = router;

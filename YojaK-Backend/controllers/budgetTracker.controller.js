const BudgetTracker = require("../models/budgetTracker.model");
const Trip = require("../models/trip.model");
const { isMember } = require("../utils/tripAuth");

exports.createBudgetTrackerofTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    } else if (trip.budgetTracker) {
      return res.status(400).json({ message: "Budget tracker already exists" });
    } else {
      const budgetTracker = new BudgetTracker({
        trip: trip._id,
        totalBudget: 0,
        expenses: [],
      });
      await budgetTracker.save();
      trip.budgetTracker = budgetTracker._id;
      await trip.save();
      res.status(201).json(budgetTracker);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating budget tracker", error: error.message });
  }
};

exports.getBudgetTrackerByTripId = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate(
      "budgetTracker",
    );
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    const isTripMember = isMember(trip, req.user._id);
    if (trip.type !== "public" && !isTripMember) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(trip.budgetTracker);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching budget tracker", error: error.message });
  }
};

exports.updateBudgetTrackerofTrip = async (req, res) => {
  try {
    const { totalBudget, expenses, expense } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    } else if (!trip.budgetTracker) {
      return res.status(400).json({ message: "Budget tracker does not exist" });
    } else {
      const budgetTracker = await BudgetTracker.findById(trip.budgetTracker);
      if (totalBudget !== undefined) budgetTracker.totalBudget = totalBudget;
      if (expenses !== undefined) budgetTracker.expenses = expenses;
      // Handle single expense addition from frontend
      if (expense) budgetTracker.expenses.push(expense);
      await budgetTracker.save();
      res.json(budgetTracker);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating budget tracker", error: error.message });
  }
};

exports.deleteBudgetTrackerofTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    } else if (!isMember(trip, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    } else if (!trip.budgetTracker) {
      return res.status(400).json({ message: "Budget tracker does not exist" });
    } else {
      await BudgetTracker.findByIdAndDelete(trip.budgetTracker);
      trip.budgetTracker = undefined;
      await trip.save();
      res.json({ message: "Budget tracker deleted successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting budget tracker", error: error.message });
  }
};

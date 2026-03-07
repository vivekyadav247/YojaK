const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const budgetTrackerSchema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    totalBudget: {
      type: Number,
      required: true,
    },
    expenses: [
      {
        description: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);
module.exports = model("BudgetTracker", budgetTrackerSchema);

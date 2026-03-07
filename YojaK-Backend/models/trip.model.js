const { Schema, model } = require("mongoose");

const tripSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    destinations: {
      type: [String],
      required: true,
    },
    places: {
      type: [String],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["public", "private", "solo"],
      required: true,
    },
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed"],
      default: "planned",
      required: true,
    },
    budgetTracker: {
      type: Schema.Types.ObjectId,
      ref: "BudgetTracker",
    },
    checklist: {
      type: Map,
      of: Boolean,
      default: {},
    },
    limitofPeople: {
      type: Number,
      required: true,
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          default: "viewer",
        },
      },
    ],

    dayItineraryIds: {
      type: [Schema.Types.ObjectId],
      ref: "DayItinerary",
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = model("Trip", tripSchema);

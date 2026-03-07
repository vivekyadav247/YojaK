const { Schema, model } = require("mongoose");

const dayItinerarySchema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    activities: [
      {
        time: { type: String },
        description: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    comments: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = model("DayItinerary", dayItinerarySchema);

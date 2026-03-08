const { Schema, model } = require("mongoose");

const joinRequestSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

joinRequestSchema.index({ sender: 1, trip: 1 }, { unique: true });

module.exports = model("JoinRequest", joinRequestSchema);

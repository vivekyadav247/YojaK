const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const InviteSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  trip: { type: Schema.Types.ObjectId, ref: "Trip" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = model("Invite", InviteSchema);

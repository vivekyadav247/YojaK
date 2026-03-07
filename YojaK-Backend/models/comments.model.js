const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const commentSchema = new Schema(
  {
    dayItinerary: {
      type: Schema.Types.ObjectId,
      ref: "DayItinerary",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = model("Comment", commentSchema);

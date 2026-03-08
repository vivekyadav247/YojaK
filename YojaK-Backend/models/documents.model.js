const { Schema, model } = require("mongoose");

const documentSchema = new Schema(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    files: [
      {
        filename: { type: String, required: true },
        url: { type: String, required: true },
        publicId: { type: String },
        uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
        visibility: {
          type: String,
          enum: ["private", "everyone"],
          default: "private",
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const Document = model("Document", documentSchema);

module.exports = Document;

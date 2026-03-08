const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^\d{10}$/.test(v);
        },
      },
    },
    age: {
      type: Number,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    trips: [
      {
        type: Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],
  },
  { timestamps: true },
);

module.exports = model("User", userSchema);

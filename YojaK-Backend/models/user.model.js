const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
      },
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
      },
    },
    age: {
      type: Number,
      required: true,
      max: 120,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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

const User = require("../models/user.model");

exports.getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, mobileNumber, age, gender, location } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (location !== undefined) user.location = location;

    // Check if profile is now complete
    if (
      user.name &&
      user.mobileNumber &&
      user.age &&
      user.gender &&
      user.location
    ) {
      user.isProfileComplete = true;
    } else {
      user.isProfileComplete = false;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

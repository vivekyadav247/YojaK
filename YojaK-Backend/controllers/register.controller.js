const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../services/auth.services.js");

const register = async (req, res, next) => {
  const { name, email, password, mobileNumber, age, location } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const exitingMobile = await User.findOne({ mobileNumber });
    if (exitingMobile) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

    if (age < 0 || age > 120) {
      return res.status(400).json({ message: "Invalid age" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      age,
      location,
    });

    const token = generateToken(user);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
    next(err);
  }
};

module.exports = { register };

const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../services/auth.services.js");

const login = async (req, res, next) => {
  console.log("Login request received with body:", req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
    next(err);
  }
};

module.exports = { login };

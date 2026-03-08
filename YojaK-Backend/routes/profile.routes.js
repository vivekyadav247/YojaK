const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware.js");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller.js");

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

module.exports = router;

const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/user.controller.js");
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware.js");

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUserProfile);
module.exports = router;

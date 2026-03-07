const router = require("express").Router();
const { login } = require("../controllers/login.controller.js");

router.get("/", (req, res) => {
  res.send("Login route");
});

router.post("/", login);

module.exports = router;

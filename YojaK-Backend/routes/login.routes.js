const router = require("express").Router();
const { login } = require("../control/login.control.js");

router.get("/", (req, res) => {
  res.send("Login route");
});

router.post("/", login);

module.exports = router;

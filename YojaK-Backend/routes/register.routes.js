const router = require("express").Router();
const { register } = require("../controllers/register.controller.js");

router.get("/", (req, res) => {
  res.send("Register route");
});

router.post("/", register);

module.exports = router;

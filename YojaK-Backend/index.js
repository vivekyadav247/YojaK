const express = require("express");
const db = require("./config/db.config");
require("dotenv").config();
const registerRoutes = require("./routes/register.routes.js");
const loginRoutes = require("./routes/login.routes.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db();
const port = process.env.PORT || 3000;

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

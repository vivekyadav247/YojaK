const express = require("express");
const db = require("./config/db.config");
require("dotenv").config();
const registerRoutes = require("./routes/register.routes.js");
const loginRoutes = require("./routes/login.routes.js");
const tripRoutes = require("./routes/trip.routes.js");
const dayItineraryRoutes = require("./routes/dayitinerary.routes.js");
const documentRoutes = require("./routes/document.routes.js");
const budgetTrackerRoutes = require("./routes/budgetTracker.routes.js");
const invitesRoutes = require("./routes/invites.routes.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db();
const port = process.env.PORT || 3000;

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/day-itineraries", dayItineraryRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/budget-trackers", budgetTrackerRoutes);
app.use("/api", invitesRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

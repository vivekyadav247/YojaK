require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db.config");
const { clerkMiddleware } = require("@clerk/express");
const profileRoutes = require("./routes/profile.routes.js");
const tripRoutes = require("./routes/trip.routes.js");
const dayItineraryRoutes = require("./routes/dayitinerary.routes.js");
const documentRoutes = require("./routes/document.routes.js");
const budgetTrackerRoutes = require("./routes/budgetTracker.routes.js");
const invitesRoutes = require("./routes/invites.routes.js");
const joinRequestRoutes = require("./routes/joinRequest.routes.js");
const profileComplete = require("./middlewares/profileComplete.middleware.js");
const authMiddleware = require("./middlewares/auth.middleware.js");

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://yojak.vivekdev.live",
];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(clerkMiddleware());

db();
const { getAllPublicTrips } = require("./controllers/trip.controller.js");

const port = process.env.PORT || 3000;
app.use("/api/profile", profileRoutes);
app.get("/api/trips", getAllPublicTrips);
app.use("/api/trips", authMiddleware, tripRoutes);
app.use("/api/day-itineraries", authMiddleware, dayItineraryRoutes);
app.use("/api/documents", authMiddleware, documentRoutes);
app.use("/api/budget-trackers", authMiddleware, budgetTrackerRoutes);
app.use("/api", authMiddleware, invitesRoutes);
app.use("/api/join-requests", authMiddleware, joinRequestRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

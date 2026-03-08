const { getAuth, clerkClient } = require("@clerk/express");
const User = require("../models/user.model.js");

const authMiddleware = async (req, res, next) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find or create user in our DB
    let user = await User.findOne({ clerkId });
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email =
        clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress || "";
      user = await User.create({
        clerkId,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(
      "authMiddleware error:",
      err.message,
      err.stack?.split("\n")[1],
    );
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;

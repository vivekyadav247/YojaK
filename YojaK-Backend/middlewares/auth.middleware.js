const { getAuth, clerkClient } = require("@clerk/express");
const User = require("../models/user.model.js");
const Invite = require("../models/invites.model.js");

const authMiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

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

      // Link any pending email-based invites to this new user
      if (email) {
        await Invite.updateMany(
          {
            receiverEmail: email.toLowerCase(),
            receiver: null,
            status: "pending",
          },
          { $set: { receiver: user._id } },
        );
      }
    } else if (!user.name) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user.name =
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
      await user.save();
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

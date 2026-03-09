const { getAuth, clerkClient } = require("@clerk/express");
const User = require("../models/user.model.js");
const Invite = require("../models/invites.model.js");

const resolveClerkName = (clerkUser, email = "") => {
  const fromFirstLast =
    `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
  if (fromFirstLast) return fromFirstLast;

  const fromFullName = (clerkUser.fullName || "").trim();
  if (fromFullName) return fromFullName;

  const fromUsername = (clerkUser.username || "").trim();
  if (fromUsername) return fromUsername;

  const emailPrefix = email.split("@")[0]?.trim();
  return emailPrefix || "";
};

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
        name: resolveClerkName(clerkUser, email),
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
    } else if (!user.name?.trim()) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user.name = resolveClerkName(clerkUser, user.email || "");
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

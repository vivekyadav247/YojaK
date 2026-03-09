const { getAuth, clerkClient } = require("@clerk/express");
const User = require("../models/user.model.js");
const Invite = require("../models/invites.model.js");

const getPrimaryEmail = (clerkUser) =>
  (
    clerkUser.emailAddresses?.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress || ""
  )
    .trim()
    .toLowerCase();

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

    // Find user by current Clerk id.
    let user = await User.findOne({ clerkId });

    if (!user) {
      // New Clerk user in this backend context.
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = getPrimaryEmail(clerkUser);
      const resolvedName = resolveClerkName(clerkUser, email);

      // Recovery path: if user deleted/recreated in Clerk but DB row with same email exists,
      // re-link existing DB row instead of failing on unique email index.
      if (email) {
        const existingByEmail = await User.findOne({ email });
        if (existingByEmail) {
          existingByEmail.clerkId = clerkId;
          if (!existingByEmail.name?.trim()) {
            existingByEmail.name = resolvedName;
          }
          user = await existingByEmail.save();
        }
      }

      if (!user) {
        user = await User.create({
          clerkId,
          name: resolvedName,
          email,
        });
      }

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
      try {
        const clerkUser = await clerkClient.users.getUser(clerkId);
        user.name = resolveClerkName(clerkUser, user.email || "");
      } catch {
        user.name = user.email?.split("@")[0] || "USER";
      }
      await user.save();
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;

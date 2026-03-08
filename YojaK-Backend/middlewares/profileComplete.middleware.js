const profileCompleteMiddleware = (req, res, next) => {
  if (!req.user.isProfileComplete) {
    return res.status(403).json({
      message: "Please complete your profile first",
      isProfileComplete: false,
    });
  }
  next();
};

module.exports = profileCompleteMiddleware;

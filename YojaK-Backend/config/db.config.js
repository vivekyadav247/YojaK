const mongoose = require("mongoose");
const dns = require("dns");

if (process.env.NODE_ENV !== "production") {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const db = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/YojaK_DB",
    );
  } catch (err) {
    console.error("Could not connect to MongoDB", err);
    process.exit(1);
  }
};

module.exports = db;

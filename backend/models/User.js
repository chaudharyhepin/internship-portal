const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },

  password: String,
  role: {
    type: String,
    enum: ["student", "company"],
  },
});

module.exports = mongoose.model("User", userSchema);

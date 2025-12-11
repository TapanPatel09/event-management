const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
      trim: true,
    },
    organization: { type: String, trim: true },
    designation: { type: String, trim: true },
    bankDetails: { type: String },
    currency: { type: String, trim: true },
    preferredLocations: [{ type: String, trim: true }],
    techRequirements: [{ type: String, trim: true }],
    socialMedia: {
      website: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

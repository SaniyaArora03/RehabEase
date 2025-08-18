const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number },
  conditions: { type: [String] },   
  videos: { type: [String] },       
  physiotherapist: { type: String },
  physiotherapistContact: { type: Number },
  isProfileCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("Profile", ProfileSchema);

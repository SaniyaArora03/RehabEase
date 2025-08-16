const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // link with registered User
    required: true,
    unique: true
  },
  age: { type: Number, required: true },

  // conditions
  conditions: [{ type: String }],

  // video links
  videos: [{ type: String }],

  // physiotherapist info
  physiotherapist: {
    name: { type: String, required: true },
    contact: { type: String, required: true }
  }
});

module.exports = mongoose.model("Profile", profileSchema);

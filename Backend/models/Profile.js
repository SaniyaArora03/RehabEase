const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  age: { type: Number, required: true },
  condition1: { type: String ,required: true},
  condition2: { type: String },
  condition3: { type: String },
  video1: { type: String,required: true },
  video2: { type: String },
  video3: { type: String },
  physiotherapist: { type: String, required: true },
  physiotherapistContact: { type: Number, required: true }
});

module.exports = mongoose.model("Profile", profileSchema);

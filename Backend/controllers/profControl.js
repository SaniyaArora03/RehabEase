const Profile = require("../models/Profile");

// Create or Update Profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { age, condition1, condition2, condition3, video1, video2, video3, physiotherapist, physiotherapistContact } = req.body;

    const profileData = {
      userId: req.user.id,
      age,
      conditions: [condition1, condition2, condition3].filter(Boolean),
      videos: [video1, video2, video3].filter(Boolean), // 👈 fix here
      physiotherapist,
      physiotherapistContact,
      isProfileCompleted: true,
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      profileData,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    console.error("Profile save error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }).populate("userId", "name email");
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error("❌ Error in getProfile:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

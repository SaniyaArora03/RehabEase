const Profile = require("../models/Profile");

// Create/Update Profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { age, conditions, videos, physiotherapist } = req.body;

    // check if profile exists
    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      // update existing
      profile.age = age;
      profile.conditions = conditions;
      profile.videos = videos;
      profile.physiotherapist = physiotherapist;
      await profile.save();
      return res.json({ message: "Profile updated successfully", profile });
    }

    // create new
    profile = new Profile({
      userId: req.user.id,
      age,
      conditions,
      videos,
      physiotherapist
    });

    await profile.save();
    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

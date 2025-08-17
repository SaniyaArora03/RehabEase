const Profile = require("../models/Profile");

// Create or Update Profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      age,
      condition1,
      condition2,
      condition3,
      video1,
      video2,
      video3,
      physiotherapist,
      physiotherapistContact
    } = req.body;

    // Log incoming data
    console.log("Incoming profile data:", req.body);

    // Find existing profile
    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      // Update existing
      profile.age = Number(age) || profile.age;
      profile.condition1 = condition1 || profile.condition1;
      profile.condition2 = condition2 || profile.condition2;
      profile.condition3 = condition3 || profile.condition3;
      profile.video1 = video1 || profile.video1;
      profile.video2 = video2 || profile.video2;
      profile.video3 = video3 || profile.video3;
      profile.physiotherapist = physiotherapist || profile.physiotherapist;
      profile.physiotherapistContact =
        Number(physiotherapistContact) || profile.physiotherapistContact;

      await profile.save();
      return res.json({ message: "Profile updated successfully", profile });
    }

    // Create new profile
    const newProfile = new Profile({
      userId: req.user.id,
      age: Number(age),
      condition1,
      condition2,
      condition3,
      video1,
      video2,
      video3,
      physiotherapist,
      physiotherapistContact: Number(physiotherapistContact)
    });

    await newProfile.save();
    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (err) {
    console.error("❌ Error in createOrUpdateProfile:", err);
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

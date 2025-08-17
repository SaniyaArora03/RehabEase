// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.registerUser = async (req, res) => {
  console.log("📩 Incoming request body:", req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "Please add all fields" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      console.log("✅ User registered:", user.email);
      return res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
      });
    } else {
      console.log("❌ User creation failed");
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("🔥 Error in registerUser:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
// Login
exports.loginUser = async (req, res) => {
  try {
    console.log("Incoming login request:", req.body); // 👀 debug

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // ✅ check first-time login flag
    
 let redirectTo;
    if (user.isFirstLogin) {
      user.isFirstLogin = false; // flip to false
      await user.save();
      redirectTo = "/dashboard.html"; // first login
    } else {
      redirectTo = "/index.html"; // normal login
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      redirectTo, // 👈 send redirect path
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};
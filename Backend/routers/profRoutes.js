const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profControl");
const authMiddleware = require("../middleware/auth");

// Create or update profile
router.post("/profile", authMiddleware, profileController.createOrUpdateProfile);

// Get profile
router.get("/profile", authMiddleware, profileController.getProfile);

module.exports = router;

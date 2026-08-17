const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

// ── GET /user/profile ──────────────────────────────────────────
// Returns the logged-in user's profile details
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      supportEmail: user.supportEmail || "",
      avatar: user.avatar || null,
    });
  } catch (err) {
    console.log("GET /profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ── PUT /user/profile ──────────────────────────────────────────
// Updates name, phone, supportEmail, avatar (email is NOT editable)
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, supportEmail, avatar } = req.body;

    /*
    ========================================
    REJECT EMPTY NAME
    ========================================
    The User schema requires `name`, so an empty string would
    pass `!== undefined` but still fail Mongoose validation on
    save, leaving the user with a confusing 500 error. Catch it
    here with a clear 400 message instead — name is required to
    have actual content, not just be present in the payload.
    ========================================
    */

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined && name.trim() !== "") user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (supportEmail !== undefined) user.supportEmail = supportEmail;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      supportEmail: user.supportEmail || "",
      avatar: user.avatar || null,
    });
  } catch (err) {
    console.log("PUT /profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ── PUT /user/change-password ────────────────────────────────────
// Verifies currentPassword, then sets newPassword
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.log("PUT /change-password error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
});

module.exports = router;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    /*
    ========================================
    PROFILE FIELDS
    ========================================
    Added to support the Profile Settings page —
    without these, Mongoose silently drops any
    assignment to user.phone / user.supportEmail /
    user.avatar on save(), since fields not defined
    in the schema are never persisted.
    ========================================
    */

    phone: {
      type: String,
      default: "",
    },

    supportEmail: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleid: {
      type: String,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, // URL to Google profile picture
    },
    password: {
      type: String,
    },
    // Optional fields if you want more control
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

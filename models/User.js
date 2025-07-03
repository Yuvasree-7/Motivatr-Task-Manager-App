const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // required for login
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  weeklyProgress: { type: [Boolean], default: [false, false, false, false, false, false, false] }
});

module.exports = mongoose.model('User', userSchema);

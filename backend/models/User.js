const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  phone_no: { type: String, unique: true, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  // ✅ Fields for forgot password functionality
  resetToken: { type: String },
  resetTokenExpires: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
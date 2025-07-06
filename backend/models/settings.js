const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: String,
  address: String,
  workingHours: String,
  latitude: Number,
  longitude: Number,
  deliveryRadius: Number,
  logoUrl: String // 👈 Add logo URL
}, { collection: 'settings' });

module.exports = mongoose.model('Settings', settingsSchema);

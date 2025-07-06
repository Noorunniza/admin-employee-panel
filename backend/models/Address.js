const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  full_name: String,
  phone_no: String,
  house_building_name: String,
  street_area: String,
  locality: String,
  city: String,
  state: String,
  pincode: String,
  landmark: String,
  latitude: Number,
  longitude: Number,
  isDefault: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);

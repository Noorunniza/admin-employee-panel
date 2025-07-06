const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const deliveryAgentSchema = new mongoose.Schema({
  agentId: { type: String, unique: true }, // e.g., AGENT001
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  password: { type: String, required: true },
  vehicleType: { type: String, required: true },
  license: { type: String }, // file name or image URL

  agentNumber: { type: Number, unique: true }, // Auto-incremented
  availability: {
    type: String,
    enum: ['completed', 'pending'],
    default: 'completed'
  },
  activeDeliveries: { type: Number, default: 0 } 
});

// 🔢 Auto-increment plugin for agentNumber
deliveryAgentSchema.plugin(AutoIncrement, { inc_field: 'agentNumber' });

// 🎯 Generate agentId before saving
deliveryAgentSchema.pre('save', function (next) {
  if (!this.agentId && this.agentNumber) {
    this.agentId = 'AGENT' + this.agentNumber.toString().padStart(3, '0'); // AGENT001
  }
  next();
});

module.exports = mongoose.model('DeliveryAgent', deliveryAgentSchema);

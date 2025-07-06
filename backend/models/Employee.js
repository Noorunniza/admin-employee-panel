const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const employeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  idProof: { type: String },
  password: { type: String, required: true },
  empNumber: { type: Number, unique: true },
  
  activeOrders: { type: Number, default: 0 }, // ✅ new field
});

employeeSchema.plugin(AutoIncrement, { inc_field: 'empNumber' });

employeeSchema.pre('save', function (next) {
  if (!this.empId && this.empNumber) {
    this.empId = 'EMP' + this.empNumber.toString().padStart(4, '0');
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);

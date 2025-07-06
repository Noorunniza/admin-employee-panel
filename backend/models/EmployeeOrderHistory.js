const mongoose = require('mongoose');

const employeeOrderHistorySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, enum: ['Completed', 'Declined'], required: true },
  declineReason: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmployeeOrderHistory', employeeOrderHistorySchema);

// backend/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEmployeeProfile,
  getEmployeeOrders,
  updateItemStatus,
  completeOrder,
  declineOrder,
  getEmployeeOrderHistory // ✅ Add this line
} = require('../controllers/employeeActionsController'); // ✅ Make sure it's exported in controller

router.get('/profile/:empId', getEmployeeProfile);
router.get('/orders/:empId', getEmployeeOrders);
router.put('/update-item-status', updateItemStatus);
router.post('/complete-order', completeOrder);
router.post('/decline-order', declineOrder);
router.get('/history/:empId', getEmployeeOrderHistory); // ✅ Route works now

module.exports = router;

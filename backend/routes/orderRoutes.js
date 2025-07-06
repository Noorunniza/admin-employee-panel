const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 🧾 ORDER MANAGEMENT ROUTES
router.get('/', orderController.getAllOrders);
router.post('/update-item-status', orderController.updateItemStatus);

// 🧑‍💼 EMPLOYEE ROUTES
router.get('/available-employees', orderController.getAvailableEmployees);
router.put('/assign-employee', orderController.assignEmployee);
router.put('/mark-completed', orderController.markOrderCompletedByEmployee); // ✅ fixed function name
router.post('/decline-order', orderController.declineOrderByEmployee);       // ✅ fixed function name

// 🚴 AGENT ROUTES
router.get('/available-agents', orderController.getAvailableAgents);
router.put('/assign-agent', orderController.assignDeliveryAgent);
router.post('/agent-accept', orderController.agentAcceptOrder);              // ✅ new route
router.post('/agent-decline', orderController.agentDeclineOrder);            // ✅ new route
router.put('/mark-delivered', orderController.markOrderDeliveredByAgent);    // ✅ new route
 

// ✅ Route to fetch single order by ID
router.get('/:id', orderController.getOrderById);
module.exports = router;

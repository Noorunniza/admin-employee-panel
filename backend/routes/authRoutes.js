const express = require('express');
const router = express.Router();
const { adminLogin, employeeLogin } = require('../controllers/authController');

// Admin login route
router.post('/admin/login', adminLogin);

// Employee login route
router.post('/employee/login', employeeLogin);

module.exports = router;
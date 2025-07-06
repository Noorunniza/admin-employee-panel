
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Admin Login (no change here — still using hardcoded credentials)
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUsername = 'surya';
    const adminPassword = '123456';

    if (username === adminUsername && password === adminPassword) {
      const token = generateToken('admin', 'admin');
      res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: {
          username: adminUsername,
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ✅ UPDATED Employee Login with bcrypt password comparison
const employeeLogin = async (req, res) => {
  try {
    const { empId, password } = req.body;

    // Find employee by empId
    const employee = await Employee.findOne({ empId });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(employee._id, 'employee');

    res.json({
      success: true,
      message: 'Employee login successful',
      token,
      user: {
        empId: employee.empId,
        name: employee.name,
        role: 'employee'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  adminLogin,
  employeeLogin
};

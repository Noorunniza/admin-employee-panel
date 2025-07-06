const Employee = require('../models/Employee');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');


// Utility: Format empId like EMP001
const formatEmpId = (num) => {
  return 'EMP' + String(num).padStart(3, '0');
};

// ✅ Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// ✅ Add employee
const addEmployee = async (req, res) => {
  try {
    const { name, address, phoneNumber, password } = req.body;
    const idProof = req.file?.filename;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmp = new Employee({
      name,
      address,
      phoneNumber,
      password: hashedPassword,
      idProof,
    });

    const savedEmp = await newEmp.save();

    // Generate empId using empNumber
    savedEmp.empId = formatEmpId(savedEmp.empNumber);
    await savedEmp.save();

    res.status(201).json(savedEmp);
  } catch (error) {
    console.error('❌ Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

// ✅ Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    if (req.file) {
      updateData.idProof = req.file.filename;
    }

    const updatedEmp = await Employee.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedEmp);
  } catch (error) {
    console.error('❌ Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

// ✅ Delete employee
const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

// ✅ Export all functions
module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,

};

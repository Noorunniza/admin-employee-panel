const express = require('express');
const router = express.Router();
const multer = require('multer');
const employeeController = require('../controllers/employeeController');

// 📦 File upload setup for ID proof
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// 🔧 CRUD Routes
router.get('/', employeeController.getEmployees);
router.post('/', upload.single('idProof'), employeeController.addEmployee);
router.put('/:id', upload.single('idProof'), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);


module.exports = router;

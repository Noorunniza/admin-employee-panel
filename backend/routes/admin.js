const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); 
const Order = require('../models/Order'); // ✅ ADD THIS
const {
  getStore,
  updateStore
} = require('../controllers/adminController');

router.get('/get-store', getStore);
router.put('/update-store/:id', updateStore);

// 📬 Get all complaints (with user details)
router.get('/complaints', async (req, res) => {
  try {
    const complaints = await Feedback.find().populate('user_id');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err });
  }
});

// 📬 Get a single complaint by ID
router.get('/complaints/:id', async (req, res) => {
  try {
    const complaint = await Feedback.findById(req.params.id).populate('user_id');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaint details', error: err });
  }
});

// ✅ Update complaint status
router.put('/complaints/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err });
  }
});

// ✅ Get single order by ID (used in OrderDetails.jsx)
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name phone_no')
      .populate('addressId')
      .populate('assignedEmployee', 'empId name')
      .populate('assignedAgent', 'agentId name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err });
  }
});

module.exports = router;

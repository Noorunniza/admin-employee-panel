// controllers/adminController.js
const Settings = require('../models/settings');

// GET store
exports.getStore = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (settings) {
      res.json(settings);
    } else {
      res.status(404).json({ error: 'No settings found' });
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE store
exports.updateStore = async (req, res) => {
  try {
    const updated = await Settings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Settings not found' });
    }
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// backend/routes/settingsRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Settings = require('../models/settings');

const router = express.Router();

// multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, 'logo-' + Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ✅ Upload logo route
router.post('/upload-logo/:id', upload.single('logo'), async (req, res) => {
  try {
    const logoUrl = `/uploads/${req.file.filename}`;
    const updated = await Settings.findByIdAndUpdate(
      req.params.id,
      { logoUrl },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('❌ Upload failed:', error);
    res.status(500).json({ error: 'Logo upload failed' });
  }
});

module.exports = router;

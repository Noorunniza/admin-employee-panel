const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/deliveryAgentController');

// Multer storage setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', controller.getAll);
router.post('/', upload.single('license'), controller.add);
router.put('/:id', upload.single('license'), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

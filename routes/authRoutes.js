const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/dashboard', protect, (req, res) => {
  res.json({ msg: `Welcome ${req.user.id}` });
});

// Admin only route
router.get('/admin', protect, adminOnly, (req, res) => {
  res.json({ msg: 'Hello Admin 👑' });
});

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken } = require('../utils/token');
const { protect } = require('../middleware/auth');

const router = express.Router();
const check = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  next();
};

// POST /api/auth/register
router.post('/register',
  body('name').trim().notEmpty().withMessage('Full name required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  check,
  async (req, res, next) => {
    try {
      const { name, email, phone, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });
      const user = await User.create({ name, email, phone, password });
      const token = signToken(user);
      res.status(201).json({ success: true, message: 'Account created', token, user: user.toSafeJSON() });
    } catch (e) { next(e); }
  }
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
  check,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      const ok = await user.comparePassword(password);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      const token = signToken(user);
      res.json({ success: true, message: 'Login successful', token, user: user.toSafeJSON() });
    } catch (e) { next(e); }
  }
);

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
});

module.exports = router;

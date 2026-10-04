const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me + PUT profile
router.get('/me', protect, (req, res) => res.json({ success: true, user: req.user.toSafeJSON() }));

router.put('/me', protect, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (name) req.user.name = name;
    if (phone) req.user.phone = phone;
    await req.user.save();
    res.json({ success: true, message: 'Profile updated', user: req.user.toSafeJSON() });
  } catch (e) { next(e); }
});

router.put('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    const user = await User.findById(req.user._id).select('+password');
    const ok = await user.comparePassword(currentPassword || '');
    if (!ok) return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (e) { next(e); }
});

module.exports = router;

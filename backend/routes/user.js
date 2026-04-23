const express = require('express');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// All routes below are protected
router.use(protect);

// ─── GET /api/user/profile ─────────────────────────────────────────────────────
router.get('/profile', (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
});

// ─── PUT /api/user/profile ─────────────────────────────────────────────────────
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name } = req.body;
    const updates = {};
    if (name) updates.name = name;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated.', user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/user/change-password ────────────────────────────────────────────
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and a number')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

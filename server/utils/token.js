const jwt = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'rebookify_super_secret_change_me', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

module.exports = { signToken };

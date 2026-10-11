const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = require('../config/env');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '7d',
  });
};

const sendTokenResponse = (admin, statusCode, res) => {
  const token = generateToken(admin._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('admin_token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
};

// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been disabled. Contact system administrator.',
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    sendTokenResponse(admin, 200, res);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  res.cookie('admin_token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase().trim();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password.',
        });
      }
      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password.',
        });
      }
      admin.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

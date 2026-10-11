const express = require('express');
const router = express.Router();
const { login, logout, getMe, updateProfile } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);
router.put('/profile', protectAdmin, updateProfile);

module.exports = router;

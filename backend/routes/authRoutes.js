const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', AuthController.register);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/resend-otp', AuthController.resendOTP);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.get('/profile', protect, AuthController.profile);

module.exports = router;

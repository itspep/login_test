const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/validation');

// @route   POST /auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signupValidation, signup);

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', logout);

module.exports = router;

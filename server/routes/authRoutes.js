const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  registerUser,
  loginUser,
  getLoggedInUser, // <-- Import the new function
} = require('../controllers/authController');

// Import our new middleware
const authMiddleware = require('../middlewares/authMiddleware'); // <-- Import the middleware

// ... your /register and /login routes are here ...
router.post('/register', registerUser);
router.post('/login', loginUser);

// @route   GET api/auth/me
// @desc    Get logged-in user's data
// @access  Private (because we add the middleware)
router.get('/me', authMiddleware, getLoggedInUser); // <-- ADD THIS NEW ROUTE

module.exports = router;
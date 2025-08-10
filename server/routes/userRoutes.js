const express = require('express');
const router = express.Router();
const {
  updateUserSkills, // Renamed for clarity
  findTeachersBySkill, // More descriptive name
  getUserAnalytics,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route   PUT /api/users/skills
// @desc    Update the logged-in user's skills (teach and learn)
// @access  Private
router.put('/skills', authMiddleware, updateUserSkills);

// @route   GET /api/users/find
// @desc    Find users who can teach a specific skill
// @access  Private
// Example: GET /api/users/find?skillId=60d5f2f5c7b8f9a1b8e4b3a0
router.get('/find', authMiddleware, findTeachersBySkill);

// @route   GET /api/users/analytics
// @desc    Get analytics data for the logged-in user
// @access  Private
router.get('/analytics', authMiddleware, getUserAnalytics);

module.exports = router;
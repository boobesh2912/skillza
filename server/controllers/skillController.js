const Skill = require('../models/Skill');

// @desc    Get all skills from the database
// @route   GET /api/skills
// @access  Public
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
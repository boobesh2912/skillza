const User = require('../models/User');
const Request = require('../models/Request');
const mongoose = require('mongoose');

// @desc    Update the skills for the logged-in user
// @route   PUT /api/users/skills
// @access  Private
exports.updateUserSkills = async (req, res) => {
  // The frontend will send two arrays of skill IDs
  const { skillsToTeach, skillsToLearn } = req.body; 

  try {
    // Find the user and update their skill lists directly
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          skillsToTeach: skillsToTeach,
          skillsToLearn: skillsToLearn,
        },
      },
      { new: true } // This option returns the updated document
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Populate the skill details before sending back the response
    const updatedUser = await User.findById(req.user.id)
      .populate('skillsToTeach', 'name category')
      .populate('skillsToLearn', 'name category')
      .select('-password');
      
    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Find users who can teach a specific skill
// @route   GET /api/users/find?skillId=<skillId>
// @access  Private
exports.findTeachersBySkill = async (req, res) => {
  const { skillId } = req.query; // Get the skillId from the URL query parameter

  if (!skillId) {
    return res.status(400).json({ msg: 'Skill ID is required' });
  }

  try {
    // Find all users who have the specified skillId in their 'skillsToTeach' array
    // Also, exclude the logged-in user from the results
    const teachers = await User.find({
      skillsToTeach: skillId,
      _id: { $ne: req.user.id }, 
    })
    .populate('skillsToTeach', 'name category') // Show what skills they teach
    .select('-password -skillsToLearn -email'); // Hide sensitive/unnecessary info for discovery

    res.json(teachers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get analytics for the logged-in user
// @route   GET /api/users/analytics
// @access  Private
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Calculate stats using the powerful MongoDB Aggregation Framework
    const earnedData = await Request.aggregate([
      { $match: { teacher: userId, status: 'accepted' } },
      { $group: { _id: null, total: { $sum: '$cost' }, count: { $sum: 1 } } }
    ]);

    const spentData = await Request.aggregate([
      { $match: { requester: userId, status: 'accepted' } },
      { $group: { _id: null, total: { $sum: '$cost' }, count: { $sum: 1 } } }
    ]);
    
    const analytics = {
      coinsEarned: earnedData[0]?.total || 0,
      peopleTaught: earnedData[0]?.count || 0,
      coinsSpent: spentData[0]?.total || 0,
      skillsLearned: spentData[0]?.count || 0,
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics Error:', error.message);
    res.status(500).send('Server Error');
  }
};
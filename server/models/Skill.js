const mongoose = require('mongoose');

// This is the blueprint for a single skill
const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Every skill must have a name
    trim: true,     // Removes any extra spaces from the start and end
  },
  category: {
    type: String,
    required: true, // e.g., 'Tech', 'Creative', 'Lifestyle'
    enum: ['Tech', 'Creative', 'Communication', 'Lifestyle'], // The category must be one of these values
  },
});

// Create the model from the blueprint
const Skill = mongoose.model('Skill', skillSchema);

// Export the model so we can use it in other files
module.exports = Skill;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    skillMoney: { type: Number, default: 50 },
    skillsToTeach: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    skillsToLearn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    // --- NEW FIELD FOR AVAILABILITY ---
    availability: {
      type: [String], // An array of strings like "Weekdays", "Weekends", "Evenings"
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
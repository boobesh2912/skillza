const mongoose = require('mongoose');
const dotenv =require('dotenv');
const Skill = require('./models/Skill');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const skillsData = [
  // Technology
  { name: 'JavaScript', category: 'Tech' }, { name: 'Python', category: 'Tech' },
  { name: 'React', category: 'Tech' }, { name: 'Node.js', category: 'Tech' },
  { name: 'AI/ML', category: 'Tech' }, { name: 'Data Science', category: 'Tech' },
  { name: 'Cloud Computing', category: 'Tech' }, { name: 'Cybersecurity', category: 'Tech' },
  // Creative
  { name: 'UI/UX Design', category: 'Creative' }, { name: 'Graphic Design', category: 'Creative' },
  { name: 'Video Editing', category: 'Creative' }, { name: 'Photography', category: 'Creative' },
  { name: 'Animation', category: 'Creative' }, { name: 'Web Design', category: 'Creative' },
  { name: 'Branding', category: 'Creative' }, { name: 'Photoshop', category: 'Creative' },
  // Communication
  { name: 'Public Speaking', category: 'Communication' }, { name: 'Technical Writing', category: 'Communication' },
  { name: 'Language Learning', category: 'Communication' }, { name: 'Copywriting', category: 'Communication' },
  { name: 'Storytelling', category: 'Communication' }, { name: 'Negotiation', category: 'Communication' },
  { name: 'Coaching', category: 'Communication' }, { name: 'Mentoring', category: 'Communication' },
  // Lifestyle
  { name: 'Cooking', category: 'Lifestyle' }, { name: 'Fitness Training', category: 'Lifestyle' },
  { name: 'Gardening', category: 'Lifestyle' }, { name: 'Yoga', category: 'Lifestyle' },
  { name: 'Meditation', category: 'Lifestyle' }, { name: 'Personal Finance', category: 'Lifestyle' },
  { name: 'DIY Crafts', category: 'Lifestyle' }, { name: 'Music Production', category: 'Lifestyle' },
];

const importData = async () => {
  try {
    await Skill.deleteMany(); // Clear existing skills
    await Skill.insertMany(skillsData);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Skill.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Check for command line argument to decide what to do
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
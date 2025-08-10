const express = require('express');
const router = express.Router();
const { getAllSkills } = require('../controllers/skillController');

// This defines the GET route for "/" (which becomes /api/skills)
// and connects it to the getAllSkills function.
router.get('/', getAllSkills);

// This line is crucial. It exports the configured router object.
module.exports = router;
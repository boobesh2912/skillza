const express = require('express');
const router = express.Router();
const {
  createRequest,
  getReceivedRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new request
router.post('/', authMiddleware, createRequest);

// Get all requests received by the logged-in user
router.get('/received', authMiddleware, getReceivedRequests);

// Update a request (accept/decline)
router.put('/:id', authMiddleware, updateRequestStatus);

module.exports = router;
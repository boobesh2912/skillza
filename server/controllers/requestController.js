const Request = require('../models/Request');
const User = require('../models/User');

// @desc    Create a new skill request and handle transaction
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
  const { teacherId, skillId, message, cost } = req.body;
  const requesterId = req.user.id;

  try {
    const requester = await User.findById(requesterId);
    const teacher = await User.findById(teacherId);

    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    // --- TRANSACTION LOGIC ---
    // 1. Check if the requester has enough SkillMoney
    if (requester.skillMoney < cost) {
      return res.status(400).json({ msg: 'Insufficient SkillMoney balance.' });
    }

    // 2. Deduct the cost from the requester's balance
    requester.skillMoney -= cost;
    await requester.save();

    // 3. Create the new request with the cost included
    const newRequest = new Request({
      requester: requesterId,
      teacher: teacherId,
      skill: skillId,
      message,
      cost, // Save the cost of the session
    });
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all requests received by the logged-in user
// @route   GET /api/requests/received
// @access  Private
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ teacher: req.user.id })
      .populate('requester', 'name email')
      .populate('skill', 'name');
    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a request's status and award coins on acceptance
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.teacher.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // --- TRANSACTION LOGIC ---
    if (status === 'accepted') {
      // 1. Award the stored cost to the teacher
      await User.findByIdAndUpdate(req.user.id, { $inc: { skillMoney: request.cost } });
      request.status = 'accepted';
    } else if (status === 'declined') {
      // 2. If declined, refund the coins back to the requester
      await User.findByIdAndUpdate(request.requester, { $inc: { skillMoney: request.cost } });
      request.status = 'declined';
    } else {
      return res.status(400).json({ msg: 'Invalid status update' });
    }

    await request.save();
    res.json(request);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
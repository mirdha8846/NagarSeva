const Issue = require('../models/Issue');

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private (Citizen)
const createIssue = async (req, res) => {
  const { title, description, category, longitude, latitude } = req.body;

  const images = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];

  const issue = new Issue({
    title,
    description,
    category,
    images,
    location: {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    },
    userId: req.user._id
  });

  const createdIssue = await issue.save();
  res.status(201).json(createdIssue);
};

// @desc    Get all issues (can filter by location)
// @route   GET /api/issues
// @access  Public
const getIssues = async (req, res) => {
  const { lng, lat, dist, category, search, limit, userId } = req.query;

  let query = {};
  
  if (userId) {
    query.userId = userId;
  }

  // Define spatial query separately because countDocuments doesn't support $near
  let spatialQuery = {};
  if (lng && lat) {
    spatialQuery.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseFloat(dist) || 50000 // default 50km
      }
    };
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Combine for search but run count on non-spatial query to avoid error
  const issuesQuery = Issue.find({ ...query, ...spatialQuery }).populate('userId', 'name').sort({ createdAt: -1 });
  
  if (limit) {
    issuesQuery.limit(parseInt(limit));
  }

  const issues = await issuesQuery;
  const total = await Issue.countDocuments(query); // Count approximately without geo-spatial to avoid crash

  let userVotesMap = {};
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const Vote = require('../models/Vote');
      const userVotes = await Vote.find({ userId: decoded.id, issueId: { $in: issues.map(i => i._id) } });
      userVotes.forEach(v => {
        userVotesMap[v.issueId.toString()] = v.type;
      });
    } catch (e) {
      console.error('Error verifying token for issues:', e);
    }
  }

  const issuesWithVotes = issues.map(issue => ({
    ...issue.toObject(),
    userVote: userVotesMap[issue._id.toString()] || null
  }));

  res.json({
    issues: issuesWithVotes,
    total,
    count: issues.length
  });
};

// @desc    Get issue by ID
// @route   GET /api/issues/:id
// @access  Public
const getIssueById = async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate('userId', 'name');

  if (issue) {
    res.json(issue);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
};

// @desc    Update issue status
// @route   PATCH /api/issues/:id/status
// @access  Private (Admin/Authority)
const updateIssueStatus = async (req, res) => {
  const { status } = req.body;
  const issue = await Issue.findById(req.params.id);

  if (issue) {
    issue.status = status;
    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
};

module.exports = { createIssue, getIssues, getIssueById, updateIssueStatus };

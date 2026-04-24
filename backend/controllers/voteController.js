const Vote = require('../models/Vote');
const Issue = require('../models/Issue');

// @desc    Add a vote to an issue
// @route   POST /api/votes
// @access  Private
const addVote = async (req, res) => {
  const { issueId, type } = req.body;

  const issue = await Issue.findById(issueId);

  if (!issue) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  // Check if already voted
  const existingVote = await Vote.findOne({ userId: req.user._id, issueId });

  if (existingVote) {
    if (existingVote.type === type) {
      // Toggle off
      await Vote.deleteOne({ _id: existingVote._id });
      issue.votesCount += (type === 'upvote' ? -1 : 1);
      await issue.save();
      return res.json({ message: 'Vote removed', votesCount: issue.votesCount, userVote: null });
    } else {
      // Change vote type
      existingVote.type = type;
      await existingVote.save();
      
      // Update issue votesCount
      issue.votesCount += (type === 'upvote' ? 2 : -2);
      await issue.save();
      
      return res.json({ message: 'Vote updated', votesCount: issue.votesCount, userVote: type });
    }
  }

  const vote = new Vote({
    userId: req.user._id,
    issueId,
    type
  });

  await vote.save();

  // Update issue votesCount
  issue.votesCount += (type === 'upvote' ? 1 : -1);
  await issue.save();

  res.status(201).json({ message: 'Vote added', votesCount: issue.votesCount, userVote: type });
};

// @desc    Get all issues voted by the current user
// @route   GET /api/votes/my-votes
// @access  Private
const getUserVotedIssues = async (req, res) => {
  try {
    const votes = await Vote.find({ userId: req.user._id }).populate({
      path: 'issueId',
      populate: { path: 'userId', select: 'name' }
    });

    const votedIssues = votes
      .filter(v => v.issueId) // filter out deleted issues
      .map(v => ({
        ...v.issueId.toObject(),
        voteType: v.type
      }));

    res.json(votedIssues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addVote, getUserVotedIssues };

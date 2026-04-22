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
      return res.status(400).json({ message: 'Already voted' });
    } else {
      // Change vote type
      existingVote.type = type;
      await existingVote.save();
      
      // Update issue votesCount
      issue.votesCount += (type === 'upvote' ? 2 : -2);
      await issue.save();
      
      return res.json({ message: 'Vote updated' });
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

  res.status(201).json({ message: 'Vote added' });
};

module.exports = { addVote };

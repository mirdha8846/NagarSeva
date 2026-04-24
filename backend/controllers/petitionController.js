const Petition = require('../models/Petition');

// @desc    Get all active petitions
// @route   GET /api/petitions
// @access  Public
const getPetitions = async (req, res) => {
  const petitions = await Petition.find().populate('issueId', 'title description').sort({ count: -1 });
  res.json(petitions);
};

// @desc    Sign a petition
// @route   POST /api/petitions/:id/sign
// @access  Private
const signPetition = async (req, res) => {
  const petition = await Petition.findById(req.params.id);

  if (!petition) {
    return res.status(404).json({ message: 'Petition not found' });
  }

  // Check if user has already signed
  if (petition.supporters.includes(req.user._id)) {
    return res.status(400).json({ message: 'You have already signed this petition' });
  }

  petition.supporters.push(req.user._id);
  petition.count = petition.supporters.length;

  const updatedPetition = await petition.save();
  res.json(updatedPetition);
};

// @desc    Create a new petition
// @route   POST /api/petitions
// @access  Private
const createPetition = async (req, res) => {
  const { title, issueId } = req.body;

  if (!title || !issueId) {
    return res.status(400).json({ message: 'Title and issue ID are required' });
  }

  // Check if a petition already exists for this issue
  const existingPetition = await Petition.findOne({ issueId });
  if (existingPetition) {
    return res.status(400).json({ message: 'A petition already exists for this issue' });
  }

  const petition = await Petition.create({
    title,
    issueId,
    supporters: [req.user._id],
    count: 1,
    status: 'active'
  });

  res.status(201).json(petition);
};

module.exports = { getPetitions, signPetition, createPetition };

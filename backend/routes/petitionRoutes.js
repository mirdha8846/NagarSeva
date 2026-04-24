const express = require('express');
const router = express.Router();
const { getPetitions, signPetition, createPetition } = require('../controllers/petitionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPetitions)
  .post(protect, createPetition);

router.route('/:id/sign')
  .post(protect, signPetition);

module.exports = router;

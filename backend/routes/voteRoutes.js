const express = require('express');
const router = express.Router();
const { addVote } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Votes
 *   description: Issue upvoting and downvoting
 */

/**
 * @swagger
 * /api/votes:
 *   post:
 *     summary: Add or change a vote on an issue
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - issueId
 *               - type
 *             properties:
 *               issueId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *     responses:
 *       201:
 *         description: Vote added
 *       200:
 *         description: Vote updated
 *       404:
 *         description: Issue not found
 */
router.post('/', protect, addVote);

module.exports = router;

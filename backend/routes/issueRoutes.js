const express = require('express');
const router = express.Router();
const { createIssue, getIssues, getIssueById, updateIssueStatus } = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: Civic issue reporting and management
 */

/**
 * @swagger
 * /api/issues:
 *   get:
 *     summary: Get all issues (with geo-search support)
 *     tags: [Issues]
 *     parameters:
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude
 *       - in: query
 *         name: dist
 *         schema:
 *           type: number
 *         description: Search distance in meters (default 5000)
 *     responses:
 *       200:
 *         description: List of issues
 *   post:
 *     summary: Create a new issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - longitude
 *               - latitude
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Issue created
 */
router.route('/')
  .get(getIssues)
  .post(protect, authorize('citizen'), upload.array('images', 5), createIssue);

/**
 * @swagger
 * /api/issues/{id}:
 *   get:
 *     summary: Get issue by ID
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Issue details
 *       404:
 *         description: Issue not found
 */
router.route('/:id')
  .get(getIssueById);

/**
 * @swagger
 * /api/issues/{id}/status:
 *   patch:
 *     summary: Update issue status
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, resolved]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Issue not found
 */
router.patch('/:id/status', protect, authorize('admin', 'authority'), updateIssueStatus);

module.exports = router;

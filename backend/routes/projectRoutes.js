const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Civic project tracking and budget transparency
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - budgetAllocated
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               budgetAllocated:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Project created
 */
router.route('/')
  .get(getProjects)
  .post(protect, authorize('admin', 'authority'), createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   patch:
 *     summary: Update project progress/budget
 *     tags: [Projects]
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
 *               progress:
 *                 type: number
 *               budgetUsed:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [upcoming, active, completed, on_hold]
 *     responses:
 *       200:
 *         description: Project updated
 *       404:
 *         description: Project not found
 */
router.patch('/:id', protect, authorize('admin', 'authority'), updateProject);

module.exports = router;

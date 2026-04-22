const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Platform-wide statistics and data insights
 */

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get dashboard analytics (issues, status, and heatmap data)
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/', getAnalytics);

module.exports = router;

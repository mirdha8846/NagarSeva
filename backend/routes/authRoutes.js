const express = require('express');
const router = express.Router();
const { registerUser, authUser, getMe, getAuthorityMembers } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [citizen, admin, authority]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid data
 */
router.post('/signup', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Auth user & get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid email or password
 */
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/authority:
 *   get:
 *     summary: Get all authority members
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authority list retrieved
 */
router.get('/authority', getAuthorityMembers);

module.exports = router;

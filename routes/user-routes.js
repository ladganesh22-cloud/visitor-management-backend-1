const express = require('express');

const { getAllUsers, getUserById } = require('../controllers/userController');

const requireAuth = require('../middlewares/registerAuth')

const router = express.Router();

// requireAuth for authorised API
router.use(requireAuth)

/**
 * Method: GET
 * Endpoint: /api/users/
 * Description: Get all users
 * Response: List of users or error
 */
router.get('/', getAllUsers);

/**
 * Method: GET
 * URL: /api/users/:id
 * Description: To get a single user details by ID
 * Access: Public
 * Parameters: id
 */
router.get('/:id', getUserById);

module.exports = router;

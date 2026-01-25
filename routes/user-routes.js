const express = require('express');


const { getAllPeoples, getPeopleById } = require('../controllers/pepoleController');

const requireAuth = require('../middlewares/registerAuth');


const router = express.Router();

// requireAuth for authorised API
router.use(requireAuth)

/**
 * Method: GET
 * Endpoint: /api/users/
 * Description: Get all users
 * Response: List of users or error
 */
router.get('/', getAllPeoples);

/**
 * Method: GET
 * URL: /api/users/:id
 * Description: To get a single user details by ID
 * Access: Public
 * Parameters: id
 */
router.get('/:id', getPeopleById);

module.exports = router;

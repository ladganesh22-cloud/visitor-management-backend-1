const express = require('express');

const { createRegisterUser, loginVisitor } = require('../controllers/authController');

const router = express.Router();


/**
 * Method: POST
 * Endpoint: /api/auth/register
 * Description: Register a new user
 * Request Body: { name, email, password, role }
 * Response: Success message or error
 */
router.post('/register', createRegisterUser);

/**
 * Method: POST
 * Endpoint: /api/auth/login
 * Description: Login a user
 * Request Body: { email, password }
 * Response: JWT token or error
 */
router.post('/login', loginVisitor);

module.exports = router;

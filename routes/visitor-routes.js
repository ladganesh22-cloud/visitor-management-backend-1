const express = require('express');

const { getAllGBLVisitors, getGBLVisitorById, createGBLVisitor, updateGBLVisitor, deleteGBLVisitor } = require('../controllers/gblvisitorsController');

const requireAuth = require('../middlewares/registerAuth');


const router = express.Router();

router.use(requireAuth)


/**
 * Method: GET
 * Endpoint: /api/visitors/
 * Description: Get all visitors
 * Response: List of visitors or error
 */
router.get('/', getAllGBLVisitors);

/**
 * Method: GET
 * Endpoint: /api/visitors/:id
 * Description: Get visitor by ID
 * Response: Visitor data or error
 */
router.get('/:id', getGBLVisitorById);

/**
 * Method: POST
 * Endpoint: /api/visitors/
 * Description: Create a new visitor
 * Request Body: { name, email, phone, address, photo, idProof, createdBy }
 * Response: Created visitor data or error
 */
router.post('/', createGBLVisitor);

/**
 * Method: PUT
 * Endpoint: /api/visitors/:id
 * Description: Update visitor by ID
 * Request Body: Fields to update
 * Response: Updated visitor data or error
 */
router.put('/:id', updateGBLVisitor);

/**
 * Method: DELETE
 * Endpoint: /api/visitors/:id
 * Description: Delete visitor by ID
 * Response: Success message or error
 */
router.delete('/:id', deleteGBLVisitor);


module.exports = router;

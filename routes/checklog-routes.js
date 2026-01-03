const express = require('express');

const { getAllCheckLog, scanCheckIn, scanCheckOut } = require('../controllers/checklogController');

const requireAuth = require('../middlewares/registerAuth')

const router = express.Router();

router.use(requireAuth)


/**
 * Metods: GET
 * Paths: /scan-checkin, /scan-checkout
 * Description: Routes for scanning check-in and check-out of visitors
 */
router.get('/', getAllCheckLog);

/**
 * Metods: POST
 * Paths: /scan-checkin, /scan-checkout
 * Description: Routes for scanning check-in and check-out of visitors
 */
router.post('/checkin', scanCheckIn);

/**
 * Metods: POST
 * Paths: /scan-checkout
 * Description: Route for scanning check-out of visitors
 */
router.put('/checkout/:id', scanCheckOut);

module.exports = router;

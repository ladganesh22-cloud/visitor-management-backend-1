const express = require('express');
const { getIssuePass, issuePass, getPass, verifyQrImage } = require('../controllers/passController');
const requireAuth = require('../middlewares/registerAuth')
const multer = require("multer");
const router = express.Router();

router.use(requireAuth)



/**
 * Method: GET
 * Endpoint: /api/passes/
 * Description: get all Issue pass
 * Request Body: { visitorId, hostId, passType, validFrom, validTo, issuedBy }
 * Response: Created pass data or error
 */
router.get('/', getIssuePass);


/**
 * Method: POST
 * Endpoint: /api/passes/
 * Description: Issue a new pass
 * Request Body: { visitorId, hostId, passType, validFrom, validTo, issuedBy }
 * Response: Created pass data or error
 */
router.post('/', issuePass);

/**
 * Method: GET
 * Endpoint: /api/passes/:id
 * Description: Get pass by ID
 * Response: Pass data or error
 */
router.get('/:id', getPass);


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});


/**
 * Method: POST
 * Endpoint: /api/verify-qr-image
 * Description: Get verify qr image
 * Response: Pass data or error
 */
// router.get('/verify-qr-image', getPass);
// router.post("/verify-qr-image", requireAuth, upload.single("qrImage"), verifyQrImage);
router.post("/verify-qr-image", upload.single("qrImage"), verifyQrImage);

module.exports = router;

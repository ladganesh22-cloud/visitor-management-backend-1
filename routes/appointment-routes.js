const express = require('express');

const { getAllAppointments, createAppointment, rejectAppointment, approveAppointment } = require('../controllers/appointmentController');
const requireAuth = require('../middlewares/registerAuth')
const router = express.Router();
router.use(requireAuth)

/**
 * Method: GET
 * Endpoint: /api/appointments/
 * Description: Get all appointments
 * Response: List of appointments or error
 */
router.get('/', getAllAppointments);


/**
 * Method: POST
 * Endpoint: /api/appointments/
 * Description: Create a new appointment
 * Request Body: { purpose, appointmentDate, visitorId, hostId, approvalBy, notificationSent }
 * Response: Created appointment data or error
 */
router.post('/', createAppointment);

/**
 * Method: PUT
 * Endpoint: /api/appointments/:id/approve
 * Description: Appointment Approved to visitor by Host
 */
router.put("/:id/approve", approveAppointment);


/**
 * Method: PUT
 * Endpoint: /api/appointments/:id/reject
 * Description: Appointment Reject to visitor by Host
 */
router.put("/:id/reject", rejectAppointment);

module.exports = router;

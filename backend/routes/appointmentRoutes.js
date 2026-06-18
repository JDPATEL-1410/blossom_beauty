const express = require('express');
const router = express.Router();
const { getAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAppointments)
    .post(createAppointment);

router.route('/:id')
    .put(protect, updateAppointmentStatus)
    .delete(protect, deleteAppointment);

module.exports = router;

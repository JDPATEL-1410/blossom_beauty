const Appointment = require('../models/Appointment');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({}).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching appointments' });
    }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
    try {
        const { name, phone, email, service, date, time, notes } = req.body;

        if (!name || !phone || !service || !date || !time) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const appointment = await Appointment.create({
            name, phone, email, service, date, time, notes
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating appointment' });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Admin
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating appointment' });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment) {
            await appointment.deleteOne();
            res.json({ message: 'Appointment removed' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting appointment' });
    }
};

module.exports = {
    getAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment,
};

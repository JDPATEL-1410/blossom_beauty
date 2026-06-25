const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        email: {
            type: String,
        },
        service: {
            type: String,
            required: [true, 'Please select a service'],
        },
        date: {
            type: String,
            required: [true, 'Please select a date'],
        },
        time: {
            type: String,
            required: [true, 'Please select a time'],
        },
        notes: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
    },
    {
        timestamps: true, // This automatically creates createdAt and updatedAt perfectly formatted
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

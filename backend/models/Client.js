const mongoose = require('mongoose');

const clientSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
            unique: true,
        },
        email: {
            type: String,
            default: '',
        },
        lastVisitDate: {
            type: Date,
            default: null,
        },
        revisitWeeks: {
            type: Number,
            default: 4,
        },
        lastPeriodDate: {
            type: Date,
            default: null,
        },
        periodCycleDays: {
            type: Number,
            default: 28,
        },
        notes: {
            type: String,
            default: '',
        },
        isWalkIn: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

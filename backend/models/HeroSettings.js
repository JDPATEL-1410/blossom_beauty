const mongoose = require('mongoose');

const heroSettingsSchema = mongoose.Schema(
    {
        effect: {
            type: String,
            required: true,
            default: 'fade', // 'slide', 'fade', 'cube', 'coverflow', 'flip'
        },
        autoplayDelay: {
            type: Number,
            required: true,
            default: 5000, // Time in ms (e.g. 5000 = 5 seconds)
        },
    },
    {
        timestamps: true,
    }
);

const HeroSettings = mongoose.model('HeroSettings', heroSettingsSchema);

module.exports = HeroSettings;

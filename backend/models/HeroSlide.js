const mongoose = require('mongoose');

const heroSlideSchema = mongoose.Schema(
    {
        desktopImageUrl: {
            type: String,
            required: true,
        },
        mobileImageUrl: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);

module.exports = HeroSlide;

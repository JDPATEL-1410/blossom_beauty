const mongoose = require('mongoose');

const galleryImageSchema = mongoose.Schema(
    {
        src: {
            type: String,
            required: [true, 'Please add an image URL'],
        },
        alt: {
            type: String,
            required: [true, 'Please add an image description (alt text)'],
        },
        cat: {
            type: String,
            required: [true, 'Please specify a category'],
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

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

module.exports = GalleryImage;

const mongoose = require('mongoose');

const offerSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        orig: {
            type: String,
            required: [true, 'Please add original price/text'],
        },
        price: {
            type: String,
            required: [true, 'Please add discounted price'],
        },
        save: {
            type: String,
            required: [true, 'Please add save percentage or amount'],
        },
        badge: {
            type: String,
            required: [true, 'Please add a badge text'],
        },
        icon: {
            type: String,
            required: [true, 'Please select an icon'],
            default: 'FaStar',
        },
        image: {
            type: String,
            required: [true, 'Please add an image URL'],
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

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;

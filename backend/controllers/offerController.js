const Offer = require('../models/Offer');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({}).sort({ order: 1, createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching offers' });
    }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = async (req, res) => {
    try {
        const { title, orig, price, save, badge, icon, image, order } = req.body;

        if (!title || !orig || !price || !save || !badge || !icon || !image) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const offer = await Offer.create({
            title, orig, price, save, badge, icon, image, order: order || 0
        });

        res.status(201).json(offer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating offer' });
    }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
const updateOffer = async (req, res) => {
    try {
        const { title, orig, price, save, badge, icon, image, order } = req.body;
        
        const offer = await Offer.findById(req.params.id);

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            {
                title: title || offer.title,
                orig: orig || offer.orig,
                price: price || offer.price,
                save: save || offer.save,
                badge: badge || offer.badge,
                icon: icon || offer.icon,
                image: image || offer.image,
                order: order !== undefined ? order : offer.order
            },
            { new: true }
        );

        res.json(updatedOffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating offer' });
    }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            await offer.deleteOne();
            res.json({ message: 'Offer removed' });
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting offer' });
    }
};

module.exports = {
    getOffers,
    createOffer,
    updateOffer,
    deleteOffer,
};

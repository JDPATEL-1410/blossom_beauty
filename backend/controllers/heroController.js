const HeroSlide = require('../models/HeroSlide');
const HeroSettings = require('../models/HeroSettings');

// @desc    Get all hero slides
// @route   GET /api/hero
// @access  Public
const getSlides = async (req, res) => {
    try {
        const slides = await HeroSlide.find({}).sort({ order: 1, createdAt: -1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving slides' });
    }
};

// @desc    Create a hero slide
// @route   POST /api/hero
// @access  Private/Admin
const createSlide = async (req, res) => {
    try {
        const { desktopImageUrl, mobileImageUrl, order } = req.body;

        if (!desktopImageUrl || !mobileImageUrl) {
            return res.status(400).json({ message: 'Both desktop and mobile image URLs are required' });
        }

        const slide = new HeroSlide({
            desktopImageUrl,
            mobileImageUrl,
            order: order || 0,
        });

        const createdSlide = await slide.save();
        res.status(201).json(createdSlide);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating slide' });
    }
};

// @desc    Delete a hero slide
// @route   DELETE /api/hero/:id
// @access  Private/Admin
const deleteSlide = async (req, res) => {
    try {
        const slide = await HeroSlide.findById(req.params.id);

        if (slide) {
            await slide.deleteOne();
            res.json({ message: 'Slide removed' });
        } else {
            res.status(404).json({ message: 'Slide not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting slide' });
    }
};

// @desc    Update a hero slide
// @route   PUT /api/hero/:id
// @access  Private/Admin
const updateSlide = async (req, res) => {
    try {
        const { desktopImageUrl, mobileImageUrl, order } = req.body;
        const slide = await HeroSlide.findById(req.params.id);

        if (slide) {
            slide.desktopImageUrl = desktopImageUrl || slide.desktopImageUrl;
            slide.mobileImageUrl = mobileImageUrl || slide.mobileImageUrl;
            slide.order = order !== undefined ? order : slide.order;

            const updatedSlide = await slide.save();
            res.json(updatedSlide);
        } else {
            res.status(404).json({ message: 'Slide not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating slide' });
    }
};

// @desc    Get hero settings
// @route   GET /api/hero/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await HeroSettings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = await HeroSettings.create({
                effect: 'fade',
                autoplayDelay: 5000
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching hero settings' });
    }
};

// @desc    Update hero settings
// @route   PUT /api/hero/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { effect, autoplayDelay } = req.body;
        let settings = await HeroSettings.findOne();

        if (settings) {
            settings.effect = effect || settings.effect;
            settings.autoplayDelay = autoplayDelay !== undefined ? autoplayDelay : settings.autoplayDelay;
            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            // Fallback if deleted somehow
            settings = await HeroSettings.create({ effect, autoplayDelay });
            res.status(201).json(settings);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating settings' });
    }
};

module.exports = {
    getSlides,
    createSlide,
    deleteSlide,
    updateSlide,
    getSettings,
    updateSettings,
};

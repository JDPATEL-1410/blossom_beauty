const GalleryImage = require('../models/GalleryImage');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = async (req, res) => {
    try {
        const images = await GalleryImage.find({}).sort({ order: 1, createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching gallery images' });
    }
};

// @desc    Create new gallery image
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryImage = async (req, res) => {
    try {
        const { src, alt, cat, order } = req.body;

        if (!src || !alt || !cat) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const image = await GalleryImage.create({
            src, alt, cat, order: order || 0
        });

        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating gallery image' });
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryImage = async (req, res) => {
    try {
        const { src, alt, cat, order } = req.body;
        
        const image = await GalleryImage.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Gallery image not found' });
        }

        const updatedImage = await GalleryImage.findByIdAndUpdate(
            req.params.id,
            {
                src: src || image.src,
                alt: alt || image.alt,
                cat: cat || image.cat,
                order: order !== undefined ? order : image.order
            },
            { new: true }
        );

        res.json(updatedImage);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating gallery image' });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryImage = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);

        if (image) {
            await image.deleteOne();
            res.json({ message: 'Gallery image removed' });
        } else {
            res.status(404).json({ message: 'Gallery image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting gallery image' });
    }
};

module.exports = {
    getGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
};

const express = require('express');
const router = express.Router();
const { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getGalleryImages)
    .post(protect, createGalleryImage);

router.route('/:id')
    .delete(protect, deleteGalleryImage)
    .put(protect, updateGalleryImage);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getSlides, createSlide, deleteSlide, updateSlide, getSettings, updateSettings } = require('../controllers/heroController');
const { protect } = require('../middleware/authMiddleware');

// Important: Settings routes must come before /:id routes so "settings" isn't treated as an ID
router.route('/settings')
    .get(getSettings)
    .put(protect, updateSettings);

router.route('/')
    .get(getSlides)
    .post(protect, createSlide);

router.route('/:id')
    .delete(protect, deleteSlide)
    .put(protect, updateSlide);

module.exports = router;

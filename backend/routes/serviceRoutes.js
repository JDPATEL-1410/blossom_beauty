const express = require('express');
const router = express.Router();
const { getServices, updateServiceCategory } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getServices);

router.route('/:id')
    .put(protect, updateServiceCategory);

module.exports = router;

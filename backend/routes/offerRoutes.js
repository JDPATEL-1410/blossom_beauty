const express = require('express');
const router = express.Router();
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getOffers)
    .post(protect, createOffer);

router.route('/:id')
    .delete(protect, deleteOffer)
    .put(protect, updateOffer);

module.exports = router;

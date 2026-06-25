const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin } = require('../controllers/authController');

router.post('/login', authAdmin);
// router.post('/register', registerAdmin); // Uncomment to register initial admin

module.exports = router;

const express = require('express');
const { register, login, profile, forgotPassword } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/profile', authMiddleware, profile);

module.exports = router;

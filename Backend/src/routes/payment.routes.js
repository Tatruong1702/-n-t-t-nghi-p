const express = require('express');
const { createPayment, getPayments } = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/', createPayment);
router.get('/', getPayments);

module.exports = router;

const express = require('express');
const { createCourt, getCourts, getCourtById, updateCourt, deleteCourt } = require('../controllers/court.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getCourts);
router.get('/:id', getCourtById);
router.post('/', authMiddleware, createCourt);
router.put('/:id', authMiddleware, updateCourt);
router.delete('/:id', authMiddleware, deleteCourt);

module.exports = router;

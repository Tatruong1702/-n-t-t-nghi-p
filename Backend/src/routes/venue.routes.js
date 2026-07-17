const express = require('express');
const { createVenue, getVenues, getVenueById, updateVenue, deleteVenue } = require('../controllers/venue.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/', getVenues);
router.get('/:id', getVenueById);
router.post('/', authMiddleware, upload.single('image'), createVenue);
router.put('/:id', authMiddleware, upload.single('image'), updateVenue);
router.delete('/:id', authMiddleware, deleteVenue);

module.exports = router;

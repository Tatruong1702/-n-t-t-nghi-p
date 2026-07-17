const express = require('express');
const {
  createBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getCourtBookings,
} = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/', createBooking);
router.get('/search', getCourtBookings);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

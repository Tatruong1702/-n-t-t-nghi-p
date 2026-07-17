const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Venue = require('../models/Venue');
const Payment = require('../models/Payment');
const { isCourtAvailable, calculatePrice } = require('../services/booking.service');
const { successResponse, errorResponse } = require('../utils/response');

const createBooking = async (req, res) => {
  try {
    const { court_id, booking_date, start_time, end_time, user_id } = req.body;
    const court = await Court.findByPk(court_id);
    if (!court) return errorResponse(res, 'Court not found', 404);

    const start = new Date(`${booking_date} ${start_time}`);
    const end = new Date(`${booking_date} ${end_time}`);
    if (start >= end) return errorResponse(res, 'Invalid booking times', 400);

    const available = await isCourtAvailable(court_id, booking_date, start_time, end_time);
    if (!available) return errorResponse(res, 'Court is already booked for this time', 409);

    const totalPrice = calculatePrice(court.price_per_hour, start_time, end_time);
    const booking = await Booking.create({
      user_id: req.user.role === 'admin' && user_id ? user_id : req.user.user_id,
      court_id,
      booking_date,
      start_time,
      end_time,
      total_price: totalPrice,
    });

    return successResponse(res, { booking }, 'Booking created', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return errorResponse(res, 'Booking not found', 404);
    if (req.user.role !== 'admin' && booking.user_id !== req.user.user_id) {
      return errorResponse(res, 'Not authorized to update this booking', 403);
    }

    const { court_id, booking_date, start_time, end_time, status, user_id } = req.body;
    const updates = {};
    if (court_id) updates.court_id = court_id;
    if (booking_date) updates.booking_date = booking_date;
    if (start_time) updates.start_time = start_time;
    if (end_time) updates.end_time = end_time;
    if (status) updates.status = status;
    if (req.user.role === 'admin' && user_id) updates.user_id = user_id;

    if (court_id || booking_date || start_time || end_time) {
      const court = await Court.findByPk(court_id || booking.court_id);
      if (!court) return errorResponse(res, 'Court not found', 404);
      const newStart = new Date(`${booking_date || booking.booking_date} ${start_time || booking.start_time}`);
      const newEnd = new Date(`${booking_date || booking.booking_date} ${end_time || booking.end_time}`);
      if (newStart >= newEnd) return errorResponse(res, 'Invalid booking times', 400);
      const available = await isCourtAvailable(court.id || court.court_id, booking_date || booking.booking_date, start_time || booking.start_time, end_time || booking.end_time);
      if (!available && !(booking.court_id === (court_id || booking.court_id) && booking.booking_date === (booking_date || booking.booking_date) && booking.start_time === (start_time || booking.start_time) && booking.end_time === (end_time || booking.end_time))) {
        return errorResponse(res, 'Court is already booked for this time', 409);
      }
      updates.total_price = calculatePrice(court.price_per_hour, start_time || booking.start_time, end_time || booking.end_time);
    }

    const previousStatus = booking.status;
    const newStatus = status || previousStatus;

    await booking.update(updates);

    // Return current booking after update for frontend consistency
    const updatedBooking = await Booking.findByPk(req.params.id);
    return successResponse(res, { booking: updatedBooking }, 'Booking updated');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return errorResponse(res, 'Booking not found', 404);
    if (req.user.role !== 'admin' && booking.user_id !== req.user.user_id) {
      return errorResponse(res, 'Not authorized to delete this booking', 403);
    }

    await booking.destroy();
    return successResponse(res, {}, 'Booking deleted');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getCourtBookings = async (req, res) => {
  try {
    const { court_id, booking_date } = req.query;
    if (!court_id) return errorResponse(res, 'court_id is required', 400);

    const filter = { court_id };
    if (booking_date) filter.booking_date = booking_date;

    const bookings = await Booking.findAll({
      where: filter,
      include: [
        {
          model: Court,
          include: [{ model: Venue }],
        },
      ],
      order: [['start_time', 'ASC']],
    });

    return successResponse(res, { bookings }, 'Bookings retrieved');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.user_id },
      include: [
        {
          model: Court,
          include: [{ model: Venue }],
        },
        {
          model: Payment,
          required: false,
        },
      ],
      order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
    });
    return successResponse(res, { bookings }, 'Bookings retrieved');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_id: req.params.id },
      include: [
        {
          model: Court,
          include: [{ model: Venue }],
        },
        {
          model: Payment,
          required: false,
        },
      ],
    });
    if (!booking) return errorResponse(res, 'Booking not found', 404);
    return successResponse(res, { booking }, 'Booking loaded');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_id: req.params.id, user_id: req.user.user_id },
    });
    if (!booking) return errorResponse(res, 'Booking not found or access denied', 404);

    await booking.update({ status: 'cancelled' });
    return successResponse(res, { booking }, 'Booking cancelled');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getCourtBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
};

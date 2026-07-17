const { recordPayment } = require('../services/payment.service');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { successResponse, errorResponse } = require('../utils/response');

const createPayment = async (req, res) => {
  try {
    const { booking_id, payment_method, transaction_code, amount } = req.body;
    const booking = await Booking.findByPk(booking_id);
    if (!booking) return errorResponse(res, 'Booking not found', 404);

    const payment = await recordPayment({
      booking_id,
      payment_method,
      transaction_code,
      amount: amount || booking.total_price,
      status: 'paid',
      paid_at: new Date(),
    });

    return successResponse(res, { payment }, 'Payment recorded', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          where: { user_id: req.user.user_id },
        },
      ],
    });
    return successResponse(res, { payments }, 'Payments retrieved');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { createPayment, getPayments };

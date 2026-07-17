const Payment = require('../models/Payment');

const recordPayment = async ({ booking_id, amount, payment_method, status, transaction_code, paid_at }) => {
  const payment = await Payment.create({
    booking_id,
    amount,
    payment_method,
    status,
    transaction_code,
    paid_at,
  });
  return payment;
};

module.exports = { recordPayment };

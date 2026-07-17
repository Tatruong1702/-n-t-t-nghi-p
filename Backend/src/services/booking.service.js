const { Op } = require('sequelize');
const Booking = require('../models/Booking');

const isCourtAvailable = async (courtId, bookingDate, startTime, endTime) => {
  const conflict = await Booking.findOne({
    where: {
      court_id: courtId,
      booking_date: bookingDate,
      status: { [Op.ne]: 'cancelled' },
      [Op.or]: [
        {
          [Op.and]: [
            { start_time: { [Op.lt]: endTime } },
            { end_time: { [Op.gt]: startTime } },
          ],
        },
      ],
    },
  });

  return !conflict;
};

const parseTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const calculatePrice = (pricePerHour, startTime, endTime) => {
  const durationHours = Math.max((parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime)) / 60, 1);
  return Number((pricePerHour * durationHours).toFixed(2));
};

module.exports = { isCourtAvailable, calculatePrice };

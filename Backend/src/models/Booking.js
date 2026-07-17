const { sequelize, DataTypes } = require('../config/db');

const Booking = sequelize.define(
  'Booking',
  {
    booking_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    court_id: { type: DataTypes.INTEGER },
    booking_date: { type: DataTypes.DATEONLY },
    start_time: { type: DataTypes.TIME },
    end_time: { type: DataTypes.TIME },
    total_price: { type: DataTypes.DECIMAL(10, 2) },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'), defaultValue: 'pending' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'bookings',
    timestamps: false,
  }
);

module.exports = Booking;

const { sequelize, DataTypes } = require('../config/db');

const Payment = sequelize.define(
  'Payment',
  {
    payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.INTEGER },
    payment_method: { type: DataTypes.STRING(50) },
    transaction_code: { type: DataTypes.STRING(100) },
    amount: { type: DataTypes.DECIMAL(10, 2) },
    status: { type: DataTypes.ENUM('pending', 'paid', 'failed') },
    paid_at: { type: DataTypes.DATE },
  },
  {
    tableName: 'payments',
    timestamps: false,
  }
);

module.exports = Payment;

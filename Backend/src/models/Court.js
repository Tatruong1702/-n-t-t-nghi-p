const { sequelize, DataTypes } = require('../config/db');

const Court = sequelize.define(
  'Court',
  {
    court_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    venue_id: { type: DataTypes.INTEGER },
    court_name: { type: DataTypes.STRING(100) },
    sport_type: { type: DataTypes.STRING(50) },
    price_per_hour: { type: DataTypes.DECIMAL(10, 2) },
    image: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  {
    tableName: 'courts',
    timestamps: false,
  }
);

module.exports = Court;

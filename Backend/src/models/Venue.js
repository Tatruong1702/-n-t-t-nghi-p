const { sequelize, DataTypes } = require('../config/db');

const Venue = sequelize.define(
  'Venue',
  {
    venue_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    owner_id: { type: DataTypes.INTEGER },
    venue_name: { type: DataTypes.STRING(255) },
    description: { type: DataTypes.TEXT },
    address: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING(100) },
    image: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  {
    tableName: 'venues',
    timestamps: false,
  }
);

module.exports = Venue;

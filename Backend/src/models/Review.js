const { sequelize, DataTypes } = require('../config/db');

const Review = sequelize.define(
  'Review',
  {
    review_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    court_id: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.INTEGER },
    comment: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'reviews',
    timestamps: false,
  }
);

module.exports = Review;

const { sequelize, DataTypes } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    full_name: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(20) },
    avatar: { type: DataTypes.STRING(255) },
    role: { type: DataTypes.ENUM('admin', 'owner', 'customer'), defaultValue: 'customer' },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

module.exports = User;

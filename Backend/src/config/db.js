const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = { sequelize, DataTypes, connectDB };

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userDeviceToken: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = { Registration };

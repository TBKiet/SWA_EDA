const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'short_description',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  registered: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'upcoming',
  },

  // createdAt: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  //   field: 'createdAt', // Phải match đúng tên SQL column
  // },
  // updatedAt: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  //   field: 'updatedAt',
  // },

}, {
  tableName: 'events',
  freezeTableName: true,
  timestamps: true, // 👈 Cho phép Sequelize xử lý createdAt/updatedAt nếu có
});

module.exports = {
  Event,
};

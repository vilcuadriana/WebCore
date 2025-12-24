const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudyGroup = sequelize.define('StudyGroup', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = StudyGroup;

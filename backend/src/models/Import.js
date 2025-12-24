const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Import = sequelize.define('Import', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rawText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NoteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Import;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentMarkdown: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Note;
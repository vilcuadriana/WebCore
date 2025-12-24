const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NoteShare = sequelize.define('NoteShare', {
  NoteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  permission: {
    type: DataTypes.ENUM('view', 'edit'),
    allowNull: false,
    defaultValue: 'view',
  },
}, {
  tableName: 'note_shares',
  timestamps: true,
});

module.exports = NoteShare;

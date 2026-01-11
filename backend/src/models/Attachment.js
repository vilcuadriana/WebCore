/**
 * Model Sequelize pentru atașamente.
 * Reprezintă fișierele (imagini, documente) asociate unei notițe.
 *
 * Atașamentele sunt salvate pe disc, iar în baza de date
 * se păstrează doar metadatele necesare.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attachment = sequelize.define('Attachment', {
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storedName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NoteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Attachment;

/**
 * Model Sequelize pentru membrii grupurilor de studiu.
 * Reprezintă relația many-to-many dintre utilizatori și grupuri.
 *
 * Include și rolul utilizatorului în grup (owner / member).
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupMember = sequelize.define('GroupMember', {
  role: {
    type: DataTypes.ENUM('owner', 'member'),
    allowNull: false,
    defaultValue: 'member',
  },
});

module.exports = GroupMember;

const sequelize = require('../config/database');
const User = require('./User');
const Subject = require('./Subject');
const Note = require('./Note');

User.hasMany(Subject);
Subject.belongsTo(User);

User.hasMany(Note);
Note.belongsTo(User);

Subject.hasMany(Note);
Note.belongsTo(Subject);

module.exports = {
  sequelize,
  User,
  Subject,
  Note
};
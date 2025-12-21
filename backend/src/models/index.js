const sequelize = require('../config/database');
const User = require('./User');
const Subject = require('./Subject');
const Note = require('./Note');
const Attachment = require('./Attachment');

User.hasMany(Subject);
Subject.belongsTo(User);

User.hasMany(Note);
Note.belongsTo(User);

Subject.hasMany(Note);
Note.belongsTo(Subject);

Note.hasMany(Attachment);
Attachment.belongsTo(Note);

User.hasMany(Attachment, { onDelete: 'cascade' });
Attachment.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Subject,
  Note,
  Attachment
};
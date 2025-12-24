const sequelize = require('../config/database');

const User = require('./User');
const Subject = require('./Subject');
const Note = require('./Note');
const Attachment = require('./Attachment');
const Tag = require('./Tag');
const NoteShare = require('./NoteShare');
const Import = require('./Import');
const StudyGroup = require('./StudyGroup');
const GroupMember = require('./GroupMember');

User.hasMany(Subject);
Subject.belongsTo(User);

User.hasMany(Note);
Note.belongsTo(User);

User.hasMany(Tag);
Tag.belongsTo(User);

User.hasMany(Attachment);
Attachment.belongsTo(User);

User.hasMany(Import);
Import.belongsTo(User);

Subject.hasMany(Note);
Note.belongsTo(Subject);

Note.hasMany(Attachment);
Attachment.belongsTo(Note);

Note.belongsToMany(Tag, { through: 'NoteTags' });
Tag.belongsToMany(Note, { through: 'NoteTags' });

Note.hasOne(Import);
Import.belongsTo(Note);

User.belongsToMany(Note, {
  through: NoteShare,
  as: 'SharedNotes',
});
Note.belongsToMany(User, {
  through: NoteShare,
  as: 'SharedWith',
});

StudyGroup.hasMany(GroupMember);
GroupMember.belongsTo(StudyGroup);

User.hasMany(GroupMember);
GroupMember.belongsTo(User);

StudyGroup.belongsToMany(User, { through: GroupMember });
User.belongsToMany(StudyGroup, { through: GroupMember });

module.exports = {
  sequelize,
  User,
  Subject,
  Note,
  Attachment,
  Tag,
  NoteShare,
  Import,
  StudyGroup,
  GroupMember,
};

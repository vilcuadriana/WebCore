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

/* =========================
   USER RELATIONS
========================= */
User.hasMany(Subject, { onDelete: 'CASCADE' });
Subject.belongsTo(User);

User.hasMany(Note, { onDelete: 'CASCADE' });
Note.belongsTo(User);

User.hasMany(Tag, { onDelete: 'CASCADE' });
Tag.belongsTo(User);

User.hasMany(Attachment, { onDelete: 'CASCADE' });
Attachment.belongsTo(User);

User.hasMany(Import, { onDelete: 'CASCADE' });
Import.belongsTo(User);

/* =========================
   SUBJECT
========================= */
Subject.hasMany(Note, { onDelete: 'SET NULL' });
Note.belongsTo(Subject);

/* =========================
   NOTE
========================= */
Note.hasMany(Attachment, { onDelete: 'CASCADE' });
Attachment.belongsTo(Note);

Note.hasOne(Import, { onDelete: 'CASCADE' });
Import.belongsTo(Note);

Note.belongsToMany(Tag, { through: 'NoteTags' });
Tag.belongsToMany(Note, { through: 'NoteTags' });

/* =========================
   SHARING
========================= */
User.belongsToMany(Note, {
  through: NoteShare,
  as: 'SharedNotes',
});
Note.belongsToMany(User, {
  through: NoteShare,
  as: 'SharedWith',
});

/* =========================
   STUDY GROUPS (FIX CORECT)
========================= */

/**
 * Relație many-to-many User ↔ StudyGroup
 * prin tabela intermediară GroupMember
 */
StudyGroup.belongsToMany(User, { through: GroupMember });
User.belongsToMany(StudyGroup, { through: GroupMember });

/**
 * Relații directe NECESARE pentru Sequelize include
 * (rezolvă EagerLoadingError)
 */
StudyGroup.hasMany(GroupMember, {
  foreignKey: 'StudyGroupId',
  onDelete: 'CASCADE',
});

GroupMember.belongsTo(StudyGroup, {
  foreignKey: 'StudyGroupId',
});

User.hasMany(GroupMember, {
  foreignKey: 'UserId',
  onDelete: 'CASCADE',
});

GroupMember.belongsTo(User, {
  foreignKey: 'UserId',
});

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

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DocumentSchema = new Schema({
  name: String,
  type: String,
  path: {
    type: String,
    unique: true
  },
  originalName: String,
  active: Boolean,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

DocumentSchema.pre('save', function () {
  let that = this;

  that.wasNew = that.isNew;
  that.updatedAt = new Date();
});

module.exports = mongoose.model('Document', DocumentSchema);

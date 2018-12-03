'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DocumentSchema = new Schema({
  name: String,
  type: String,
  path: {
    type: String
  },
  url: {
    type: String
  },
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

module.exports = mongoose.model('Document', DocumentSchema);

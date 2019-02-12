'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TaxonomySchema = new Schema({
  name: String,
  type: String,
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Document'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

TaxonomySchema.pre('save', function () {
  let that = this;

  that.wasNew = that.isNew;
  that.updatedAt = new Date();
});

module.exports = mongoose.model('Taxonomy', TaxonomySchema);

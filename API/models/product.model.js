'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
  title: {
    type: String,
    index: true
  },
  address: {},
  loc: {
    type: [Number], // {lng, lat}
    index: '2dsphere'
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  publishedAt: Date,
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

ProductSchema.pre('save', function () {
  let that = this;

  that.wasNew = that.isNew;
  that.updatedAt = new Date();
});

module.exports = mongoose.model('Product', ProductSchema);

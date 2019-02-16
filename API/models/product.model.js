'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defined object product
// name, cover, adress,
let ProductSchema = new Schema({
  name: {
    type: String,
    index: true,
    required: true
  },
  cover: {
    type: Schema.Types.ObjectId,
    ref: 'Document'
  },
  categories: [{
    // join categories with Taxo
    type: Schema.Types.ObjectId,
    ref: 'ProductCategory'
  }],
  price: {
    type: Number,
    required: true
  },
  promotion: {
    type: Number
  },
  stock: {
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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

// create model in the mongodb
module.exports = mongoose.model('Product', ProductSchema);

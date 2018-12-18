'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CartSchema = new Schema({
  status: {
    type: String,
    enum: ['draft', 'active', 'cancelled', 'obsolete'],
    default: 'draft'
  },
  cartEntries: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number
  }],
  price: {
    devise: String,
    price: Number
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  payedAt: Date,
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

module.exports = mongoose.model('Cart', CartSchema);

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
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  price: {
    devise: String,
    price: Number
  },
  documents: {
    receipt: [{
      type: Schema.Types.ObjectId,
      ref: 'Document'
    }],
    delivery: [{
      type: Schema.Types.ObjectId,
      ref: 'Document'
    }],
    credit: [{
      type: Schema.Types.ObjectId,
      ref: 'Document'
    }]
  },
  remind: {
    type: Number,
    default: 0
  },
  wait3DS: {
    type: Boolean,
    default: false
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

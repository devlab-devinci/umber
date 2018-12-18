'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OrderSchema = new Schema({
  stripeId: {
    type: String,
    index: true
  },
  type: {
    type: String,
    enum: ['capture', 'refund', 'cash_withdrawal', 'refund_reversal', 'dispute', 'dispute_loss'],
    required: true
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  },
  QRCode: {
    type: Schema.Types.ObjectId,
    ref: 'Document'
  },
  mode: {
    type: String,
    enum: ['card', 'sepa', 'payout'],
    required: true
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

module.exports = mongoose.model('Order', OrderSchema);

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let CartSchema = new Schema({
    /*
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
      price: Number,
      quantity: Number
    }],
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    price: {
      devise: {
        type: String,
        default: 'euro'
      },
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
    qrCode: Object,
    remind: {
      type: Number,
      default: 0
    },
    wait3DS: {
      type: Boolean,
      default: false
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    },
    */
    reference: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'paid'],
        default: 'active'
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
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
    },
    total_bill: {
        type: Number,
        required: true
    },
    payedAt: Date,
    isPaid: {
        type: Boolean,
        required: true
    }

});


module.exports = mongoose.model('Cart', CartSchema);

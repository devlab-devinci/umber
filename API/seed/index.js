/**
 * Populate DB with sample data on server start
 * to disable, edit config.js, and set `seedDB: false`
 */

'use strict';

const User = require('../../API/models/Users');
const Taxonomy = require('../../API/models/taxonomy.model');
const Cart = require('../../API/models/cart.model');
const _ = require('lodash');


User
  .find({role: 'admin'})
  .then(function (users) {
    let p = [];

    if (!users || !users.length) {
      let user = new User({
        role: 'admin',
        fullname: 'umber',
        picture: 'https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg',
        email: 'dev@umber.fr',
        password: 'umber' + new Date().getFullYear()
      });

      for (let i = 0; 5 > i; i++) {
        let seller = new User({
          role: 'user',
          companyName: 'companyName' + i,
          userTypes: 'seller',
          fullname: 'seller' + i,
          // picture: 'https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg',
          email: 'seller' + i + '@user.fr',
          password: 'seller' + i + new Date().getFullYear()
        });
        let buyer = new User({
          role: 'user',
          userTypes: 'buyer',
          fullname: 'buyer' + i,
          // picture: 'https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg',sellet
          email: 'buyer' + i + '@user.fr',
          password: 'buyer' + i + new Date().getFullYear()
        });

        p.push(seller.save());
        p.push(buyer.save());
      }

      p.push(user.save());
      return Promise.all(p);
    }
  })
  .then(function () {
    console.log('finished populating user');
    return Taxonomy.find().lean();
  }).then(function (taxonomies) {
    if (taxonomies.length) return;
    let taxos = [
      { type: 'category', name: 'Dessert' },
      { type: 'category', name: 'Poisson'},
      { type: 'category', name: 'Légume' },
      { type: 'category', name: 'Viande' }
    ];
    let p = [];
    _.each(taxos, function (t) {
      let taxo = new Taxonomy(t);
      p.push(taxo.save());
    });

    return Promise.all(p);
  })
  .then(function () {
    console.log('finished populating taxonomies');
    return Product.find().lean();
  }).then(function (products) {
  if (products.length) return;
  let array = [
    { name: 'Pommes de terre', price: 1, description: 'Pommes de terre bio' },
    { name: 'Toamtes', price: 1, description: 'Pommes de terre bio'  },
    { name: 'Fraises', price: 2, description: 'Fraises bio'  },
    { name: 'Aubergines', price: 2, description: 'Aubergines bio' }
  ];
  let p = [];
  _.each(array, function (t) {
    let array = new Product(t);
    p.push(array.save());
  });

  return Promise.all(p);
  })
  .then(function() {
    console.log('finished populating product');
    return Cart.find();
  })
  .then(function(carts) {
    var p = [];
    _.each(carts, function(c) {
      if (c.documents.receipt && !Array.isArray(c.documents.receipt)) {
        c.documents.receipt = [c.documents.receipt];
      }
      if (!c.items || !c.items.length) {
        c.items = [{
          amount: c.price.amount,
          vat: c.price.vat,
          currency: c.price.currency,
          description: c.description
        }];
      }
      c.remind = c.remind || 0;
      c.sharedAt = c.sharedAt || new Date();
      p.push(c.save());
    });
    return Promise.all(p);
  }).then(function () {
    console.log('finished populating seed');
  })
  .catch(function (err) {
    console.error(err);
  });

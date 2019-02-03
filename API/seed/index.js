/**
 * FIXTURE
 * Populate DB with sample data on server start
 * to disable, edit config.js, and set `seedDB: false`
 */

'use strict';

const User = require('../../API/models/Users');
const Taxonomy = require('../../API/models/taxonomy.model');
const Cart = require('../../API/models/cart.model');
const Product = require('../../API/models/product.model');
const _ = require('lodash');


User
  .find()
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
          picture: 'http://placekitten.com/200/300',
          email: 'seller' + i + '@user.fr',
          password: 'seller' + i + new Date().getFullYear()
        });
        let buyer = new User({
          role: 'user',
          userTypes: 'buyer',
          fullname: 'buyer' + i,
          picture: 'http://placekitten.com/200/300',
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
      { type: 'shop', name: 'Boucherie' },
      { type: 'shop', name: 'Boulangerie'},
      { type: 'shop', name: 'Marécher' },
      { type: 'shop', name: 'Superette' },
      { type: 'product', name: 'Dessert' },
      { type: 'product', name: 'Poisson'},
      { type: 'product', name: 'Légume' },
      { type: 'product', name: 'Viande' }
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
    { name: 'Pommes de terre', price: 1, stock: 15, promotion: 0.75, quantity: 10, description: 'Pommes de terre bio' },
    { name: 'Toamtes', price: 1, stock: 15, promotion: 0.75, quantity: 60, description: 'Pommes de terre bio'  },
    { name: 'Fraises', price: 2, stock: 15, promotion: 1, quantity: 90, description: 'Fraises bio'  },
    { name: 'Aubergines', price: 2, stock: 15, promotion: 1, quantity: 5, description: 'Aubergines bio' }
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
    console.log('finished populating seed');
  })
  .catch(function (err) {
    console.error(err);
  });

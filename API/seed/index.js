/**
 * Populate DB with sample data on server start
 * to disable, edit config.js, and set `seedDB: false`
 */

'use strict';

const User = require('../../API/models/Users');
const Taxonomy = require('../../API/models/taxonomy.model');
const _ = require('lodash');


User
  .find({role: 'admin'})
  .then(function (users) {
    if (!users || !users.length) {
       return User.create({
         role: 'admin',
         username: 'umber',
         fullname: 'umber',
         picture: 'https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg',
         email: 'dev@umber.fr',
         password: 'umber' + new Date().getFullYear()
       });
    }
    return Promise.resolve(true);
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
  }).then(function () {
    console.log('finished populating seed');
  })
  .catch(function (err) {
    console.error(err);
  });

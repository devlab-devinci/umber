'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  version: '/v1',

  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  baseUrl: '',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: ''
  },

  // List of user roles
  userTypes: [
    { value: 'seller', name: 'Vendeur' },
    { value: 'buyer', name: 'Acheteur' }
  ],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

};

all.uploadExpressPath = '/upload';
all.credentialsDir = path.join(all.root, '.credentials');
all.uploadDir = path.join(all.root, 'upload');
all.tempUploadDir = path.join(all.root, '.tmp-uploads');
all.componentsDir = path.join(all.root, 'API/components/');


// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});

// create upload directories or do nothing if they already exists
fs.mkdir(module.exports.uploadDir, function () {});
fs.mkdir(module.exports.tempUploadDir, function () {});
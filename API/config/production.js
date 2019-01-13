'use strict';

module.exports = {
  project: 'umber',
  app: {
    host: '',
    port: ''
  },
  server: {
    port: '',
    mongo: {
      name: '',
      hostname: '',
      options: {
        useCreateIndex: true,
        useNewUrlParser: true
      }
    }
  },
  upload: {
    path: './upload'
  },
  userTypes: [
    { value: 'seller', name: 'Vendeur' },
    { value: 'buyer', name: 'Acheteur' }
  ],
  stripe: {
    publishedKey: '',
    secretedKey: ''
  }
};

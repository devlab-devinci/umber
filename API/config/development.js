'use strict';

module.exports = {
  version: '/v1',
  project: 'umber-dev',
  app: {
    host: 'https://localhost',
    port: 3000
  },
  server: {
    port: 9000,
    mongo: {
      uri: 'mongodb://localhost/umber',
      name: 'umber-dev',
      hostname:"127.0.0.1",
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
  seedDB: true,
  stripe: {
    publishedKey: 'pk_test_6ZpKQpaVmIRGuROtwHcAPa8Q',
    secretedKey: 'sk_test_qKcwgoTlLMcE72AFDfVcWNve'
  }
};

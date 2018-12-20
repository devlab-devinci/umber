module.exports = {
  version: '/v1',
  app: {
    host: 'https://localhost',
    port: 3000
  },
  server: {
    port: 9000,
    mongo: {
      uri: 'mongodb://localhost/umber',
      options: {
        useNewUrlParser: true
      }
    }
  },
  upload: {
    path: '/public/upload'
  },
  userTypes: [
    { value: 'seller', name: 'Vendeur' },
    { value: 'buyer', name: 'Acheteur' }
  ],
  seedDB: true
};

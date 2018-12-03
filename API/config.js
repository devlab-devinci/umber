module.exports = {
  app: {
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
  }
};

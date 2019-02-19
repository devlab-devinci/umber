'use strict';

// Create a new customer and then a new charge for that customer:
stripe.customers.create({
  email: 'foo-customer@example.com'
}).then((customer) => {
  return stripe.customers.createSource(customer.id, {
    source: 'tok_visa'
  });
}).then((source) => {
  return stripe.charges.create({
    amount: 1600,
    currency: 'usd',
    customer: source.customer
  });
}).then((charge) => {
  // New charge created on a new customer
}).catch((err) => {
  // Deal with an error
});
var express = require('express');
var router = express.Router();
const stripe = require('../config/Stripe');
const Stripe = require("stripe")(stripe.secret_key);

const axios = require('axios');

const api_config = require('../config/api_config');

/* Payment */
router.get('/umber/payment/:fb_access_token/:user_id', function (req, res, next) {
    let user_fb_access_token = req.params.fb_access_token;
    let user_id = req.params.user_id;
    axios
        .get(`https://graph.facebook.com/me?access_token=${user_fb_access_token}`)
        .then(function (response) {
            let fb_user_data = response.data; // cotain name + id fb

            axios.get(`${api_config.api_url}/api/v1/payment/cart/${user_id}/${fb_user_data.name}`)
                .then(function (response) {
                    // todo -> call api pour avoir l'user last cart active
                    //TODO -> total_bill (apply format si besoin)
                    //todo -> get reference (for description)
                    //decode fb token -> get last active card from this user
                    // take data like price etc and set in checkout
                    res.render('index', {
                        title: 'Payer votre commande en toute sécurité',
                        publish_key: stripe.publish_key,
                        cart: response.data.data,
                        success_redirect_URL: `${api_config.payment_server_url}charge/${user_id}/${fb_user_data.name}/${user_fb_access_token}`
                    })
                })
                .catch(function (err) {
                    res.render('error', {message: err});
                })
        })
        .catch(function (err) {
            res.render('error', {message: err});
        })


});

router.post('/umber/payment/charge/:user_id/:user_name_fb/:user_fb_access_token', function (req, res, next) {

    let fb_user_name = req.params.user_name_fb;
    let user_id = req.params.user_id;
    let fb_user_access_token = req.params.user_fb_access_token;

    let headers = {
        'fb-access-token': fb_user_access_token
    };

    axios.get(`${api_config.api_url}/api/v1/payment/cart/${user_id}/${fb_user_name}`)
        .then(function (response) {
            let cart = response.data.data;

            Stripe.customers.create({
                email: req.body.stripeEmail
            }).then((customer) => {
                return Stripe.customers.createSource(customer.id, {
                    source: 'tok_visa'
                });
            }).then((source) => {
                return Stripe.charges.create({
                    amount: cart.total_bill * 100,
                    currency: 'eur',
                    customer: source.customer
                });
            }).then((charge) => {
                axios.get(`${api_config.api_url}/api/v1/payment/cart/${user_id}/${fb_user_name}`)
                    .then(function (response) {
                        let cart = response.data.data;
                        let body = {}; // for post

                        // definie possibilities of stoes _id
                        let store_ids = [];
                        for (let i in cart.products) {
                            store_ids.push(cart.products[i].store)
                        }
                        let store_id_possibilities = [...new Set(store_ids)];

                        // attribute to the right store, his products
                        let storesSorted = {};
                        store_id_possibilities.forEach(function (_id) {
                            storesSorted[_id] = cart.products.filter(function (product) {
                                if (_id === product.store) {
                                    return product;
                                }
                            });
                            //todo -> ajuster le calcul avec la quantité et la remise ..
                            // todo -> ajuster aussi avec la remise sur Cart.vue
                            let quantity_product = storesSorted[_id].length;

                            if (quantity_product > 1) {
                                storesSorted[_id].total_for_store = storesSorted[_id].reduce((a, b) => (a.price + b.price - storesSorted[_id][0].promotion) * quantity_product)
                            } else {
                                storesSorted[_id].total_for_store = storesSorted[_id][0].price - storesSorted[_id][0].promotion
                            }
                        });


                        //console.log("Possibility stores_id:", store_id_possibilities);
                        console.log("stores with their products : ", storesSorted);


                        //todo -> dans le cart recuperer chaque produits
                        res.json("wip")
                    })
                    .catch(function (err) {
                        res.render('error', {message: err});
                    })
                //Story
                // user payment successfull
                // pour chaque products stock -1
                // add la command en tant paid
                // New charge created on a new customer
                // todo -> add command.model puis save une ici (update stock -1 pour chaque product)
                // PUIS
                // TODO -> template success
                //res.json(charge);
            }).catch((err) => {
                res.render('error', {message: err})
            });
        })
        .catch(function (err) {
            res.render('error', {message: err});
        });
});


module.exports = router;

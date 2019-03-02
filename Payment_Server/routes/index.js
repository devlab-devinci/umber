var express = require('express');
var router = express.Router();
const stripe = require('../config/Stripe');
const Stripe = require("stripe")(stripe.secret_key);
const mongoose = require('mongoose');

const axios = require('axios');

const api_config = require('../config/api_config');

const qrGenerator = require('@sylvainneung/qr-code-generator');
const uuidv4 = require('uuid/v4');

const path = require('path');

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
    let payload = {
        cart: "",
        user: "",
        source: "",
        charge: ""
    };

    let self = this;
    axios.get(`${api_config.api_url}/api/v1/payment/cart/${user_id}/${fb_user_name}`)
        .then(function (response) {
            payload.cart = response.data.data;
            payload.user = response.data.current_user;
            Stripe.customers.create({
                email: req.body.stripeEmail
            }).then((customer) => {
                return Stripe.customers.createSource(customer.id, {
                    source: 'tok_visa'
                });
            }).then((source) => {
                payload.source = source;
                console.log("PAY", payload)
                return Stripe.charges.create({
                    amount: payload.cart.total_bill * 100,
                    currency: 'eur',
                    customer: payload.source.customer
                });
            }).then((charge) => {

                console.log("payload", payload)
                payload.charge = charge;

                let body = {};

                // definie possibilities of stoes _id
                let store_ids = [];
                for (let i in payload.cart.products) {
                    store_ids.push(payload.cart.products[i].store)
                }
                let store_id_possibilities = [...new Set(store_ids)];

                // attribute to the right store, his products
                let storesSorted = {};
                store_id_possibilities.forEach(function (_id) {
                    storesSorted[_id] = payload.cart.products.filter(function (product) {
                        if (_id === product.store) {
                            return product;
                        }
                    });

                    let quantity_product = storesSorted[_id].length;

                    if (quantity_product > 1) {
                        storesSorted[_id].total_for_store = storesSorted[_id].reduce((a, b) => (a.price + b.price - storesSorted[_id][0].promotion) * quantity_product)
                    } else {
                        storesSorted[_id].total_for_store = storesSorted[_id][0].price - storesSorted[_id][0].promotion
                    }

                    console.log("end sorted promo done ?")
                    //console.log(storesSorted);
                });

                body.store_id = store_id_possibilities[0]; //ALERT ----> on traite qu'un panier par un finalement
                body.products = payload.cart.products.map(product => mongoose.Types.ObjectId(product._id)); // array of objectId product
                body.buyer = payload.user._id;
                body.createdAt = new Date();
                body.amount_cart = parseFloat(Math.round(payload.charge.amount) / 100).toFixed(2);
                body.email_facturation = payload.user.email;
                body.last4 = payload.source.last4;
                body.card_brand = payload.source.brand;
                body.currency = payload.charge.currency;
                body.stripe_customer = payload.source.customer;
                body.stripe_fingerprint = payload.source.fingerprint;
                body.balance_transaction = payload.charge.balance_transaction;
                body.exp_month = payload.source.exp_month;
                body.exp_year = payload.source.exp_year;
                body.refund_url = payload.charge.refunds.url;
                body.country = payload.source.country;
                body.reference = uuidv4();
                body.status = 'prepare';
                body.identifier = Math.random().toString(36).substring(7);
                body.buyer_quick_access = payload.user._id;

                qrGenerator
                    .generateQrImageAsync(body.identifier, body.reference, "png")
                    .then(function (response) {
                        console.log("response : ", response)
                        if (response.error === null) {
                            let picFileName = path.parse(response.pic_path).base;
                            body.qr_code = picFileName;
                            axios
                                .post(`${api_config.api_url}/api/v1/commands`, body, {headers: headers})
                                .then(function (response) {
                                    console.log("DATA ---- ", response.data);
                                    if (response.status !== 200) {
                                        res.render('error', {message: response.error})
                                    } else {
                                        //TODO API route for update quantity
                                        //TODO api route to list command with QR code for user
                                        //TODO api route to list command for commercant (voir pour un refund)
                                        axios
                                            .post(`${api_config.api_url}/api/v1/products/ajusted`, body, {headers: headers})
                                            .then(function (response) {
                                                console.log("AJUSTED RESPONSE",response);
                                                if(response.status !== 200){
                                                    res.render('error', {message: "Une erreur interne est survenue veuillez réessayer plus tard"});
                                                } else {

                                                    res.render('success', {message: 'Votre paiment à bien été pris en compte, vous pouvez vous rendre dans vos commandes / historiques pour suivre l\'état de votre commande'});
                                                }
                                            })
                                            .catch(err => res.render('error', {message: err.message}));
                                    }

                                })
                                .catch(err => res.render('error', {message: "Une erreur est survenue, veuillez rééessayer plus tard"}))
                        } else {
                            res.render('error', {message: "Une erreur interne est survenue veuillez réessayer plus tard"});
                        }

                    })
                    .catch(err => res.render('error', {message: "Une erreur est survenue, veuillez rééessayer plus tard"}));

                /*
                ** TEST **
                console.log("READY - TO - FORMAT - BODY FOR COMMAND ADD");
                console.log("USER,", payload.user)
                console.log("CHARGE,", payload.charge);
                console.log("SOURCE,", payload.source);
                console.log("SORTED", storesSorted)
                console.log("----- BODY ----")
                console.log(body);
                console.log("----- BODY ----")
                */
                //res.json("ok")
            }).catch((err) => {
                res.render('error', {message: err})
            });
        })
        .catch(function (err) {
            res.render('error', {message: err});
        });
});


module.exports = router;

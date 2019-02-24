var express = require('express');
var router = express.Router();
const stripe = require('../config/Stripe');
const axios = require('axios');

const api_config = require('../config/api_config');

/* Payment */
router.get('/umber/payment/:fb_access_token/:user_id', function (req, res, next) {
    let user_fb_access_token = req.params.fb_access_token;
    let user_id = req.params.user_id;

    axios
        .get(`https://graph.facebook.com/me?access_token=${user_fb_access_token}`)
        .then(function (response) {
            console.log(response.data);
            let fb_user_data = response.data; // cotain username + id fb

            axios.get(`${api_config.api_url}/api/v1/payment/cart/${user_id}/${fb_user_data.username}`)
                .then(function (cart) {
                    console.log(cart);
                    // todo -> call api pour avoir l'user last cart active
                    //TODO -> total_bill (apply format si besoin)
                    //todo -> get reference (for description)
                    //decode fb token -> get last active card from this user
                    // take data like price etc and set in checkout
                    /*
                        res
                            .render('index', {title: 'Payer votre commande en toute sécurité', publish_key: stripe.publish_key});
                    */
                })
                .catch(function (err) {
                    res.render('error', {message: err});
                })
        })
        .catch(function (err) {
            res.render('error', {message: err});
        })


});


// TODO -> verif que l'user a un panier en cours sinon on 404  (middleware pour ça)
// TODO -> envoyer les infos du panyer dans la vue (via GET params faire une vérif evidement )
//  TODO -> API display commands
// todo -> commercant peut voir ses commandes en cours / QR codes etc

module.exports = router;

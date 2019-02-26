'use strict';


/**
 * for macos use, YOU MUST FORWARD api with serveo and set the url given in this config
 * https://serveo.net/
 *
 * OR
 *
 *
 * execute in your shell :
 * ssh -R 80:localhost:yourAPIportHere serveo.net
 * @type {{api_url: string}}
 */

// or npm i ngrok -g
// ngrok http [api_port_here_3000_default]
const api_config = {
    api_url: 'https://706503f0.ngrok.io', //e.g https://multo.serveo.net,
    payment_server_url: 'https://73ccba69.ngrok.io/umber/payment/' // jwt_token en param à la fin
};
module.exports = api_config;
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
export const api_config = {
        api_url: 'https://secutus.serveo.net', //e.g https://multo.serveo.net,
        payment_server_url: 'https://multo.serveo.net'
};
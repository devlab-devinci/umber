'use strict';

const fb_api = {
    "token_verify_url": "https://graph.facebook.com/me?access_token", //set token as parameter to be verify

    /**
     * @return {string}
     */
    getVerifyAccessTokenUrl: function (token_verifiy_url, accessToken) {
        return `${token_verifiy_url}=${accessToken}`;
    },

    errorTokenAction: function (res, errorFb) {
        if (process.env.NODE_ENV === 'development') {
            res
                .status(403)
                .json({"code": 403, "data": errorFb, "error": true,})
        } else {
            delete errorFb.fbtrace_id; //remove for prod (keep for dev debug)
            delete errorFb.code;
            res
                .status(403)
                .json({"code": 403, "data": errorFb, "error": true,})
        }
    }
};


module.exports.fb_api = fb_api;
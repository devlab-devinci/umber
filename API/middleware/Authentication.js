'use strict';

const fbConfig = require('../config/facebook_api');
const fetch = require('node-fetch');

module.exports = {
    authChecker: function (req, res, next) {
        let token = req.headers['fb-access-token'];
        if (!token) {
            res
                .status(403)
                .json(
                    {
                        "error": true,
                        "data": "bad token provided",
                        "message": "UNAUTHORIZED",
                        "code_status": 403
                    })
        } else {
            const verifyUrl = fbConfig.fb_api.getVerifyAccessTokenUrl(fbConfig.fb_api.token_verify_url, token)
            fetch(verifyUrl)
                .then(res => res.json())
                .then(fbData => {
                    if (fbData.error) {
                        //callback error
                        fbConfig.fb_api.errorTokenAction(res, fbData.error)
                    } else {
                        // TODO => voir pour l'attribution des roles dans l'objet de fb voir pour ca
                        req.current_user = fbData; //set infos to logged user from fb account (accessible on each routes via req.current_user)
                        next(); // go to next middleware
                    }
                });

        }
    },

    /**
     * take role in parameter from user and compare with req.current_user data
     * @param role
     * @returns {Function}
     */
    allowRole: function (role) {
        return function (req, res, next) {
            if (role) {
                if (role === req.headers['role']) { //STATUS_VENDOR or STATUS_CUSTOMER send in header from application request
                    next();
                } else if ('*') {
                    next();
                } else {
                    res
                        .status(403)
                        .json(
                            {
                                "error": true,
                                "data": "Access denied",
                                "message": "UNAUTHORIZED",
                                "code_status": 403
                            })
                }
            } else {
                res
                    .status(403)
                    .json(
                        {
                            "error": true,
                            "data": "Access denied",
                            "message": "UNAUTHORIZED",
                            "code_status": 403
                        })
            }
        }
    }
};
'use strict';

const fetch = require("node-fetch");
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

module.exports = {
    authChecker: function (req, res, next) {
        //TODO WIP for role
        let token = req.headers['access_token'] || req.params.access_token;
        if (!token) {
            res
                .status(403)
                .json(
                    {
                        "data": "bad token provided",
                        "message": "UNAUTHORIZED",
                        "dev_message": "If you are developper, please check into facebook developper your app -> tools -> get acess_token",
                        "code_status": 403
                    })
        } else {
            fetch(`https://graph.facebook.com/me?access_token=${token}`)
                .then(res => res.json())
                .then(body => {
                    if (body.error) {
                        res
                            .status(403)
                            .json({
                                "data": body.error.message,
                                "type": body.error.type
                            })
                    } else {
                        req.current_user = {
                            username: body.name,
                            id: body.id
                        };

                        next();
                    }
                });
        }
    },

    //TODO -> use scope or ajouter role dans un jwt pour ici et creer des role hardcodé dans un fichier genre security.js pour qu'on sache
    hasRole: function (role) {
        return function (req, res, next) {
            if (role) {
                if (role === "API_USER") {
                    next();
                } else {
                    res
                        .status(403)
                        .json(
                            {
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
                            "data": "Access denied",
                            "message": "UNAUTHORIZED",
                            "code_status": 403
                        })
            }
        }
    }
};
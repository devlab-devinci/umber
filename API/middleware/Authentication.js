'use strict';


module.exports = {
    authChecker: function (req, res, next) {
        let token = req.headers['x-access-token']; // TODO (fb token) or JWT (mais si JWT on doit ajouter jwt.verify en pour la gestion d'erreur
        if (!token) {
            res
                .status(403)
                .json(
                    {
                        "data": "bad token provided",
                        "message": "UNAUTHORIZED",
                        "code_status": 403
                    })
        } else {
            next();
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
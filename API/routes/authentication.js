'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/Users');
const Authentication = require('../middleware/Authentication');


//todo -> call this method in application side (when successfully with fb + add loader)
/**
 * Find user and login OR create user and login
 */
router.post('/login/fb', function (req, res, next) {
    let user_email = req.body.email;
    User
        .findOne({email: user_email})
        .then(function (data, err) {
            if (err) {
                console.log("API ->", err);
                res.status(400).json({error: true, data: err})
            } else {
                if (data) {
                    //user already created.
                    res.status(200).json({error: false, data: data, message: "connected with success"})
                } else {
                    //Create new user -> login
                    let user_fullname = req.body.fullname;
                    let user_picture = req.body.picture;

                    let newUser = new User({
                        fullname: user_fullname,
                        email: user_email,
                        picture: user_picture,
                        createdAt: Date.now()
                    });
                    newUser.save(function (err) {
                        if (err) {
                            console.log("ERROR API", err)
                            res.status(400).json({error: true, data: err})
                        } else {
                            res.status(200).json({error: false, message: "user created with success"})
                        }
                    })
                }
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).json("error to do")
        })
});

router.post('/current_user/role', Authentication.authChecker, Authentication.allowRole('*'), function (req, res, next) {
    let payload = req.body;
    req.current_user.role = payload.role;
    res.status(200).json({error: false, message: "role setted with success", current_user: req.current_user})

});

module.exports = router;




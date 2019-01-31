const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/Authentication');

/* GET users listing. */
router.get('/user', Authentication.authChecker ,function (req, res, next) {
    console.log("current", req.current_user)
    res.send('respond with a resource');
});

module.exports = router;



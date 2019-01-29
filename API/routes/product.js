'use strict';

const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');

router.post('/product', function (req, res, next) {
    let payload = req.body;

    res.json("TODO")
});


module.exports = router;


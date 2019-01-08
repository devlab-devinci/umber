'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/document.controller');

router.post('/', controller.create);

module.exports = router;
'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/document.controller');

router.get('/:name', controller.show);
router.post('/', controller.create);

module.exports = router;
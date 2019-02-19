'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');

router.get('/', controller.index);
router.get('/:id', controller.show);
/*router.get('/me', controller.me);

router.post('/', controller.create);
router.post('/register', controller.register);
router.post('/lost-password', controller.lostPassword);
router.post('/reset-password', controller.resetPassword);
router.post('/verify/token', controller.verifyToken);

router.put('/:id', controller.update);
router.put('/:id/password', controller.changePassword);

router.delete('/:id', controller.destroy);*/

module.exports = router;

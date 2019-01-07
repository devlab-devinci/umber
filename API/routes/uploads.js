const express = require('express');
const router = express.Router();

const Uploader = require('../components/uploads');

const uploader = new Uploader();

router.post('/', uploader.startUpload);

module.exports = router;
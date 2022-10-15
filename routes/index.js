const express = require('express');
const router = express.Router();
const soundboard = require('../lib/soundboard');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {soundData: soundboard.getSoundData()});
});

module.exports = router;

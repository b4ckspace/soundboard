var express = require('express');
var router = express.Router();
var soundboard = require('../lib/soundboard');

router.get('/sounds', function (req, res, next) {
	res.send(soundboard.getSoundData());
});

router.post('/play', function (req, res, next) {
	res.send(soundboard.play(req.body.group, req.body.sound));
});

router.post('/stop', function (req, res, next) {
	res.send(soundboard.stop());
});

module.exports = router;

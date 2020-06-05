const express = require('express');
const router = express.Router();
const soundboard = require('../lib/soundboard');

const themes = ["cerulean", "cosmos", "cyborg", "darkly", "flatly", "journal", "litera", "lumen", "lux", "materia", "minty", "pulse", "sandstone", "simplex", "sketchy", "slate", "solar", "spacelab", "superhero", "united", "yeti"];
const styles = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];

function getTheme(themeName) {
	if(!themeName) {
		themeName = themes[Math.floor(Math.random() * themes.length)];
	}
	let theme;
	if (/\.css$/.test(themeName)) {
		theme = `/css/themes/${themeName}`;
	} else {
		theme = `https://bootswatch.com/4/${themeName}/bootstrap.min.css`;
	}
	return theme;
}

/* GET home page. */
router.get('/', function (req, res, next) {
	let themeName;
	if (req.query.theme) {
		themeName = req.query.theme
	}

	let theme = getTheme(themeName);

	res.render('index', {
		theme: theme,
		soundData: soundboard.getSoundData(),
		styles
	});
});

module.exports = router;

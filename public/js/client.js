$(document).ready(function ($) {
	"use strict";
	var baseUrl = '/api/';
	var soundUrl = baseUrl + 'sounds';
	var playUrl = baseUrl + 'play';
	var stopUrl = baseUrl + 'stop';
	var autoStop = false;
	var autoStopClass = 'STOPPPP';
	var autoStopInterval = null;
	var sounds = null;

	fetch(soundUrl).then(function (response) {
		$('.soundbutton').on('click', function () {
			var params = {
				group: $(this).attr('data-group'),
				sound: $(this).attr('data-sound'),
			};

			fetch(playUrl, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(params)
			})
				.then((response) => response.text())
				.then(console.log)

		});
		$('.nav-tabs a:first').tab('show');
		$('.stop-button').on('click', function () {
			fetch(stopUrl, {method: 'POST',});
		});
		$('.auto-stop').on('click', function () {
			autoStop = !autoStop;

			if (autoStop) {
				document.body.classList.add(autoStopClass);
				autoStopInterval = setInterval(function () {
					fetch(stopUrl, {method: 'POST',});
				}, 100)
			}
			else {
				document.body.classList.remove(autoStopClass);
				if (autoStopInterval) {
					clearInterval(autoStopInterval);
					autoStopInterval = null;
				}
			}
		});
	});
});

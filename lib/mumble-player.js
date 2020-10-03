const mumble = require('mumble');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const config = {
	url: process.env.MUMBLE_URL || 'mumble://example.com',
	name: process.env.MUMBLE_USER || 'brett',
	interval: Number(process.env.MUMBLE_RECONNECT_INTERVAL) || 30000,
};

const options = {
	key: fs.readFileSync('./cert/key.pem'),
	cert: fs.readFileSync('./cert/cert.pem')
};

if (!global.mumblePlayer) {
	global.mumblePlayer = {
		queue: [],
		connection: null,
		ready: false,
		playing: false,
		ffmpegCommand: null,

		play: function (path) {
			if (!this.ready) {
				console.log('client not ready');
			}

			this.queue.push({path});
			if (!this.playing) {
				this.processQueue();
			}
		},

		processQueue() {
			if (this.queue.length > 0 && !this.playing) {
				this.playing = true;
				const item = this.queue.shift();
				const path = item.path;

				const additionalFilters = [
				]

				this.inputStream = this.connection.inputStream();
				this.inputStream.on('unpipe', () => {
					console.log('unpipe');
					this.finishItem();
				});

				this.ffmpegCommand = ffmpeg(path)
					.output(this.inputStream)
					.audioFilters([
						...additionalFilters,
						'volume=0.5',
					])
					.audioFrequency(48000)
					.audioChannels(1)
					.format('s16le')
					.on('error', (e) => {
						console.error(e);
					});
				this.ffmpegCommand.run();
			}
		},

		finishItem() {
			console.log('finished');
			this.playing = false;
			this.ffmpegCommand = null;
			if (this.queue.length > 0) {
				this.processQueue();
			}
		},

		stop: function () {
			if (this.playing) {
				console.log('stopping');
				this.ffmpegCommand.kill();
				this.inputStream.close();
				this.finishItem();
			}
		},

		connect: function () {
			mumble.connect(config.url, options, (error, connection) => {
				if (error) {
					throw new Error(error);
				}

				console.log('Connected');

				connection.authenticate(config.name);
				connection.on('initialized', () => {
					console.log('initialized');
					this.ready = true;
				});
				connection.on('disconnect', () => {
					console.log('connection closed');
					this.ready = false;
					this.connection = null;
				});
				this.connection = connection;
			});
		},

		init: function () {
			console.log('init mumble client');
			this.connect();

			if (config.interval) {
				setInterval(() => {
					if (!this.connection) {
						this.connect();
					}
				}, config.interval);
			}
		}
	};

	global.mumblePlayer.init();
}

module.exports = global.mumblePlayer;

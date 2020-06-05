const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const config = {
	file: process.env.SNAPCAST_FIFO || '/tmp/snapfifo',
};

if (!global.snapcastPlayer) {
	global.snapcastPlayer = {
		queue: [],
		playing: false,
		ffmpegCommand: null,

		play: function (path) {
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
				this.inputStream = fs.createWriteStream(config.file)

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
					.audioChannels(2)
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
	};
}

module.exports = global.snapcastPlayer;

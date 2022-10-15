const fs = require('fs');
let player;

const soundDir = './sounds/';

const playerName = process.env.PLAYER || 'snapcast';
switch (playerName) {
	case 'snapcast':
		player = require('./snapcast-player');
		break;
	case 'mumble':
		player = require('./mumble-player');
		break;
	default:
		console.error('player not found', playerName);
}

module.exports = {
	getSoundData() {
		let keys = fs.readdirSync(soundDir + '/');
		return keys
			.map((key) => {
				const sounds = fs
					.readdirSync(soundDir + '/' + key)
					.map((filename) => {
						return {
							filename: filename,
							name: filename.split('.').slice(0, -1).join('.'),
						}
					});

			return {
				name: key,
				sounds
			}
		});
	},

	play(groupName, soundName) {
		let soundData = this.getSoundData();

		let group;
		if (groupName === '_random_') {
			group = soundData[Math.floor(Math.random() * soundData.length)];
		} else {
			group = soundData.find(group => group.name === groupName);
		}
		if (!group) {
			let message = `group "${groupName}" not found`;
			console.error(message);
			return message;
		}

		let sound;
		if (soundName === '_random_') {
			sound = group.sounds[Math.floor(Math.random() * group.sounds.length)];
		} else {
			sound = group.sounds.find(sound => sound.name === soundName);
		}
		if (!sound) {
			let message = `sound "${soundName}" not found`;
			console.error(message);
			return message;
		}

		const path = `${soundDir}${group.name}/${sound.filename}`;
		player.play(path);
		return 'playing ' + path;
	},

	stop() {
		player.stop();
	},

	isPlaying() {
		return player.playing;
	},
};

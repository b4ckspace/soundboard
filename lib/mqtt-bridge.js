const soundboard = require('../lib/soundboard')
const mqtt = require('mqtt');

const config = {
	broker: process.env.MQTT_BROKER || 'mqtt://localhost',
	topic: process.env.MQTT_TOPIC || 'psa/sound',
	fallbackDir: process.env.MQTT_FALLBACK_DIR || 'space',
}

const mqttBridge = {
	client: null,
	connect: function () {
		this.client = mqtt.connect(config.broker);
		this.client.on('error', (err) => {
			console.error('error while connecting to mqtt broker: ', err);
		});
		this.client.on('connect', () => {
			console.log('mqtt connected')
			this.client.subscribe(config.topic, (err) => {
				console.error(err);
			});
		})
		this.client.on('message', (topic, message) => {
			console.log(`received message on mqtt topic ${topic}: ${message}`);
			const parts = message.toString().split('/');
			if (parts.length === 1) {
				parts.unshift(config.fallbackDir);
			}
			soundboard.play(...parts);
		})
	},
	init: function() {
		console.log('mqtt bridge init');
		this.connect();
	}
}

module.exports = mqttBridge;

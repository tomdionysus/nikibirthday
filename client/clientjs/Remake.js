const GameEngine = require('GameEngine')

class Remake extends GameEngine {
	constructor(options) {
		super(options)

		this.debug = true
		this.fullscreen = true

		this.addAsset('kobold.inner','/assets/KoboldVillageInner.png')
		this.addAsset('kobold.outer','/assets/KoboldVillageOuter.png')

		this.addAudio('adventure','/audio/115adventurousjourney.mp3','audio/mpeg')
	}

	mousedown() {
		if(!this.playing) {
			this.getAudio('adventure').play()
			this.playing = true
		} else {
			this.getAudio('adventure').stop()
			this.playing = false
		}
	}
}

module.exports = Remake
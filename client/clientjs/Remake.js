const GameEngine = require('GameEngine')
const Character = require('Character')

class Remake extends GameEngine {
	constructor(options) {
		super(options)

		this.debug = true
		this.fullscreen = true

		this.addAsset('kobold.inner','assets/KoboldVillageInner.png')
		this.addAsset('kobold.outer','assets/KoboldVillageOuter.png')

		this.addAsset('flikWalk','mobs/FlikWalk.png')
		this.addAsset('victorWalk','mobs/VictorWalk.png')

		this.addAudio('adventure','audio/130 even farther.mp3','audio/mpeg')

		this.addMob('flik', 'flikWalk', Character, { offsetX: 128, offsetY: 128, currentAnimation: { name: 'walkeast', frame: 0, loop: true, delay: 120 } })
		this.addMob('victor', 'victorWalk', Character, { offsetX: 156, offsetY: 128, currentAnimation: { name: 'walkeast', frame: 0, loop: true, delay: 120 } })
	}

	mousedown() {
		if(!this.playing) {
			this.getAudio('adventure').play()
			this.playing = true
			this.getMob('flik').animate()
			this.getMob('victor').animate()
		} else {
			this.getAudio('adventure').stop()
			this.playing = false
		}
	}

	run() {

	}
}

module.exports = Remake
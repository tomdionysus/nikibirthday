const GameEngine = require('GameEngine')
const Character = require('Character')

class Remake extends GameEngine {
	constructor(options) {
		super(options)

		this.debug = true
		this.fullscreen = true

		this.enableScroll = false
		this.enableZoom = false
		this.showHUD = false

		this.globalAlpha = 0

		this.addAsset('kobold.inner','assets/KoboldVillageInner.png')
		this.addAsset('kobold.outer','assets/KoboldVillageOuter.png')

		this.addAsset('flikWalk','mobs/FlikWalk.png')
		this.addAsset('victorWalk','mobs/VictorWalk.png')

		this.addAudio('adventure','audio/130 even farther.mp3','audio/mpeg')

		this.addMob('flik', 'flikWalk', Character, { offsetX: 128, offsetY: 128, tile: [1,3] })
		this.addMob('victor', 'victorWalk', Character, { offsetX: 1024, offsetY: 128, tile: [1,2] })
	}

	mousedown() {
		if(!this.playing) {
			this.getAudio('adventure').play()
			this.playing = true

			setTimeout(()=>{
				this.fadeIn(3000)
				this.getMob('flik').animate({ name: 'walkeast', frame: 0, loop: true, delay: 120, dx: 10, maxX: 512, stopTile: [1,0] })
				this.getMob('victor').animate({ name: 'walkwest', frame: 0, loop: true, delay: 120, dx: -10, minX: 600, stopTile: [1,0] })
			},1000)
		} else {
			this.getAudio('adventure').stop()
			this.playing = false
			this.fadeOut(2000)
		}
	}

	run() {

	}
}

module.exports = Remake
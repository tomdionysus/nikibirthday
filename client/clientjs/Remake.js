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

		this.scale = 1.5

		this.globalAlpha = 0

		this.addAsset('kobold.inner','assets/KoboldVillageInner.png')
		this.addAsset('kobold.outer','assets/KoboldVillageOuter.png')

		this.addAsset('flikWalk','mobs/FlikWalk.png')
		this.addAsset('victorWalk','mobs/VictorWalk.png')

		this.addAudio('adventure','audio/130 even farther.mp3','audio/mpeg')

		this.addMob('victor', 'victorWalk', Character, { offsetX: 128, offsetY: 128, tile: [1,3] })
		this.addMob('flik', 'flikWalk', Character, { offsetX: 1024, offsetY: 128, tile: [1,2] })
	}

	init(cb) {
		this.getMob('flik').offsetX = this.width-128
		this.getMob('flik').offsetY = (this.height/4*3)-48
		this.getMob('victor').offsetY = (this.height/4*3)-48
		this.charStopX = (this.width/2)-24
		cb()
	}

	mousedown() {
		if(!this.playing) {
			this.getAudio('adventure').play()
			this.playing = true

			setTimeout(()=>{
				this.fadeIn(3000)
				this.getMob('victor').animate({ name: 'walkeast', frame: 0, loop: true, delay: 120, dx: 10, maxX: this.charStopX-256, stopTile: [1,0] })
			},1000)
			setTimeout(()=>{
				this.getMob('flik').animate({ name: 'walkwest', frame: 0, loop: true, delay: 120, dx: -10, minX: this.charStopX+256, stopTile: [1,0] })
			},750)
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
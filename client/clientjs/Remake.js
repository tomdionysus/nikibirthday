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

		// Make us look suitably 8-bit
		this.scale = 1

		// Start faded out
		this.globalAlpha = 0

		// Bring in those cute Kobold's village
		this.addAsset('kobold.inner','./assets/KoboldVillageInner.png')
		this.addAsset('kobold.outer','./assets/KoboldVillageOuter.png')

		// And the boys, Flik and Victor
		this.addAsset('flikWalk','./mobs/FlikWalk.png')
		this.addAsset('victorWalk','./mobs/VictorWalk.png')

		// Upbeat world map music
		this.addAudio('adventure','./audio/130 even farther.mp3','audio/mpeg')
	}

	init(cb) {
		// Instantiate our characters
		this.addMob('victor', new Character({asset: this.getAsset('victorWalk'), offsetX: 128, offsetY: 128, tile: [1,3] }))
		this.addMob('flik', new Character({ asset: this.getAsset('flikWalk'), offsetX: 1024, offsetY: 128, tile: [1,2] }))

		// Start Victor and Flik 3/4 of the way down the screen from opposite ends of however wide we are
		this.getMob('flik').offsetX = this.width-128
		this.getMob('flik').offsetY = (this.height/4*3)-48
		this.getMob('victor').offsetY = (this.height/4*3)-48

		// Store the middle of the screen in x
		this.charStopX = (this.width/2)-24
		cb()
	}

	mousedown() {
		if(!this.playing) {
			// Play the tunes, fade them in
			this.getAudio('adventure').fadeIn(4500)
			this.playing = true

			// After 1.5 sec, cue Victor
			setTimeout(()=>{
				// Start the global fade in, 3 seconds
				this.fadeIn(3000)
				// Get him to walk 'east' until the middle minus 192px
				this.getMob('victor').animate({ name: 'walkeast', frame: 0, loop: true, delay: 120, dx: 10, maxX: this.charStopX-192, stopTile: [1,0] })
			},1500)
			// After 1.25 sec, cue Flik, cause he's slightly lazy
			setTimeout(()=>{
				// Get him to walk 'west' until the middle minus 192px
				this.getMob('flik').animate({ name: 'walkwest', frame: 0, loop: true, delay: 120, dx: -10, minX: this.charStopX+192, stopTile: [1,0], stopCallback: (mob)=>{
					setTimeout(()=>{
						mob.animate({ name: 'jump' })
					},1000)
				} })
			},1250)
		} else {
			this.getAudio('adventure').fadeOut(3000)
			this.playing = false
			this.fadeOut(3000)
		}
	}

	run() {

	}
}

module.exports = Remake
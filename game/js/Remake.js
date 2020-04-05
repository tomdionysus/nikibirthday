const GameEngine = require('GameEngine')
const Character = require('Character')
const Scene = require('Scene')
const Mob = require('Mob')

class Remake extends GameEngine {
	constructor(options) {
		super(options)

		// Fullscreen, for electron
		this.fullscreen = true

		// No scrolling, zooming or debug HUD
		this.enableScroll = false
		this.enableZoom = false
		this.showHUD = false

		// Start faded out
		this.globalAlpha = 0.1

		// Scale
		this.scale = 1

		// Bring in that cute Kobold village
		this.addAsset('kobold.inner','./assets/KoboldVillageInner.png')
		this.addAsset('kobold.outer','./assets/KoboldVillageOuter.png')

		// And the boys, Flik and Victor
		this.addAsset('flikWalk','./mobs/FlikWalk.png')
		this.addAsset('victorWalk','./mobs/VictorWalk.png')

		// Upbeat world map music
		this.addAudio('adventure','./audio/130 even farther.mp3','audio/mpeg')
	}

	init(callback) {
		this.main = this.addScene('main', new Scene({ asset: this.getAsset('kobold.outer') }))

		// Instantiate our characters
		this.victor = this.main.addMob('victor', new Character({ asset: this.getAsset('victorWalk'), offsetX: 128, offsetY: 128, tile: [1,3] }))
		this.flik = this.main.addMob('flik', new Character({ asset: this.getAsset('flikWalk'), offsetX: 1024, offsetY: 128, tile: [1,2] }))

		// Start Victor and Flik 3/4 of the way down the screen from opposite ends of however wide we are
		this.flik.offsetX = this.width-176
		this.flik.offsetY = (this.height/4*3)-48
		this.flik.indexZ = 0

		this.victor.offsetY = (this.height/4*3)-48
		this.victor.indexZ = 1

		// Store the middle of the screen in x
		this.charStopX = (this.width/2)-24

		callback()
	}

	mousedown() {
		if(!this.playing) {
			// Play the tunes, fade them in
			this.getAudio('adventure').fadeIn(4500)
			this.playing = true

			// Start the global fade in, 3 seconds
			this.fadeIn(3000)

			// After 1.5 sec, cue Victor
			setTimeout(()=>{
				// Get him to walk 'east' until the middle minus 192px
				this.victor.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 10, maxX: this.charStopX+192, stopTile: [1,0], onStop: (mob) => {
					setTimeout(()=>{
						// Jump three times (it's zero based) becase you're pleased to see us
						mob.animateStart({ name: 'jump', loop: 2, onStop: (mob)=>{
							// Stand there and blink occasionally
							mob.getMob('overlay').animateStart({ name: 'blinksouth', loop: true })
						}})
					},1000)
				}})
			},1500)

			// After 2 sec, cue Flik, cause he's slightly lazy
			setTimeout(()=>{
				// Get him to walk 'west' until the middle plus 192px
				this.flik.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -10, minX: this.charStopX-192, stopTile: [1,0], onStop: (mob)=>{
					// Stand there and blink occasionally
					mob.getMob('overlay').animateStart({ name: 'blinksouth', loop: true })
				}})
			},2000)
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
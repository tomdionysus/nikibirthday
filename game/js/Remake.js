const async = require('async')

const { GameEngine, BackgroundScene, Entity } = require('tenkai')
const Character = require('./Character')
const GrassScene = require('./GrassScene')

class Remake extends GameEngine {
	constructor(options) {
		super(options)

		// Fullscreen, for electron
		this.fullscreen = true

		// No scrolling, zooming or debug HUD
		this.enableScroll = false
		this.enableZoom = false
		this.showHUD = true

		// Start faded out
		this.globalAlpha = 1

		// Scale
		this.scale = 1

		// Bring in that cute Kobold village
		this.addAsset('kobold.inner','./assets/KoboldVillageInner.png')
		this.addAsset('kobold.outer','./assets/KoboldVillageOuter.png')

		this.addAsset('forestmountain','./backgrounds/forestmountain1.jpg')

		// And the boys, Flik and Victor
		this.addAsset('flikWalk','./mobs/FlikWalk.png')
		this.addAsset('victorWalk','./mobs/VictorWalk.png')

		// Upbeat world map music
		this.addAudio('adventure','./audio/130 even farther.mp3','audio/mpeg')
	}

	init(callback) {
		this.bg = this.addScene('bg', new BackgroundScene({ asset: this.getAsset('forestmountain'), z: 0, scale: 1.2 }))
		this.main = this.addScene('main', new GrassScene({ asset: this.getAsset('kobold.outer'), z: 1, y: this.height-256 }))

		// Instantiate our characters
		this.victor = this.main.addEntity('victor', new Character({ asset: this.getAsset('victorWalk'), x: 96, y: 32, z: 1, tile: [1,3] }))
		this.flik = this.main.addEntity('flik', new Character({ asset: this.getAsset('flikWalk'), x: 256, y: 80, z: 1, tile: [1,2] }))

		// Store the middle of the screen in x
		this.charStopX = (this.width/2)-24

		callback()
	}

	mousedown() {
		if(!this.playing) {
			// Play the tunes, fade them in
			this.getAudio('adventure').fadeIn(4500)
			this.playing = true

			// After 1.5 sec, cue Victor
			setTimeout(()=>{
				async.series([
					(cb)=>{ this.victor.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 10, maxX: 368, stopTile: [1,0], onStop: cb }) },
					(cb)=>{ this.victor.animateStart({ name: 'walksouth', loop: true, delay: 120, dy: 10, maxY: 128, stopTile: [1,0], onStop: cb }) },
					(cb)=>{ this.flik.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 10, maxX: 368, stopTile: [1,0], onStop: cb }) },
					(cb)=>{ this.victor.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -10, minX: 128, stopTile: [1,0], onStop: cb }) }
				])
			},1500)

			// After 2 sec, cue Flik, cause he's slightly lazy
			// setTimeout(()=>{
			// 	// Get him to walk 'west' until the middle plus 192px
			// 	this.flik.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -10, minX: this.charStopX, stopTile: [1,0], onStop: (err, mob)=>{
			// 		// Stand there and blink occasionally
			// 		// mob.animateStart({ name: 'floateast', loop: true })
			// 		mob.getMob('overlay').animateStart({ name: 'blinksouth', loop: true })
			// 	}})
			// },2000)
		} else {
			this.getAudio('adventure').fadeOut(3000)
			this.playing = false
		}
	}

	onResize() {
		this.main.y = this.height-256
		this.redraw()
	}
}

module.exports = Remake
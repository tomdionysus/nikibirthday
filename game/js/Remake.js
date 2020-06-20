const async = require('async')

const { GameEngine, BackgroundScene, Entity } = require('tenkai')
const Character = require('./Character')
const GrassScene = require('./GrassScene')
const Mask = require('./Mask')

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
		this.globalAlpha = 1

		// Scale
		this.scale = 1

		this.played = 0

		// Bring in that cute Kobold village
		this.addAsset('kobold.inner','./assets/KoboldVillageInner.png')
		this.addAsset('kobold.outer','./assets/KoboldVillageOuter.png')

		this.addAsset('forestmountain','./backgrounds/forestmountain1.jpg')

		// And the boys, Flik and Victor
		this.addAsset('flikWalk','./mobs/FlikWalk.png')
		this.addAsset('victorWalk','./mobs/VictorWalk.png')

		this.addAsset('appleWalk','./mobs/AppleWalk.png')
		this.addAsset('bolganWalk','./mobs/BolganWalk.png')
		this.addAsset('borisWalk','./mobs/BorisWalk.png')
		this.addAsset('chacoWalk','./mobs/ChacoWalk.png')
		this.addAsset('eilieWalk','./mobs/EilieWalk.png')
		this.addAsset('gengenWalk','./mobs/GengenWalk.png')
		this.addAsset('killeyWalk','./mobs/KilleyWalk.png')
		this.addAsset('nanamiWalk','./mobs/NanamiWalk.png')
		this.addAsset('pilikaWalk','./mobs/PilikaWalk.png')
		this.addAsset('richmondWalk','./mobs/RichmondWalk.png')
		this.addAsset('rikimaruWalk','./mobs/RikimaruWalk.png')
		this.addAsset('riouWalk','./mobs/RiouWalk.png')
		this.addAsset('templetonWalk','./mobs/TempletonWalk.png')

		this.addAsset('sign','./mobs/Sign.png')

		// Upbeat world map music
		this.addAudio('adventure','./audio/130 even farther.mp3','audio/mpeg')

		this.on('mousedown', this.onMouseDown.bind(this))
		this.on('resize', this.onResize.bind(this))
	}

	init(callback) {
		this.bg = this.addScene('bg', new BackgroundScene({ asset: this.getAsset('forestmountain'), z: 0, width: 704 }))
		this.main = this.addScene('main', new GrassScene({ asset: this.getAsset('kobold.outer'), z: 1, y: this.height-256 }))
		this.mask = this.addScene('mask', new Mask({ width: this.width, height: this.height, z: 2 }))

		// Instantiate our characters
		this.victor = this.main.addEntity('victor', new Character({ asset: this.getAsset('victorWalk'), x: -64, y: 64, z: 1, tile: [1,3] }))
		this.flik = this.main.addEntity('flik', new Character({ asset: this.getAsset('flikWalk'), x: 700, y: 64, z: 1, tile: [1,2] }))
		this.riou = this.main.addEntity('riou', new Character({ asset: this.getAsset('riouWalk'), x: 700, y: 64, z: 1, tile: [1,2] }))

		this.gengen = this.main.addEntity('gengen', new Character({ asset: this.getAsset('gengenWalk'), x: -64, y: 140, z: 1, tile: [1,2], hotspotY:0 }))

		this.apple = this.main.addEntity('apple', new Character({ asset: this.getAsset('appleWalk'), x: -64, y: 64, z: 1, tile: [1,2] }))
		this.boris = this.main.addEntity('boris', new Character({ asset: this.getAsset('borisWalk'), x: -72, y: 120, z: 1, tile: [1,2] }))
		this.chaco = this.main.addEntity('chaco', new Character({ asset: this.getAsset('chacoWalk'), x: -64, y: 32, z: 1, tile: [1,2] }))
		this.eilie = this.main.addEntity('eilie', new Character({ asset: this.getAsset('eilieWalk'), x: -64, y: 40, z: 1, tile: [1,2] }))

		this.bolgan = this.main.addEntity('bolgan', new Character({ asset: this.getAsset('bolganWalk'), x: -64, y: 96, z: 1, tile: [1,2] }))

		this.killey = this.main.addEntity('killey', new Character({ asset: this.getAsset('killeyWalk'), x: 700, y: 32, z: 1, tile: [1,2] }))
		this.nanami = this.main.addEntity('nanami', new Character({ asset: this.getAsset('nanamiWalk'), x: 700, y: 128, z: 1, tile: [1,2] }))
		this.pilika = this.main.addEntity('pilika', new Character({ asset: this.getAsset('pilikaWalk'), x: 700, y: 16, z: 1, tile: [1,2] }))
		this.richmond = this.main.addEntity('richmond', new Character({ asset: this.getAsset('richmondWalk'), x: 700, y: 128, z: 1, tile: [1,2] }))
		this.rikimaru = this.main.addEntity('rikimaru', new Character({ asset: this.getAsset('rikimaruWalk'), x: 700, y: 64, z: 1, tile: [1,2] }))
		this.templeton = this.main.addEntity('templeton', new Character({ asset: this.getAsset('templetonWalk'), x: 700, y: 64, z: 1, tile: [1,2] }))


		this.sign = this.bg.addEntity('sign', new Entity({ asset: this.getAsset('sign'), tileWidth:400, tileHeight: 150, x: 160, y: this.height, z: 1, tile: [0,0] }))

		// Store the middle of the screen in x
		this.charStopX = (this.width/2)-24

		callback()
	}

	onMouseDown() {
		if(this.played == 0) {
			// Play the tunes, fade them in
			this.getAudio('adventure').fadeIn(4500)

			this.played = 1

			var excitable = (char, cb) => {
				return ()=>{
					setInterval(()=>{ char.animateStart({ name: 'jump', loop: 2 }) },4000)
					cb()
				}
			}

			var zoomies = (char, cb) => {
				return ()=>{
					var zf = ()=>{ async.series([
						(cb)=>{ char.animateStart({ name: 'walkeast', loop: true, delay: 60, dx: 14, maxX: 620, stopTile: [1,0], onStop: cb }) },
						(cb)=>{ char.animateStart({ name: 'jump', loop: 2, onStop: cb }) },
						(cb)=>{ char.animateStart({ name: 'walkwest', loop: true, delay: 60, dx: -14, minX: 64, stopTile: [1,0], onStop: cb }) },
						(cb)=>{ char.animateStart({ name: 'jump', loop: 2, onStop: cb }) },
					],()=>{ setTimeout(zf, 10000) })}
					zf()
					cb()
				}
			}

			var blink = (mob, cb) => {
				return ()=>{
					mob.getEntity('overlay').animateStart({ name: 'blinksouth', loop: true })
					cb()
				}
			}

			var start = ()=>{
				async.parallel([
					(cb)=>{ this.apple.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 10, maxX: 92, stopTile: [1,0], onStop: cb }) },
					(cb)=>{ this.bolgan.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 6, maxX: 430, stopTile: [1,0], onStop: excitable(this.bolgan, cb)}) },
					(cb)=>{ this.boris.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 9, maxX: 340, stopTile: [1,0], onStop: cb }) },
					(cb)=>{ this.chaco.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 14, maxX: 212, stopTile: [1,0], onStop: excitable(this.chaco, cb)}) },
					(cb)=>{ this.eilie.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 10, maxX: 40, stopTile: [1,0], onStop: cb }) },
					(cb)=>{ this.gengen.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 30, maxX: 64, stopTile: [1,0], onStop: zoomies(this.gengen, cb) }) },

					(cb)=>{ this.killey.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -9, minX: 380, stopTile: [1,0], onStop: cb }) },
					(cb)=>{ this.nanami.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -10, minX: 164, stopTile: [1,0], onStop: excitable(this.nanami, cb)}) },
					(cb)=>{ this.pilika.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -13, minX: 156, stopTile: [1,0], onStop: zoomies(this.pilika, cb) }) },
					(cb)=>{ this.richmond.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -7, minX: 530, stopTile: [1,0], onStop: cb }) },
					(cb)=>{ this.rikimaru.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -10, minX: 520, stopTile: [1,0], onStop: cb }) },
					
					(cb)=>{ this.riou.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -10, minX: 300, stopTile: [1,0], onStop: blink(this.riou, cb) }) },
					(cb)=>{ this.victor.animateStart({ name: 'walkeast', loop: true, delay: 120, dx: 10, maxX: 240, stopTile: [1,0], onStop: blink(this.victor, cb) }) },
					(cb)=>{ this.flik.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -8, minX: 350, stopTile: [1,0], onStop: blink(this.flik, cb) }) },
					(cb)=>{ this.templeton.animateStart({ name: 'walkwest', loop: true, delay: 120, dx: -8,  minX: 580, stopTile: [1,0], onStop: cb }) },
				], ()=>{
					var fx = ()=>{
						this.sign.y = this.sign.y - 4
						this.sign.redraw()
						if(this.sign.y>128) {
							setTimeout(fx,4) 
						} else {
							this.played = 2
						}
					}
					fx()
				})
			}

			setTimeout(start,1000)
		}

		if(this.played == 2) {
			this.getAudio('adventure').fadeOut(4500)
		}
	}

	onResize() {
		this.main.y = this.height-256

		this.main.x = (this.width/2)-350
		this.bg.x = (this.width/2)-350
		this.mask.x = (this.width/2)-350

		this.sign.x = this.bg.x+160

		this.mask.height = this.height
		this.redraw()
	}
}

module.exports = Remake
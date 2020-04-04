const Mob = require('Mob')

class Character extends Mob {
	constructor(options = {}) {
		options = options || {}
		super(options)

		this.tileWidth = options.tileWidth || 48
		this.tileHeight = options.tileHeight || 96

		this.tile = options.tile || [1,3]
		this.offsetX = options.offsetX || 128
		this.offsetY = options.offsetY || 128

		// Main Character animations
		this.addAnimation('walknorth', [ [0,1],[1,1],[2,1],[1,1] ])
		this.addAnimation('walksouth', [ [0,0],[1,0],[2,0],[1,0] ])
		this.addAnimation('walkwest',[ [2,2],[1,2],[0,2],[1,2] ])
		this.addAnimation('walkeast', [ [2,3],[1,3],[0,3],[1,3] ])
		this.addAnimation('jump', [
			[ 1, 0, 50, 0, -10 ],
			[ 0, 0, 50, 0, -10 ],
			[ 0, 0, 50, 0, -10 ],
			[ 0, 0, 50, 0, 10 ],
			[ 0, 0, 50, 0, 10 ],
			[ 1, 0, 50, 0, 10 ],
		])

		// Overlay and animations
		var overlay = new Mob({ asset: this.asset, offsetX: 0, offsetY: 0, tile: null })
		overlay.addAnimation('blinksouth', [ [ 3, 0, 150 ], [ null, null, Math.round(4000+(Math.random()*2000)) ], ])
		overlay.addAnimation('blinkwest', [ [ 3, 2, 150 ], [ null, null, Math.round(4000+(Math.random()*2000)) ], ])
		overlay.addAnimation('blinkeast', [ [ 3, 3, 150 ], [ null, null, Math.round(4000+(Math.random()*2000)) ], ])
		this.addMob('overlay', overlay)
	}
}

module.exports = Character

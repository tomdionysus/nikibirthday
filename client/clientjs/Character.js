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
		this.animations = {
			'walknorth': [ [0,1],[1,1],[2,1],[1,1] ],
			'walksouth': [ [0,0],[1,0],[2,0],[1,0] ],
			'walkwest':  [ [2,2],[1,2],[0,2],[1,2] ],
			'walkeast':  [ [2,3],[1,3],[0,3],[1,3] ],
			'jump':  [
				[ 1, 0, 50, 0, -10 ],
				[ 0, 0, 50, 0, -10 ],
				[ 0, 0, 50, 0, -10 ],
				[ 0, 0, 50, 0, 10 ],
				[ 0, 0, 50, 0, 10 ],
				[ 1, 0, 50, 0, 10 ],
			]
		}

		// Overlay and animations
		var overlay = new Mob({ asset: this.asset, offsetX: 0, offsetY: 0, tile: null })
		overlay.animations = { 
			'blinksouth': [ [ 3, 0, 150 ], [ null, null, 6000 ], ],
			'blinkwest': [ [ 3, 2, 150 ], [ null, null, 6000 ], ],
			'blinkeast': [ [ 3, 3, 150 ], [ null, null, 6000 ], ],
		}
		this.addMob('overlay', overlay)
	}
}

module.exports = Character

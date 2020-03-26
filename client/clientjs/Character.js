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

		this.animations = {
			'walknorth': [ [0,1],[1,1],[2,1],[1,1] ],
			'walksouth': [ [0,0],[1,0],[2,0],[1,0] ],
			'walkwest':  [ [2,2],[1,2],[0,2],[1,2] ],
			'walkeast':  [ [2,3],[1,3],[0,3],[1,3] ],
		}
	}
}

module.exports = Character

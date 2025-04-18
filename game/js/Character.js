const { Entity } = require('tenkai')

/**
 *  Character is a Entity specialisation that demonstrates how to build Mobs for specific games, in this case the Suikoden II remake.
 */
class Character extends Entity {
	constructor(options = {}) {
		options = options || {}
		super(options)

		// The Mob assets for SII are 48x96 pixels
		this.tileWidth = options.tileWidth || 48
		this.tileHeight = options.tileHeight || 96

		// The default tile is facing south 
		this.tile = options.tile || [1,3]
		this.x = options.x || 0
		this.y = options.y || 0

		// 
		this.hotspotY = 64

		// Standard Character animations
		this.addAnimation('walknorth', [ [0,1,120],[1,1,120],[2,1,120],[1,1,120] ])
		this.addAnimation('walksouth', [ [0,0,120],[1,0,120],[2,0,120],[1,0,120] ])
		this.addAnimation('walkwest',  [ [2,2,120,null,2],[1,2,120,null,-2],[0,2,120,null,2],[1,2,120,null,-2] ])
		this.addAnimation('walkeast',  [ [2,3,120,null,2],[1,3,120,null,-2],[0,3,120,null,2],[1,3,120,null,-2] ])
		this.addAnimation('jump', [
			[ 1, 0, 50, 0, -10 ],
			[ 0, 0, 50, 0, -10 ],
			[ 0, 0, 50, 0, -10 ],
			[ 0, 0, 50, 0, 10 ],
			[ 0, 0, 50, 0, 10 ],
			[ 1, 0, 50, 0, 10 ],
		])

		var v = []; for(var i=0; i<Math.PI*2; i=i+Math.PI*2/32) { v.push([ 2, 3, 50, 0, Math.round(Math.cos(i)*3) ]) }
		this.addAnimation('floateast', v)

		// Overlay and animations (blinking, etc)
		var overlay = new Entity({ asset: this.asset, x: 0, y: 0, tile: null, tileWidth: 48, tileHeight: 96 })
		overlay.addAnimation('blinksouth', [ [ 3, 0, 150 ], [ null, null, Math.round(4000+(Math.random()*2000)) ], ])
		overlay.addAnimation('blinkwest', [ [ 3, 2, 150 ], [ null, null, Math.round(4000+(Math.random()*2000)) ], ])
		overlay.addAnimation('blinkeast', [ [ 3, 3, 150 ], [ null, null, Math.round(4000+(Math.random()*2000)) ], ])
		this.addEntity('overlay', overlay)
	}
}

module.exports = Character

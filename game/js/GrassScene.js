const { TiledScene, Entity } = require('tenkai')

class GrassScene extends TiledScene {
	constructor(options = {}) {
		super(options)

		this.perspectiveMode = TiledScene.PERSPECTIVE_ANGLE

		var m = [[]]
		var m2 = []
		for(var y=1; y<8; y++) {
			var r = [], r2 = []
			for (var x=0; x<20; x++) {
				r.push( [ 24+(Math.round(Math.random()*2)), Math.random()*2 ], [ 24+(Math.round(Math.random()*2)), Math.random()*2 ], [ 24+(Math.round(Math.random()*2)), Math.random()*2] )
			}
			m.push(r)
			m2.push(r2)
		}

		for(var x=0; x<40; x++) {
			m2[0][x*2] = [8,11]
			m2[0][(x*2)+1] = [9,11]
			m2[1][x*2] = [8,12]
			m2[1][(x*2)+1] = [9,12]
		}

		this.layers = options.layers || { 0: m, 1: m2 }

		// Props
		this.addEntity('barrel', new Entity({ asset: this.asset, tileWidth:64, tileHeight: 64, x: 320, y: 96, z: 1, tile: [9,1] }))
	}
}

module.exports = GrassScene
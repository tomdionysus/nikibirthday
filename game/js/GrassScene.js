const { TiledScene } = require('tenkai')

class GrassScene extends TiledScene {
	constructor(options = {}) {
		super(options)

		this.perspectiveMode = TiledScene.PERSPECTIVE_ANGLE

		var m = []
		var m2 = []
		for(var y=0; y<8; y++) {
			var r = [], r2 = []
			for (var x=0; x<20; x++) {
				r.push( [ 24+(Math.round(Math.random()*2)), Math.random()*2 ], [ 24+(Math.round(Math.random()*2)), Math.random()*2 ], [ 24+(Math.round(Math.random()*2)), Math.random()*2] )
				r2.push[ null, null, null, null ]
			}
			m.push(r)
			m2.push(r2)
		}

		m2[3][10] = [18,2]
		m2[3][11] = [19,2]
		m2[4][10] = [18,3]
		m2[4][11] = [19,3]

		this.layers = options.layers || { 0: m, 1: m2 }
	}
}

module.exports = GrassScene
const { Scene } = require('tenkai')

class Mask extends Scene {

	constructor(options) {
		super(options)

		// Width / Height, used by some classes as limits.
		this.width = options.width || 0
		this.height = options.height || 0
	}

	draw(context) {
		// If we're not marked for a redraw or we're invisible, return
		if(!this._doredraw || !this.visible) return

		// Save the context params
		context.save()

		// Reset the origin to our coordinates (so child entities are relative to us)
		context.translate(this.x, this.y)
		context.scale(this.scale, this.scale)
		context.rotate(this.rotate)

		// Scene Drawing Logic should go here.

		context.fillStyle = 'black'
		context.fillRect(700,0,700,this.height)
		context.fillRect(-100,0,100,this.height)

		// Restore the context params for the next thing being drawn
		context.restore()

		// Reset the redraw flag
		this._doredraw = false
	}
}

module.exports = Mask
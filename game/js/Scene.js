const HasMobsMixin = require('HasMobsMixin')

class Scene {
	constructor(options = {}) {
		options = options || {}

		HasMobsMixin(this)

		// Asset is the graphical asset used for drawing this scene.
		// Usually, an asset will be divided up into 'tiles' of a specified width and height. 
		// A scene will display a large array of these tiles for each layer, and a scene may contain multiple layers.
		// Layers are drawn in ascending order, and each layer be associated with a group of mobs, based on the mob's indexZ.
		this.asset = options.asset

		// The width and height of the tiles in the asset
		this.tileWidth = options.tileWidth
		this.tileHeight = options.tileHeight

		// The current offsetX/Y from the origin of the container (the GameEngine, or the parent Scene)
		this.offsetX = options.offsetX || 0
		this.offsetY = options.offsetY || 0

		// The Z index, in the stack of the container (the GameEngine, or the parent Scene)
		this.indexZ = options.indexZ || 0
		
		// The Parent container (the GameEngine, or the parent Scene)
		this.parent = typeof(options.parent)=='undefined' ? null : options.parent

		// The visible flag. Invisible Scenes and their children are not drawn
		this.visible = typeof(options.visible)=='undefined' ? true : !!options.visible

		// The scale and rotation settings for this scene. This context affects all child scenes and mobs also
		this.scale = typeof(options.scale)=='undefined' ? 1 : options.scale
		this.rotate = typeof(options.rotate)=='undefined' ? 0 : options.rotate

		this.tiles = options.tiles || []

		// Private props
		this._scenes = {}
		this._doredraw = true
	}

	redraw() {
		this._doredraw = true
	}

	draw(context) {
		// If we're not marked for a redraw or we're invisible, return
		if(!this._doredraw || !this.visible) return

		// Save the context params
		context.save()

		// Reset the origin to our coordinates (so child mobs are relative to us)
		context.translate(this.offsetX, this.offsetY)
		// Scale and rotate
		context.scale(this.scale, this.scale)
		context.rotate(this.rotate)

		// Ensure mob sort order
		if(!this._mobOrderMap) this.sortMobsZ()
		
		// Draw layers in order, with mobs
		for(var i = 0; i<this.tiles.length; i++) {
			this._drawLayer(context, i)
		}

		// Restore the context params for the next thing being drawn
		context.restore()

		// Reset the redraw flag
		this._doredraw = false
	}

	_drawLayer(context, indexZ) {
		// Draw the layer
		var layer = this.tiles[indexZ]
		for(var y=0; y<layer.length; y++) {
			for(var x=0; x<layer[y].length; x++) {
				context.drawImage(
					this.asset.element, 
					this.layer[y][x][0]*this.tileWidth, 
					this.layer[y][x][1]*this.tileHeight, 
					this.tileWidth, 
					this.tileHeight,
					x*this.tileWidth, 
					y*this.tileHeight,
					this.tileWidth, 
					this.tileHeight,
				)
			}
		}

		// Next draw any subscenes for this layer
		this.drawScenes(context, indexZ)

		// Now the Mobs for this layer
		this.drawMobs(context, indexZ)
	}
}

module.exports = Scene

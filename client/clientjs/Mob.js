// Mob is the base class for moving, animated subgraphics, also called 'Sprites' or 'Bobs' 
class Mob {
	constructor(options = {}) {
		options = options || {}

		// Asset is the graphical asset used for drawing
		this.asset = options.asset

		// The width and height of the tiles in the asset
		this.tileWidth = options.tileWidth || 48
		this.tileHeight = options.tileHeight || 96

		// The current tile coords as an array [x,y]
		this.tile = typeof(options.tile)=='undefined' ? null : options.tile
		// The current offsetX/Y from the origin of the container (the Scene, or the parent Mob)
		this.offsetX = options.offsetX || 0
		this.offsetY = options.offsetY || 0
		// The Parent container (the Scene, or the parent Mob)
		this.parent = typeof(options.parent)=='undefined' ? null : options.parent

		// The visible flag. Invisible Mobs and their children are not drawn
		this.visible = typeof(options.visible)=='undefined' ? true : !!options.visible

		// The scale and rotation settings for this mob. This context affects all child mobs also.
		this.scale = typeof(options.scale)=='undefined' ? 1 : options.scale
		this.rotate = typeof(options.rotate)=='undefined' ? 0 : options.rotate

		// Private props
		this._mobs = {}
		this._animations = {}
		this._currentanimation = null
		this._doredraw = true
	}

	// Mark the mob to be redrawn
	redraw() {
		// Mark us for redraw
		this._doredraw = true

		// Child Mobs
		for(var i in this._mobs) this._mobs[i].redraw()
	}

	// Draw the mob into the supplied 2DContext
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

		// Main Mob, omly draw if tile is not null and both tile coords are not null
		if(this.tile != null && this.tile[0] != null && this.tile[1] != null) {
			context.drawImage(
				this.asset.element, 
				this.tile[0]*this.tileWidth, 
				this.tile[1]*this.tileHeight, 
				this.tileWidth, 
				this.tileHeight,
				0, 
				0,
				this.tileWidth, 
				this.tileHeight,
			)
		}

		// Draw all Child Mobs
		for(var i in this._mobs) {
			this._mobs[i].draw(context)
		}

		// Restore the context params for the next thing being drawn
		context.restore()

		// Reset the redraw flag
		this._doredraw = false
	}

	// Add a child mob with the specified name
	addMob(name, mob) {
		this._mobs[name] = mob
	}

	// Return the child mob with the specified name
	getMob(name) {
		if (!this._mobs[name]) throw 'Mob not found: '+name
		return this._mobs[name]
	}

	// Add an animation with the specified name and definition
	addAnimation(name, def) {
		this._animations[name] = def
	}

	// Start an animation with the specified options
	animateStart(animation) {
		if(animation) {
			if(this._currentanimation) this.animateStop(Mob.STOPSTATUS_REPLACED)
			this._currentanimation = animation
			this._currentanimation.frame = 0
		}

		var nextFrame = ()=>{
			// Return immediately if there is no current animation
			if(!this._currentanimation) return
			
			// Get the Frame and default Delay
			var delay = this._currentanimation.delay 
			var anim = this._animations[this._currentanimation.name]
			var frame = anim[this._currentanimation.frame]

			// Set the tile
			this.tile = frame.slice(0,2)
			// Override the default delay if specified in the frame
			if(frame.length>2) delay = frame[2]

			// Translation deltaX/Y default from animation itself
			var dx = this._currentanimation.dx || 0
			var dy = this._currentanimation.dy || 0

			// Override that deltaX/Y if specified in the frame
			if(frame.length>3 && frame[3]!=null) dx = frame[3]
			if(frame.length>4 && frame[4]!=null) dy = frame[4]

			// End Conditions
			if (
				// We have moved to or past a specifed boundary (maxX, maxY)
				(this._currentanimation.maxX && this.offsetX>=this._currentanimation.maxX) ||
				(this._currentanimation.maxY && this.offsetY>=this._currentanimation.maxY) ||
				(this._currentanimation.minX && this.offsetX<=this._currentanimation.minX) ||
				(this._currentanimation.minY && this.offsetY<=this._currentanimation.minY)
			) {
				return this.animateStop(Mob.STOPSTATUS_COMPLETED)
			}

			// Increment the frame
			this._currentanimation.frame++

			// End / Loop conditions
			if(this._currentanimation.frame>=anim.length) {
				if (this._currentanimation.loop) {
					// Loop is specifed, restart from first frame
					this._currentanimation.frame = 0
				} else {
					// Loop not specifed, end the animation
					return this.animateStop(Mob.STOPSTATUS_COMPLETED)
				}
			}

			// If deltaX/Y is specified, move us
			if(dx) this.offsetX += dx
			if(dy) this.offsetY += dy

			// Mark to redraw
			this.redraw()

			// If the animation is ongoing, schedule the next frame
			if(this._currentanimation) this._currentanimation._timeout = setTimeout(nextFrame, delay)
		}

		// Start the animation
		nextFrame()
	}

	// Stop 
	animateStop(stopStatus = Mob.STOPSTATUS_STOPPED) {
		if(!this._currentanimation) return
		if (this._currentanimation._timeout) clearTimeout(this._currentanimation._timeout)
		if(this._currentanimation.stopTile) this.tile = this._currentanimation.stopTile
		if(this._currentanimation.stopCallback) {
			var func = this._currentanimation.stopCallback, self = this, f = () =>{ func(self, stopStatus) }
			setImmediate(f)
		}
		this._currentanimation = null
		this.redraw()
	}
}

// Mob Animation stop status values:

// The animation stopped because it was finished (non-looped) or a boundary condition was met (maxX, maxY)
Mob.STOPSTATUS_COMPLETED = 1
// The animation was stopped with animateStop
Mob.STOPSTATUS_STOPPED = 2
// The animation was stopped because animateStart was called with a new animation, replacing it
Mob.STOPSTATUS_REPLACED = 3

module.exports = Mob

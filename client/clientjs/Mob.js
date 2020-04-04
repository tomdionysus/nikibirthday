class Mob {
	constructor(options = {}) {
		options = options || {}
		this.asset = options.asset

		this.frames = {}

		this.tile = [0,0]
		this.offsetX = 0
		this.offsetY = 0
		this.parent =  typeof(options.parent)=='undefined' ? null : options.parent

		this.visible = true

		this.animations = {}
		this.currentAnimation = options.currentAnimation || null

		this.scale = typeof(options.scale)=='undefined' ? 1 : options.scale

		this.mobs = {}
	}

	redraw() {
		this.toRedraw = true
	}

	draw(context) {
		if(!this.toRedraw || !this.visible) return

		context.save()

		context.translate(this.offsetX, this.offsetY)
		context.scale(this.scale, this.scale)

		// Main Mob
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

		// Child Mobs
		for(var i in this.mobs) {
			this.mobs[i].draw(context)
		}

		// Draw Background
		context.restore()

		this.toRedraw = false
	}

	addMob(name, mob) {
		this.mobs[name] = mob
	}


	getMob(name) {
		if (!this.mobs[name]) throw 'Mob not found: '+name
		return this.mobs[name]
	}

	animate(animation) {
		if(animation) {
			if(this.currentAnimation) this.stopAnimate(Mob.STOPSTATUS_REPLACED)
			this.currentAnimation = animation
			this.currentAnimation.frame = 0
		}

		var nextFrame = ()=>{
			if(!this.currentAnimation) return
			
			// Frame, Delay
			var delay = this.currentAnimation.delay, anim = this.animations[this.currentAnimation.name], frame = anim[this.currentAnimation.frame]
			this.tile = frame.slice(0,2)
			if(frame.length>2) delay = frame[2]

			// Translation
			var dx = this.currentAnimation.dx, dy = this.currentAnimation.dy
			if(frame.length>3) dx = frame[3]
			if(frame.length>4) dy = frame[4]

			// End Conditions
			if (
				(this.currentAnimation.maxX && this.offsetX>=this.currentAnimation.maxX) ||
				(this.currentAnimation.maxY && this.offsetY>=this.currentAnimation.maxY) ||
				(this.currentAnimation.minX && this.offsetX<=this.currentAnimation.minX) ||
				(this.currentAnimation.minY && this.offsetY<=this.currentAnimation.minY)
			) {
				
				this.stopAnimate(Mob.STOPSTATUS_COMPLETED)
				return
			}

			this.currentAnimation.frame++
			if(this.currentAnimation.frame>=anim.length) {
				if (this.currentAnimation.loop) {
					this.currentAnimation.frame = 0
				} else {
					this.currentAnimation = null
				}
			} else if (anim[this.currentAnimation.frame]===null) {
				this.visible = false
			} else {
				this.visible = true
			}

			if(dx) this.offsetX += dx
			if(dy) this.offsetY += dy
			this.redraw()

			if(this.currentAnimation) this._currentAnimationTimeout = setTimeout(nextFrame, delay)
		}

		nextFrame()
	}

	stopAnimate(stopStatus = Mob.STOPSTATUS_STOPPED) {
		if (this._currentAnimationTimeout) clearTimeout(this._currentAnimationTimeout)
		if(this.currentAnimation.stopTile) this.tile = this.currentAnimation.stopTile
		if(this.currentAnimation.stopCallback) {
			var func = this.currentAnimation.stopCallback, self = this, f = () =>{ func(self, stopStatus) }
			setImmediate(f)
		}
		this.currentAnimation = null
		this._currentAnimationTimeout = null
		this.redraw()
	}
}

Mob.STOPSTATUS_COMPLETED = 1
Mob.STOPSTATUS_STOPPED = 2
Mob.STOPSTATUS_REPLACED = 3

module.exports = Mob

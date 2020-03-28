class Mob {
	constructor(options = {}) {
		options = options || {}
		this.asset = options.asset

		this.frames = {}

		this.tile = [0,0]
		this.offsetX = 0
		this.offsetY = 0

		this.animations = {}
		this.currentAnimation = options.currentAnimation || null
	}

	redraw() {
		this.toRedraw = true
	}

	draw(context) {
		if(!this.toRedraw) return

		context.drawImage(
			this.asset.element, 
			this.tile[0]*this.tileWidth, 
			this.tile[1]*this.tileHeight, 
			this.tileWidth, 
			this.tileHeight,
			this.offsetX, 
			this.offsetY,
			this.tileWidth, 
			this.tileHeight
		)

		this.toRedraw = false
	}

	animate(animation) {
		if(animation) {
			if(this.currentAnimation) this.stopAnimate()
			this.currentAnimation = animation
		}

		var nextFrame = ()=>{
			if(!this.currentAnimation) return

			var anim = this.animations[this.currentAnimation.name]
			this.tile = anim[this.currentAnimation.frame]

			// End Conditions
			if (
				(this.currentAnimation.maxX && this.offsetX>=this.currentAnimation.maxX) ||
				(this.currentAnimation.maxY && this.offsetY>=this.currentAnimation.maxY) ||
				(this.currentAnimation.minX && this.offsetX<=this.currentAnimation.minX) ||
				(this.currentAnimation.minY && this.offsetY<=this.currentAnimation.minY)
			) {
				
				this.stopAnimate()
				return
			}

			this.currentAnimation.frame++
			if(!anim[this.currentAnimation.frame]) {
				if (this.currentAnimation.loop) {
					this.currentAnimation.frame = 0
				} else {
					this.currentAnimation = null
				}
			}
			if(this.currentAnimation.dx) this.offsetX = this.offsetX+this.currentAnimation.dx
			if(this.currentAnimation.dy) this.offsetY = this.offsetY+this.currentAnimation.dy
			this.redraw()

			if(this.currentAnimation) this._currentAnimationTimeout = setTimeout(nextFrame, this.currentAnimation.delay)
		}

		nextFrame()
	}

	stopAnimate() {
		if (this._currentAnimationTimeout) clearTimeout(this._currentAnimationTimeout)
		if(this.currentAnimation.stopTile) this.tile = this.currentAnimation.stopTile
		this.currentAnimation = null
		this._currentAnimationTimeout = null
		this.redraw()
	}
}

module.exports = Mob

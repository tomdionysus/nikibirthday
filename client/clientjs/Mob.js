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

	animate() {
		var nextFrame = ()=>{
			var anim = this.animations[this.currentAnimation.name]
			this.tile = anim[this.currentAnimation.frame]	
			this.currentAnimation.frame++
			if(!anim[this.currentAnimation.frame]) {
				if (this.currentAnimation.loop) {
					this.currentAnimation.frame = 0
				} else {
					this.currentAnimation = null
				}
			}
			this.offsetX = this.offsetX+10
			this.redraw()

			if(this.currentAnimation) setTimeout(nextFrame, this.currentAnimation.delay)
		}

		nextFrame()
	}
}

module.exports = Mob

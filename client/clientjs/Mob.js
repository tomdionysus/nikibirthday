class Mob {
	constructor(options = {}) {
		options = options || {}
		this.asset = options.asset

		this.tileWidth = options.tileWidth || 48
		this.tileHeight = options.tileHeight || 96

		this.frames = {}

		this.tile = [1,3]
		this.offsetX = 128
		this.offsetY = 128

		this.animations = {
			'walknorth': [ [0,1],[1,1],[2,1],[1,1] ],
			'walksouth': [ [0,0],[1,0],[2,0],[1,0] ],
			'walkwest':  [ [0,2],[1,2],[2,2],[1,2] ],
			'walkeast':  [ [0,3],[1,3],[2,3],[1,3] ],
		}

		this.currentAnimation = { name: 'walkeast', frame: 0, loop: true }

		this.toRedraw = true
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
			if(anim[this.currentAnimation.frame]) {
				this.tile = anim[this.currentAnimation.frame]	
				this.currentAnimation.frame++
			} else {
				if (this.currentAnimation.loop) {
					this.currentAnimation.frame = 0
					this.tile = anim[this.currentAnimation.frame]
				} else {
					this.currentAnimation = null
				}
			}
			this.redraw()

			if(this.currentAnimation) setTimeout(nextFrame, 100)
		}

		nextFrame()
	}
}

module.exports = Mob

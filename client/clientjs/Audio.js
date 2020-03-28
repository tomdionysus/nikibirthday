const Browser = require('Browser')

class Audio {
	constructor(options) {
		options = options || {}
		this.src = options.src
		this.type = options.type

		this.startTime = options.startTime
		this.endTime = options.endTime
		this.loop = !!options.loop

		this._callonloaded = null
	}

	load(callback) {
		this.element = Browser.document.createElement('audio')
		this._callonloaded = callback
		this.element.oncanplaythrough = this._oncanplaythrough.bind(this)
		this.element.onloadedmetadata = this._onloadedmetadata.bind(this)
		this.element.ontimeupdate = this._ontimeupdate.bind(this)
		var source = Browser.document.createElement('source')
		source.src = this.src
		source.type = this.type
		this.element.appendChild(source)
	}

	play() {
		this.element.play()
	}

	playRange(start, end, loop = false) {
		this.startTime = start
		this.endTime = end
		this.loop = loop
		this.play()
	}

	pause() {
		this.element.pause()
	}

	stop() {
		this.element.oncanplaythrough = null
		this.element.pause()
		this.element.currentTime = '0'
	}

	_oncanplaythrough() {
		if(this._callonloaded) {
			var x = this._callonloaded
			this._callonloaded = null
			x()
		}
	}
	
	_onloadedmetadata() {
		this.duration = this.element.duration
		if(!this.endTime) this.endTime = this.duration
		this.element.playbackRate = 1;
		this.element.currentTime = this.startTime || 0;
	}

	_ontimeupdate() {
		if (this.element.currentTime >= this.endTime) {
			if(this.loop) {
				this.element.currentTime = this.startTime
			} else {
    			this.element.pause()
			}
  		}
	}
}

module.exports = Audio
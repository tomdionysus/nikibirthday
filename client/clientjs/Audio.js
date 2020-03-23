const Browser = require('Browser')

class Audio {
	constructor(options) {
		options = options || {}
		this.src = options.src
		this.type = options.type
	}

	load(callback) {
		this.element = Browser.document.createElement('audio')
		this.element.oncanplaythrough = () => callback()
		var source = Browser.document.createElement('source')
		source.src = this.src
		source.type = this.type
		this.element.appendChild(source)
	}

	play() {
		this.element.play()
	}

	pause() {
		this.element.pause()
	}

	stop() {
		this.element.oncanplaythrough = null
		this.element.pause()
		this.element.currentTime = '0'
	}
}

module.exports = Audio
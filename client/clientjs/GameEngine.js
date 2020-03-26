const async = require('async')
const _ = require('underscore')

const Browser = require('Browser')
const Asset = require('Asset')
const Audio = require('Audio')
const Mob = require('Mob')

class GameEngine {
	constructor(options) {
		options = options || {}
		this.Asset = options.Asset || Asset
		this.Audio = options.Audio || Audio
		this.Mob = options.Mob || Mob
		this.targetId = options.targetId
		this.fullscreen = !!options.fullscreen
		this.debug = !!options.debug

		this.scale = typeof(options.scale)=='undefined' ? 1 : options.scale
		this.x = options.x || 0
		this.y = options.y || 0
		this.scale = options.scale || 1

		this.minX = options.minX
		this.minY = options.minY
		this.maxX = options.maxX
		this.maxY = options.maxY

		this.minScale = typeof(options.minScale)=='undefined' ? 0.01 : options.minScale
		this.maxScale = typeof(options.maxScale)=='undefined' ? 10 : options.maxScale

		this.enableScroll = typeof(options.enableScroll)=='undefined' ? true : !!options.enableScroll
		this.enableZoom = typeof(options.enableZoom)=='undefined' ? true : !!options.enableZoom

		this.audioDefs = {}
		this.mobDefs = {}
		this.assetNames = {}
	}

	start(callback) {
		console.debug('starting')
		if(this.processKey) {
			Browser.document.onkeyup = (e) => { this.processKey(e) }
		}

		async.series([
			// Load Assets
			(cb) => { this.loadAssets(cb) },
			// Load Audio
			(cb) => { this.loadAudio(cb) },
			// Load Mobs
			(cb) => { this.loadMobs(cb) },
			// Boot Element
			(cb) => { this.bootElement(cb) },
		], 
		(err) => {
			if(err) {
				console.error('error while starting', err)
				if(callback) callback(err)
				return
			}
			this.running = true
			if(this.run) this.run()

			this.redraw()
			this.tick()
			console.debug('started')
			if(callback) callback()
		})
	}

	bindMouseWheel() {
		var ael = this.element.addEventListener
		if(!ael) ael = this.element.attachEvent
		ael('mousewheel', (e) => this._panZoom(e), false)
		ael('DOMMouseScroll', (e) => this._panZoom(e), false)
		ael('mousemove', (e) => this._move(e), false)
		ael('mousedown', (e) => this.mousedown(e), false)
		ael('mouseup', (e) => this.mouseup(e), false)
	}

	stop() {
		this.running = false
	}

	addAsset(name, src) {
		this.assetNames[name] = src
	}

	getAsset(name) {
		if (!this.assets[name]) throw 'Asset not found: '+name
		return this.assets[name]
	}

	addAudio(name, src, type) {
		this.audioDefs[name] = {src: src, type: type}
	}

	getAudio(name) {
		if (!this.audio[name]) throw 'Audio not found: '+name
		return this.audio[name]
	}

	addMob(name, asset, options) {
		this.mobDefs[name] = {name: name, asset: asset}
	}


	getMob(name) {
		if (!this.mobs[name]) throw 'Mob not found: '+name
		return this.mobs[name]
	}

	redraw() {
		this.clear = true

		// Redraw All Mobs
		for(var i in this.mobs) this.mobs[i].redraw()
	}

	tick() {
		var context = this.element.getContext('2d')

		if(this.clear) {
			context.fillStyle = 'black'
			context.fillRect(0, 0, this.element.width, this.element.height)
		}

		// Main
		context.save()

		// Set scale
		context.scale(this.scale, this.scale)
		context.translate(this.x, this.y)

		// Mobs
		var flik = this.getMob('flik')
		if(flik) {
			flik.draw(context)
		} 

		// Draw Background
		context.restore()

		// HUD
		if(this.clear) { this.drawHUD(context) }
		
		this.clear = false

		if(this.running) Browser.window.requestAnimationFrame(this.tick.bind(this),0)
	}

	loadAssets(callback) {
		console.debug('loading assets')
		this.assets = {}
		for(var i in this.assetNames) {
			this.assets[i] = new this.Asset({ name: i, src: this.assetNames[i] })
		}

		async.each(this.assets, (asset, cb) => { asset.load(cb) }, callback)
	}

	loadAudio(callback) {
		console.debug('loading audio')
		this.audio = {}
		for(var i in this.audioDefs) {
			this.audio[i] = new this.Audio({ name: i, src: this.audioDefs[i].src, type: this.audioDefs[i].type })
		}

		async.each(this.audio, (audio, cb) => { audio.load(cb) }, callback)
	}

	loadMobs(callback) {
		console.debug('loading mobs')
		this.mobs = {}
		for(var i in this.mobDefs) {
			this.mobs[i] = new this.Mob({ name: i, asset: this.getAsset(this.mobDefs[i].asset) })
		}

		callback()
	}

	bootElement(callback) {
		this.target = Browser.document.getElementById(this.targetId)
		this.element = Browser.document.createElement('canvas')
		this.document = this.target.ownerDocument
		this.window = this.document.defaultView || this.document.parentWindow

		if(this.fullscreen) {
			this.recomputeFullScreen()
			this.window.addEventListener('resize', _.debounce(() => { this.recomputeFullScreen() } ,100))
		} else {
			this.element.width = this.target.getAttribute('width')
			this.element.height = this.target.getAttribute('height')
		}

		this.element.classList.add('gamescreen')
		this.target.parentNode.replaceChild(this.element, this.target)

		this.w = this.element.width / this.scale
		this.h = this.element.height / this.scale

		if(this.enableScroll || this.enableZoom) this.bindMouseWheel()

		if(callback) callback()
	}

	recomputeFullScreen() {
		this.element.width = this.window.innerWidth
		this.element.height = this.window.innerHeight
		this.w = this.element.width / this.scale
		this.h = this.element.height / this.scale
		this.redraw()
	}

	// Event Handlers
	_panZoom(e) {
		if(e.shiftKey) {
			var f = e.deltaY/100
			this.scale = this.scale + f

			if(this.minScale) this.scale = Math.max(this.scale, this.minScale)
			if(this.maxScale) this.scale = Math.min(this.scale, this.maxScale)

			// Update Width/Height
			var ow = this.w, oh = this.h
			this.w = this.element.width / this.scale
			this.h = this.element.height / this.scale

			// Update x and y to centre zoom
			this.x = this.x-(ow-this.w)/2
			this.y = this.y-(oh-this.h)/2

		} else {
			this.x += e.deltaX
			this.y += e.deltaY
		}

		// Limits? 
		if(this.minX) this.x = Math.max(this.minX*this.scale, this.x)
		if(this.minY) this.y = Math.max(this.minY*this.scale, this.y)
		if(this.maxX) this.x = Math.min(this.maxX/this.scale, this.x)
		if(this.maxY) this.y = Math.min(this.maxY/this.scale, this.y)

		// Correct Mouse Coords
		this._setMouseCoords(e)

		this.redraw()

		// Prevent DOM Stuff
		e.preventDefault()
		e.stopPropagation()
	}

	_move(e) {
		this._setMouseCoords(e)
		
		this.redraw()

		// Prevent DOM Stuff
		e.preventDefault()
		e.stopPropagation()
	}

	_setMouseCoords(e) {
		this.mouseX = (e.offsetX/this.scale)-this.x
		this.mouseY = (e.offsetY/this.scale)-this.y
	}

	drawHUD(context) {
		if(!this.debug) return
		context.save()
		context.font='14px Arial'
		context.fillStyle = 'white'
		context.fillText(
			'Screen (X: '+Math.round(this.x)
			+' Y: '+Math.round(this.y)
			+' W: '+Math.round(this.w)
			+' H: '+Math.round(this.h)+')'
			+' Zoom: '+Math.round(this.scale*100)+'%'
			+' Mouse (X: '+Math.round(this.mouseX)+' Y: '+Math.round(this.mouseY)+')'
			+' Limits Min: (X: '+Math.round(this.minX/this.scale)+', Y: '+Math.round(this.minY/this.scale)+')'
			+' Limit Max: (X: '+Math.round(this.maxX*this.scale)+', Y: '+Math.round(this.maxY*this.scale)+')'
			, 10, 20)
		context.restore()
	}

	mousedown() {}
	mouseup() {}
}

module.exports = GameEngine
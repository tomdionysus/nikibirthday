const _ = require('underscore')
const path = require('path')
const fs = require('fs')
const browserify = require('browserify')
const Logger = require('./Logger')
const ScopedLogger = require('./ScopedLogger')

class JSCompiler {
	constructor(options) {
		options = options || {}
		this.logger = new ScopedLogger('JSCompiler', options.logger || new Logger())
		this.fs = options.fs || fs
		this.path = options.path || path
		this.beautify = options.beautify
		this.express = this.express.bind(this)
		this.recompile = !!options.recompile
	}

	register(sourceDir, callback) {
		this.sourceDir = sourceDir

		if (this.recompile) this.watch()

		this.load()
		this.compile(callback)
	}

	_doOutput(res) {
		res.set('content-type','application/javascript').status(200).send(this._compiled).end()
	}

	watch() {
		this.logger.info("Watching %s for changes....",this.sourceDir)
		this.fs.watch(this.sourceDir, { recursive: true }, _.debounce(function(){
			this.load()
			this.compile()
		}.bind(this),1000))
	}

	express(req, res, next) {
		if (this._compiled) {
			this._doOutput(res)
			if(next) return next()
			return
		}

		this.compile((err) => {
			if(err) { 	
				this.logger.error('Compiler Error', err)
				res.status(500)
				next()
				return
			}
			this._doOutput(res)
			if(next) return next()
			return
		})
	}

	compile(cb) {
		this._compiled = ''

		try {
			var result = browserify({ debug: this.beautify })

			// Load Files
			for(var i in this.sources) {
				var file = this.sources[i]
				result.require(path.join(this.sourceDir, file), { expose: file.substr(0, file.length-3) })
			}
			
			if(!this.beautify) result.transform('uglifyify', { global: true })

			result
				.bundle()
				.on('error', (err) => {
					this.logger.error('Compiler Error', err.toString())
					if(cb) cb(err)
					return 
				}).on('data', (d) => {
					this._compiled += d.toString()
				}).on('end', () => {
					this.logger.info('Compiled Client JS')
				
					if(cb) cb(null, this._compiled)
				})
		
		} catch(err) {
			this.logger.error('Compiler Error', err)
			if(cb) cb(err)
			return 
		}
	}

	load() {
		this.sources = []
		this._load('', this.sourceDir)
	}

	_load(filePath, base) {
		var files = fs.readdirSync(path.join(base, filePath))
		for(var i in files) {
			var file = files[i]
			var relpath = path.join(filePath, file)
			var fullPath = path.join(base, relpath)
			var stats = fs.statSync(fullPath)
			if (stats.isDirectory()) { 
				this._load(relpath, base)
				continue 
			}
			if (path.extname(file)!='.js') continue

			this.sources.push(relpath)
		}
	}
}

module.exports = JSCompiler
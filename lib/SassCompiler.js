const sass = require('node-sass')
const fs = require('fs')
const _ = require('underscore')

const Logger = require('./Logger')
const ScopedLogger = require('./ScopedLogger')

class SassCompiler {
	constructor(options) {
		options = options || { recompile: false }
		this.options = options
		this.logger = new ScopedLogger('Sass', options.logger || new Logger())
		this.sassOptions = this.sassOptions || {}
		this.fs = options.fs || fs
		this.sass = options.sass || sass
		this._compiled = null

		this.express = this.express.bind(this)
	}

	register(sourceFile, callback) {
		this.sourceFile = sourceFile

		if (this.options.recompile) this.watch()

		this.compile(callback)
	}

	express(req, res, next) {
		if (this._compiled) {
			this._doOutput(res)
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
		})
        
	}

	_doOutput(res) {
		res.set('content-type','text/css').status(200).send(this._compiled.css).end()
	}

	watch() {
		this.fs.watch(this.sourceFile, _.debounce(() => {
			this.compile(function(err) {
				if(err) { this.logger.error('Compiler Error', err) }
			})
		}),1000)
	}

	compile(callback) {
		this.sass.render({ file: this.sourceFile }, (err, result) => {
			if (err) { callback(err); return }
			this._compiled = result
			this.logger.info('CSS %s Compiled', this.sourceFile) 
			if(callback) callback(null, this._compiled)
		})
	}
}

module.exports = SassCompiler
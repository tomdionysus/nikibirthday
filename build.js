#!/usr/bin/env node

const Server = require("./lib/Server")
const Logger = require("./lib/Logger")
const SassEngine = require("./lib/SassEngine")
const ClientJSEngine = require("./lib/ClientJSEngine")

const fs = require('fs')
const ncp = require('ncp')
const async = require('async')
const path = require('path')

var logger = new Logger({ logLevel: 'INFO' })

logger.info("Building into directory 'build'...")

async.series([
	// Clear Old Build Dir
	(cb) => { fs.rmdir('./build', { recursive: true }, cb) },
	// Make a new one, and subfolders
	(cb) => { fs.mkdir('./build', {}, cb) },
	(cb) => { fs.mkdir('./build/css', {}, cb) },
	(cb) => { fs.mkdir('./build/js', {}, cb) },
	// Build the app
	(cb) => {
		async.parallel([
			// Copy All electron support files
			(cb) => { ncp('./electron/', './build', cb) },
			// Copy All assets etc
			(cb) => { ncp('./client/public/', './build', cb) },
			// Compile SASS
			(cb) => { compileSASS('./build/css/app.css', cb) },
			// Compile JS
			(cb) => { compileJS('./build/js/app.js', cb) },
		], cb)
	}
], (err) => {
	if(err) {
		logger.error(err)
		return
	}
	logger.info("Build Complete")
})

function compileSASS(filename, cb) {
	var sassEngine = new SassEngine({ logger: logger, recompile: false })
	sassEngine.register('./client/sass/app.scss', (err,src) => {
		if(err) return cb(err)
		fs.writeFile(filename, src.css, cb)
	})

}

function compileJS(filename, cb) {
	var clientJSEngine = new ClientJSEngine({ logger: logger, beautify: false })
	clientJSEngine.register(path.join(__dirname, './client', 'clientjs'), (err, src) => {
		if(err) return cb(err)
		fs.writeFile(filename, src, cb)
	})
}
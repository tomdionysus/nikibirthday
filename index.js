#!/usr/bin/env node

const Server = require("./lib/Server")
const Logger = require("./lib/Logger")
const SassCompiler = require("./lib/SassCompiler")
const JSCompiler = require("./lib/JSCompiler")

const routes = require('./config/routes')

function main() {
	// ENV and defaults
	var port = parseInt(process.env.PORT || "8080")

	// Logger
	var logger = new Logger()

	// Boot Message
	logger.log("Game Engine Demo","----")
	logger.log("BlackRaven 2020 (Tom Cully)","----")
	logger.log("v1.0.0","----")
	logger.log("","----")
	logger.log("Logging Level %s","----",Logger.logLevelToString(logger.logLevel))

	// Dependencies
	var sassCompiler = new SassCompiler({ logger: logger, recompile: true })
	var jsCompiler = new JSCompiler({ logger: logger, beautify: true, recompile: true })

	// Main Server
	var svr = new Server({
		sassCompiler: sassCompiler,
		jsCompiler: jsCompiler,
		logger: logger,
		port: port,
		env: process.env.ENV || 'prod'
	})

	routes.register(svr)

	// Server Start
	svr.start()
}

main()

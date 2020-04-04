module.exports.register = function(svr) {
	// Public Assets
	svr.registerStatic('/','game/public')

	// Sass -> CSS
	svr.registerSaas('/css/app.css', 'game/sass/app.scss')
	
	// Clientside JS Compiler
	svr.registerJSCompiler('/js/app.js', 'game/js')
}

const _ = require('underscore')
const Mixin = require('Mixin')

class HasScenesMixin extends Mixin {
	static init(obj, options) {
		obj._scenes = {}
		obj._sceneOrder = null
		obj._sceneOrderMap = null
	}

	addScene(name, scene) {
		this._scenes[name] = scene
		scene.name = name
		if(scene.parent && scene.parent.removeScene) scene.parent.removeScene(name)
		scene.parent = this
	}

	removeScene(name) {
		delete this._scenes[name]
		this.redraw()
	}

	getScene(name) {
		if (!this._scenes[name]) throw 'Scene not found: '+name
		return this._scenes[name]
	}

	// Draw scenes in z-order
	drawScenes(context, indexZ = null) {
		if(!this._sceneOrder) this.sortScenesZ()
		if(indexZ === null) {
			for(var i in this._sceneOrder) this._sceneOrder[i].draw(context)
		} else {
			for(var i in this._sceneOrderMap[indexZ]) this._sceneOrderMap[indexZ][i].draw(context)
		}
	}

	sortScenesZ() {
		this._sceneOrder = _.sortBy(Object.values(this._scenes), 'indexZ')
		var last = 0
		this._sceneOrderMap = {}
		for(var i in this._sceneOrder) {
			var scene = this._sceneOrder[i]
			this._sceneOrderMap[scene.indexZ] = this._sceneOrderMap[scene.indexZ] || []
			this._sceneOrderMap[scene.indexZ].push(scene)
		}
	}

	redrawScenes() {
		for(var i in this._scenes) this._scenes[i].redraw()
	}
}

module.exports = Mixin.export(HasScenesMixin)
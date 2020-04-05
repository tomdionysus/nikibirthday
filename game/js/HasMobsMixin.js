const _ = require('underscore')
const Mixin = require('Mixin')

class HasMobsMixin extends Mixin {
	static init(obj, options) {
		obj._mobs = {}
		obj._mobOrder = null
		obj._mobOrderMap = null
	}

	addMob(name, mob) {
		this._mobs[name] = mob
		mob.name = name
		if(mob.parent && mob.parent.removeMob) mob.parent.removeMob(name)
		mob.parent = this
		return mob
	}

	removeMob(name) {
		delete this._mobs[name]
		this.redraw()
	}

	getMob(name) {
		if (!this._mobs[name]) throw 'Mob not found: '+name
		return this._mobs[name]
	}

	// Draw mobs in z-order
	drawMobs(context, indexZ = null) {
		if(!this._mobOrder) this.sortMobsZ()
		if(indexZ === null) {
			for(var i in this._mobOrder) this._mobOrder[i].draw(context)
		} else {
			for(var i in this._mobOrderMap[indexZ]) this._mobOrderMap[indexZ][i].draw(context)
		}
	}

	sortMobsZ() {
		this._mobOrder = _.sortBy(Object.values(this._mobs), 'indexZ')
		var last = 0
		this._mobOrderMap = {}
		for(var i in this._mobOrder) {
			var mob = this._mobOrder[i]
			this._mobOrderMap[mob.indexZ] = this._mobOrderMap[mob.indexZ] || []
			this._mobOrderMap[mob.indexZ].push(mob)
		}
	}

	redrawMobs() {
		for(var i in this._mobs) this._mobs[i].redraw()
	}
}

module.exports = Mixin.export(HasMobsMixin)
class Mixin {
	static export(klass) {
		return function(obj, options) {
			var c = Mixin.getMethods(new klass())
			for(var i in c) {
				obj[i] = c[i].bind(obj)
			}
			if(klass.init) klass.init(obj, options)
		}
	}

	static getMethods(inst) {
		var out = {}
		inst = inst.__proto__
		while(inst) {
			if(inst.constructor === Object) break
			var methods = Object.getOwnPropertyDescriptors(inst)
			for(var k in methods) {
				if(k=='constructor') continue
				out[k] = methods[k].value
			}
			inst = inst.__proto__
		}
		return out
	}
}

// See examples/MixinExample on how to write mixins
// See examples/MixinExample on how to use mixins

module.exports = Mixin
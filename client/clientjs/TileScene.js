const Util = require('Util')

class Area {
	constructor(options) {
		options = options || {}
		this.tilesAsset = options.tilesAsset
		this.tileWidth = Util.propDefault(options,'tileWidth',64)
		this.tileHeight = Util.propDefault(options,'tileHeight',64)
		this.tiles = options.tiles
	}

	addMob(id, mob) {
		this.mobs[id] = mob
		this.mobs[id].area = this
	}

	addTrigger(x,y,data) {
		this.triggers[y] = this.triggers[y] || {}
		this.triggers[y][x] = data
	}

	clearTrigger(x,y) {
		if(!this.triggers[y]) return
		if(!this.triggers[y][x]) return
		delete this.triggers[y][x]
		if(this.triggers[y] == {}) delete this.triggers[y]
	}

	redraw() {
		// Tiles
		for(var y = 0; y< this.tiles.length; y++) {
			var col = this.tiles[y] 
			if(!col) continue
			for(var x = 0; x<col.length; x++) {
				if(!col[x]) continue
				this.toDraw.push({ x: x, y: y })
			}
		}
		// Mobs
		for(var i in this.mobs) {
			this.mobs[i].redraw()
		}
	}

	getTiles(x,y) {
		var row = this.tiles[y]
		return row ? row[x] : null
	}

	setTiles(x,y,tiles) {
		this.tiles[y] = this.tiles[y] || []
		this.tiles[y][x] = tiles
		this.toDraw.push({ x: x, y: y })
	}

	setAccess(x, y, mask) {
		var row = this.access[x] || []
		row[y] = !!mask
		this.access[x] = row
		this.toDraw.push({ x: x, y: y })
	}

	getAccess(x,y) {
		console.log(x,y)
		var row = this.access[x]
		if(!row) return false
		return !!row[y]
	}

	optimise() {
		for(var y = 0; y<this.tiles.length; y++) {
			var row = this.tiles[y]
			if(!row) continue
			for(var x = 0; x<row.length; x++) {
				var cell = row[x]
				if(!cell) continue
				while(cell.length>0 && cell[cell.length-1] == null) cell.pop()
				row[x] = cell
			}
			while(row.length>0 && row[row.length-1] == null || row[row.length-1] == []) row.pop()
			this.tiles[y] = row
		}
		while(this.tiles.length>0 && this.tiles[this.tiles.length-1] == null || this.tiles[this.tiles.length-1] == []) this.tiles.pop()
	}

	invalidateTileRange(x1,y1,x2,y2) {
		for(var y = y1; y<=y2 && y<this.tiles.length; y++) {
			var r = this.tiles[y]
			for(var x = x1; x<=x2 && x<r.length; x++) {
				this.toDraw.push({ x: x, y: y })
			}
		}
	}

	invalidateRange(x1,y1,x2,y2) {
		var rx1 = Math.floor(x1 / this.tileWidth)
		var rx2 = Math.floor(x2 / this.tileWidth)
		var ry1 = Math.floor(y1 / this.tileHeight)
		var ry2 = Math.floor(y2 / this.tileHeight)
		this.invalidateTileRange(rx1,ry1,rx2,ry2)
	}

	draw(context) {
		var i

		// Draw all invalid tiles
		var drawn = {}
		while (true) {
			var cell = this.toDraw.pop()
			if (!cell) break

			// Clear Cell
			context.color = 'black'
			context.fillRect(
				cell.x*this.tileWidth, 
				cell.y*this.tileHeight, 
				this.tileWidth, 
				this.tileHeight
			)

			// Draw all layers in cell
			var layers = this.tiles[cell.y][cell.x]
			for(i in layers) {
				var t = layers[i]
				if(!t) continue
				context.drawImage(
					this.tilesAsset.element, 
					t[0]*this.tileWidth, 
					t[1]*this.tileHeight, 
					this.tileWidth, 
					this.tileHeight,
					cell.x*this.tileWidth, 
					cell.y*this.tileHeight, 
					this.tileWidth, 
					this.tileHeight
				)
			}
			// Draw system entities?
			if(this.drawSystem) {
				this._drawSystem(context, cell)
			}
			// Mark cell drawn
			drawn[cell.x] = drawn[cell.x] || {}
			drawn[cell.x][cell.y] = true
		}
	}

	
}

module.exports = Area

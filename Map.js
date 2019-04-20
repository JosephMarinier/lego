const _ = require("lodash");
const fs = require("fs");
const Bitmap = require("node-bitmap");

const color = require("./color");

class Map {
	constructor(threshold) {
		const bitmap = new Bitmap(fs.readFileSync("map.bmp"));
		bitmap.init();

		this.map = _.map(bitmap.getData(true), (line, y) => _.map(line, ({r, g, b}, x) => (r + g + b) < threshold * 3 ? -(1 + Math.floor(x / 32) + 4 * Math.floor(y / 32)) : 0));

		this.pieceCount = 0;
	}

	get(x, y) {
		return _.get(this.map, [y, x], null);
	}

	set(x, y, value) {
		_.set(this.map, [y, x], value || this.pieceCount);
	}
	
	color(stud) {
		let colorValue = stud == 0 && this.pieceCount > 1 ? 0 // black
			: stud < 0 ? 4 // blue
			: 2; // green
		return "\u001b[" + (40 + colorValue) + "m";
	}

	toString() {
		return color.foreground.black(_.map(this.map, (line, y) => (
			_.map(line, (stud, x) => (
				stud === this.get(x - 1, y) ? "" : this.color(stud)
			) + (
				stud === this.get(x, y + 1) ? " " : "_"
			) + (
				stud === this.get(x + 1, y) ? " " : "|"
			)).join("") + "\u001b[49m"
		)).join("\n"));
	}

	fits(piece, dx, dy) {
		return _(piece).every((line, y) => (
			_(line).every((stud, x) => !(stud && this.get(x + dx, y + dy) != 0))
		));
	}

	place(piece, dx, dy) {
		this.pieceCount += 1;
		_(piece).each((line, y) => (
			_(line).each((stud, x) => {
				if (stud) {
					this.set(x + dx, y + dy);
				}
			})
		));
	}

	tryPlacing(piece, dx, dy) {
		const fits = this.fits(piece, dx, dy);
		if (fits) {
			this.place(piece, dx, dy);
		}
		return fits;
	}
}

module.exports = Map;

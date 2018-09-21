const _ = require("lodash");
const fs = require("fs");
const Bitmap = require("node-bitmap");

class Map {
	constructor(seuil) {
		const bitmap = new Bitmap(fs.readFileSync("map.bmp"));
		bitmap.init();

		this.map = _.map(bitmap.getData(true), (line, y) => _.map(line, ({r, g, b}, x) => (r + g + b) < seuil * 3 ? -(1 + Math.floor(x / 32) + 4 * Math.floor(y / 32)) : 0));

		this.number_of_pieces = 0;
	}

	get(x, y) {
		return _.get(this.map, [y, x], null);
	}

	set(x, y, value) {
		_.set(this.map, [y, x], value || this.number_of_pieces);
	}

	toString() {
		return _(this.map).map((line) => (line.join(""))).join("\n");
	}

	fits(piece, x_offset, y_offset) {
		return _(piece).every((line, y) => (
			_(line).every((stud, x) => !(stud && this.get(x + x_offset, y + y_offset) != 0))
		));
	}

	place(piece, x_offset, y_offset) {
		this.number_of_pieces += 1;
		_(piece).each((line, y) => (
			_(line).each((stud, x) => {
				if (stud) {
					this.set(x + x_offset, y + y_offset);
				}
			})
		));
	}

	try_placing(piece, x_offset, y_offset) {
		const fits = this.fits(piece, x_offset, y_offset);
		if (fits) {
			this.place(piece, x_offset, y_offset);
		}
		return fits;
	}
}

module.exports = Map;

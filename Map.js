const _ = require("lodash");
const fs = require("fs");
const Bitmap = require("node-bitmap");

const color = require("./color");

class Map {
	constructor(threshold) {
		const bitmap = new Bitmap(fs.readFileSync("map.bmp"));
		bitmap.init();

		this.map = _.map(bitmap.getData(true), (line, y) => _.map(line, ({r, g, b}, x) => (r + g + b) < threshold * 3 ? -(1 + Math.floor(x / 32) + 4 * Math.floor(y / 32)) : 0));

		this.number_of_pieces = 0;
	}

	get(x, y) {
		return _.get(this.map, [y, x], null);
	}

	set(x, y, value) {
		_.set(this.map, [y, x], value || this.number_of_pieces);
	}
	
	color(stud) {
		let colorValue = stud == 0 && this.number_of_pieces > 1 ? 0 // black
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

	tryPlacing(piece, x_offset, y_offset) {
		const fits = this.fits(piece, x_offset, y_offset);
		if (fits) {
			this.place(piece, x_offset, y_offset);
		}
		return fits;
	}
}

module.exports = Map;

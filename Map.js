const _ = require("lodash");

class Map {
	constructor() {
		this.map = [
			[1, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 0, 0, 0, 0],
			[1, 1, 0, 0, 0, 0, 0],
			[0, 1, 1, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 0, 0],
			[0, 1, 0, 0, 0, 0, 0],
			[0, 1, 1, 1, 1, 0, 0],
		];

		this.number_of_pieces = 1;
	}

	get(x, y) {
		return _.get(this.map, [y, x], -1);
	}

	set(x, y) {
		_.set(this.map, [y, x], this.number_of_pieces);
	}

	toString() {
		return _(this.map).map((line) => (line.join(""))).join("\n");
	}

	fits(piece, x_offset, y_offset) {
		return _(piece).every((line, y) => (
			_(line).every((stud, x) => !(stud && this.get(x + x_offset, y + y_offset)))
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

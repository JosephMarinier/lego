const _ = require("lodash");

function LegoFactory(element) {
	if (/^PLATE (\d+)X(\d+)$/.test(element.name)) {
		return new Plate(
			element,
			Number(RegExp.$1),
			Number(RegExp.$2),
		);
	} else if (/^CORNER PLATE (\d+)X(\d+)X(\d+)$/.test(element.name)) {
		return new CornerPlate(
			element,
			Number(RegExp.$1),
			Number(RegExp.$2),
			Number(RegExp.$3),
		);
	}
}

class Lego {
	constructor(element) {
		this.element_id = element.element_id;
		this.design_id = element.design_id;
		this.name = element.name;
		this.price = element.price;
		this.quantity = 0;
	}
}

class Plate extends Lego {
	constructor(element, width, length) {
		super(element);

		this.width = width;
		this.length = length;
		this.studs = width * length;

		this.representations = [
			Array(width).fill(Array(length).fill(1)),
		];
		if (width != length) {
			this.representations.push(_.zip(...this.representations[0]));
		}
	}

	get price_per_stud() {
		return this.price / this.studs;
	}
}

class CornerPlate extends Plate {
	constructor(element, thickness, width, length) {
		super(element);

		this.studs = thickness * (width + length - thickness);

		this.thickness = thickness;

		this.representations = [
			_.times(width, (y) => (
				_.times(length, (x) => (
					Number(x < thickness || y < thickness)
				))
			)),
		];
		this.representations.push([...this.representations[0]].reverse());
		this.representations.push(_.map(this.representations[0], (line) => [...line].reverse()));
		this.representations.push(_.map(this.representations[0], (line) => [...line].reverse()).reverse());
	}
}

module.exports = LegoFactory;

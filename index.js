const _ = require("lodash");
const LegoApi = require("./LegoApi");
const Map = require("./Map");

const DARK_GREEN = 28;

main();

async function main() {
	try {
		const lego = new LegoApi();

		const greenLegos = await lego.getProductWithColor(DARK_GREEN);

		const green_plates = _(greenLegos).map((element) => {
			const { name, price, element_id, design_id } = element;
			if (/^PLATE (\d+)X(\d+)$/.test(name)) {
				const width = Number(RegExp.$1);
				const length = Number(RegExp.$2);
				const studs = width * length;
				const price_per_stud = price / studs;
				const representations = [
					Array(width).fill(Array(length).fill(1)),
				];
				if (width != length) {
					representations.push(_.zip(...representations[0]));
				}
				return {
					element_id,
					design_id,
					name,
					width,
					length,
					price,
					studs,
					price_per_stud,
					representations,
				};
			} else if (/^CORNER PLATE (\d+)X(\d+)X(\d+)$/.test(name)) {
				const thickness = Number(RegExp.$1);
				const width = Number(RegExp.$2);
				const length = Number(RegExp.$3);
				const studs = thickness * (width + length - thickness);
				const price_per_stud = price / studs;
				const representations = [
					_.times(width, (y) => (
						_.times(length, (x) => (
							Number(x < thickness || y < thickness)
						))
					)),
				];
				representations.push([...representations[0]].reverse());
				representations.push(_.map(representations[0], (line) => [...line].reverse()));
				representations.push(_.map(representations[0], (line) => [...line].reverse()).reverse());
				return {
					element_id,
					design_id,
					name,
					thickness,
					width,
					length,
					price,
					studs,
					price_per_stud,
					representations,
				};
			}
		}).compact().orderBy(['studs', 'price_per_stud'], ['desc' ,'asc']).value();
		/*
		green_plates.each(console.log)
		const average_price_per_stud = green_plates.reduce(([price_sum, studs_sum], { price, studs }) => [
			price_sum + price,
			studs_sum + studs,
		], [0, 0]).reduce((price_sum, studs_sum) => (price_sum / studs_sum));
		*/

		const map = new Map();
		console.log(map.toString());

		_.each(green_plates, ({representations}) => {
			_(map.map).each((line, y) => (
				_(line).each((stud, x) => {
					_(representations).some((representation) => (
						map.try_placing(representation, x, y)
					));
				})
			));
			console.log();
			console.log(map.toString());
		});
	} catch (e) {
		console.error(e);
	}
}

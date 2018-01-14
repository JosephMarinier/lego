const _ = require("lodash");
const LegoApi = require("./LegoApi");

const DARK_GREEN = 28;

main();

async function main() {
	try {
		const lego = new LegoApi();
		await lego.setToken();

		const greenLegos = await lego.getProductWithColor(DARK_GREEN);

		const green_plates = _(greenLegos).map((element) => {
			const { name, price, element_id, design_id } = element;
			if (/^PLATE (\d+)X(\d+)$/.test(name)) {
				const width = Number(RegExp.$1);
				const length = Number(RegExp.$2);
				const studs = width * length;
				const price_per_stud = price / studs;
				return {
					element_id,
					design_id,
					name,
					width,
					length,
					price,
					studs,
					price_per_stud,
				};
			} else if (/^CORNER PLATE (\d+)X(\d+)X(\d+)$/.test(name)) {
				const thickness = Number(RegExp.$1);
				const width = Number(RegExp.$2);
				const length = Number(RegExp.$3);
				const studs = thickness * (width + length - thickness);
				const price_per_stud = price / studs;
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
				};
			}
		}).compact().sort(
			(a, b) => (a.price_per_stud - b.price_per_stud) || (b.studs - a.studs)
		).value();
		/*
		green_plates.each(console.log)
		const average_price_per_stud = green_plates.reduce(([price_sum, studs_sum], { price, studs }) => [
			price_sum + price,
			studs_sum + studs,
		], [0, 0]).reduce((price_sum, studs_sum) => (price_sum / studs_sum));
		*/
	} catch (e) {
		console.error(e);
	}
}

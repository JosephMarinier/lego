const _ = require("lodash");
const LegoApi = require("./LegoApi");
const LegoFactory = require("./LegoPlate");
const Map = require("./Map");

const DARK_GREEN = 28;

main();

async function main() {
	try {
		const lego = new LegoApi();

		const greenLegos = await lego.getProductWithColor(DARK_GREEN);

		const green_plates = _(greenLegos).map(LegoFactory).compact().orderBy(['studs', 'price_per_stud'], ['desc' ,'asc']).value();
		/*
		green_plates.each(console.log)
		const average_price_per_stud = green_plates.reduce(([price_sum, studs_sum], { price, studs }) => [
			price_sum + price,
			studs_sum + studs,
		], [0, 0]).reduce((price_sum, studs_sum) => (price_sum / studs_sum));
		*/

		const map = new Map();
		console.log(map.toString());

		_.each(green_plates, (green_plate) => {
			_(map.map).each((line, y) => (
				_(line).each((stud, x) => {
					if (_(green_plate.representations).some((representation) => (
						map.try_placing(representation, x, y)
					))) {
						green_plate.quantity += 1;
					}
				})
			));
			console.log();
			console.log(map.toString());
		});

		const {quantity, cost} = _.transform(green_plates, (total, {name, price, quantity}) => {
			const cost = quantity * price;
			total.quantity += quantity;
			total.cost += cost;
			console.log((quantity + " × " + name).padEnd(22) + " à " + price.toFixed(2).padStart(6) + " = " + cost.toFixed(2).padStart(6));
		}, {quantity: 0, cost: 0});
		console.log("".padStart(42, "_"));
		console.log((quantity + " ×").padEnd(22) + cost.toFixed(2).padStart(18) + " $");
	} catch (e) {
		console.error(e);
	}
}

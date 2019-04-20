const _ = require("lodash");
const fs = require("fs");
const LegoApi = require("./LegoApi");
const LegoFactory = require("./LegoPlate");
const Map = require("./Map");

main();

async function main() {
	var threshold = process.argv[process.execArgv.length + 2] || 112;

	try {
		let greenLegos;
		try {
			const content = fs.readFileSync(`greenLegos.json`);

			greenLegos = JSON.parse(content);

			console.log(`Got green plates info from file.`);
		} catch (error) {
			console.log(`Getting green plates info from Internet...`);

			const legoApi = new LegoApi();

			greenLegos = await legoApi.getProductWithColor(LegoApi.DARK_GREEN);

			fs.writeFileSync(`greenLegos.json`, JSON.stringify(greenLegos, null, "\t"));
		}

		const greenPlates = _(greenLegos).map(LegoFactory).compact().orderBy(['studs', 'price_per_stud'], ['desc' ,'asc']).value();

		const map = new Map(threshold);

		const start = Date.now();

		_.each(greenPlates, (greenPlate) => {
			_(map.map).each((line, y) => (
				_(line).each((stud, x) => {
					if (_(greenPlate.representations).some((representation) => (
						map.tryPlacing(representation, x, y)
					))) {
						greenPlate.quantity += 1;
					}
				})
			));
			console.log();
			console.log(map.toString());
		});

		console.log(`\nTook ${(Date.now() - start) / 1000} s\n`);

		const {quantity, cost} = _.transform(greenPlates, (total, {name, price, quantity}) => {
			const cost = quantity * price;
			total.quantity += quantity;
			total.cost += cost;
			console.log(`${(quantity + " × " + name).padEnd(23)} @ ${price.toFixed(2).padStart(6)} = ${cost.toFixed(2).padStart(6)}`);
		}, {quantity: 0, cost: 0});
		console.log("".padStart(43, "_"));
		console.log(`${(quantity + " ×").padEnd(23)}${cost.toFixed(2).padStart(18)} $`);
	} catch (e) {
		console.error(e);
	}
}

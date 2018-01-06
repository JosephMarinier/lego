const request = require("request-promise-native");
const _ = require("lodash");
const LEGO_BASE_URL = "https://shop.lego.com";
const OAUTH_URL = "https://shop.lego.com";
const PRODUCT_URL = "sh/rest/products/pab/elements";
const DARK_GREEN = 28;

let token;

main();

function defaultOptions() {
	const options = {
		baseUrl: LEGO_BASE_URL, // TODO data?
		method: "GET",
		qs: {
			api_version: 1,
		},
		json: true,
		resolveWithFullResponse: true,
	};

	if (token) {
		_.deepMerge(options, { auth: { bearer: token } });
	}

	return options;
}

async function init() {
	token = await request.defaults(defaultOptions())({
		url: OAUTH_URL,
		method: "POST",
	});
}

async function getProductWithColor(color) {
	const rawData = await request.defaults(defaultOptions())({
		url: PRODUCT_URL, // TODO data?
		qs: {
			exact_color: color,
			offset: 0,
			limit: 53,
		},
	});
	return rawData.elements;
}

async function main() {
	try {
		await init();

		const greenLegos = await getProductWithColor(DARK_GREEN);

		_(greenLegos).map((element) => {
			const { name, price, element_id, design_id } = element;
			if (/^PLATE (\d+)X(\d+)$/.exec(name)) {
				const width = Number(RegExp.$1);
				const length = Number(RegExp.$2);
				const studs = width * length;
				const price_per_stud = price / studs;
				return {
					// element_id,
					// design_id,
					// title,
					width,
					length,
					price,
					studs,
					price_per_stud,
				};
			} else if (/^CORNER PLATE (\d+)X(\d+)X(\d+)$/.exec(name)) {
				const thickness = Number(RegExp.$1);
				const width = Number(RegExp.$2);
				const length = Number(RegExp.$3);
				const studs = thickness * (width + length - thickness);
				const price_per_stud = price / studs;
				return {
					// element_id,
					// design_id,
					// title,
					// thickness,
					width,
					length,
					price,
					studs,
					price_per_stud,
				};
			}
		}).compact().sort((a, b) => (a.price_per_stud - b.price_per_stud) || (b.studs - a.studs)
		).each(console.log
		).reduce(([price_sum, studs_sum], { price, studs }) => [
			price_sum + price,
			studs_sum + studs,
		], [0, 0]).reduce((price_sum, studs_sum) => (price_sum / studs_sum));
	} catch (e) {
		console.error(e);
	}
}

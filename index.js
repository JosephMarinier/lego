const request = require("request-promise-native");
const _ = require("lodash");

main();

async function main() {
	try {
		const token = await request.post({ // TODO getJSON?
			url: "https://shop.lego.com/oauth/accessToken?api_version=1&accept_language=en-CA", // TODO data?
			headers: {
				//accept: "application/json",
			},
			json: true,
		});

		let authorization = "Bearer " + token.access_token;

		const data = await request.get({ // TODO getJSON?
			url: "https://shop.lego.com/sh/rest/products/pab/elements?exact_color=28&offset=0&limit=53&api_version=1&accept_language=en-CA", // TODO data?
			headers: {
				//accept: "application/json",
				authorization,
			},
			json: true,
		});

		_(data.elements).map(function (element) {
			let {name, price, element_id, design_id} = element;
			if (/^PLATE (\d)X(\d)$/.exec(name)) {
				let width = Number(RegExp.$1);
				let length = Number(RegExp.$2);
				let studs = width * length;
				let price_per_stud = price / studs;
				return {
					//element_id,
					//design_id,
					//title,
					width,
					length,
					price,
					studs,
					price_per_stud
				};
			} else if (/^CORNER PLATE (\d)X(\d)X(\d)$/.exec(name)) {
				let thickness = Number(RegExp.$1);
				let width = Number(RegExp.$2);
				let length = Number(RegExp.$3);
				let studs = thickness * (width + length - thickness);
				let price_per_stud = price / studs;
				return {
					//element_id,
					//design_id,
					//title,
					//thickness,
					width,
					length,
					price,
					studs,
					price_per_stud
				};
			}
		}).compact().sort((a, b) => (
			a.price_per_stud - b.price_per_stud
		) || (
			b.studs - a.studs
		)).each(console.log).reduce(([price_sum, studs_sum], {price, studs}) => [
			price_sum + price,
			studs_sum + studs,
		], [0, 0]).reduce((price_sum, studs_sum) => (price_sum / studs_sum));
	} catch (e) {
		console.error(e);
	}
}

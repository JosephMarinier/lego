const _ = require("lodash");
const request = require("request-promise-native");

const LEGO_BASE_URL = "https://shop.lego.com";
const OAUTH_URI = "oauth/accessToken";
const PRODUCT_URI = "sh/rest/products/pab/elements";

const defaultOptions = {
	baseUrl: LEGO_BASE_URL,
	qs: {
		api_version: 1,
		accept_language: "en-CA",
	},
	json: true,
};

class LegoApi {
	static get DARK_GREEN() {
		return 28;
	}

	constructor() {
		this.request = request.defaults(defaultOptions);
		this.token = null;
	}

	async getToken() {
		if (!this.token) {
			const rawResponse = await this.request.post({
				uri: OAUTH_URI,
			});
			this.token = rawResponse.access_token;
		}

		return this.token;
	}

	async getProductWithColor(color) {
		const rawData = await this.request.get({
			auth: {
				bearer: await this.getToken(),
			},
			uri: PRODUCT_URI,
			qs: {
				exact_color: color,
				offset: 0,
				limit: 10000,
			},
		});
		return rawData.elements;
	}
}

module.exports = LegoApi;

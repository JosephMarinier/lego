const _ = require("lodash");
const request = require("request-promise-native");

const LEGO_BASE_URL = "https://shop.lego.com";
const OAUTH_URL = "oauth/accessToken";
const PRODUCT_URL = "sh/rest/products/pab/elements";

const defaultOptions = {
	baseUrl: LEGO_BASE_URL,
	qs: {
		api_version: 1,
		accept_language: "en-CA", // Mandatory or won't be able to ge tthe token
	},
	json: true,
};

class LegoApi {

	constructor() {
		this.requestLego = request.defaults(defaultOptions);
	}

	async setToken() {
		const rawResponse = await this.requestLego.post({
			uri: OAUTH_URL,
		});
		const token = rawResponse.access_token;
		const optionWithToken = _.merge(defaultOptions, { auth: { bearer: token } });
		this.requestLego = request.defaults(optionWithToken);
	}

	async getProductWithColor(color) {
		const rawData = await request.defaults(defaultOptions).get({
			uri: PRODUCT_URL, // TODO data?
			qs: {
				exact_color: color,
				offset: 0,
				limit: 53,
			},
		});
		return rawData.elements;
	}
}

module.exports = LegoApi;

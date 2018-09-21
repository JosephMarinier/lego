const _ = require("lodash");

/**
 * Returns a color object that offers the different functions to color text.
 *	Note that the user does not access this method, but only a color object
 *	obtained by calling this method without parameters. An outside function is
 *	passed only when defining the chaining ".and" object and represents the
 *	change to make to the text for the color before ".and".
 *
 * @param [outside] {function} Optional. Function to apply after, with the result.
 */
function color(outside) {
	return Object.defineProperties(Object.create(null), _.mapValues({
		foreground: 0,
		background: 10
	}, function (groundValue, ground) {
		return {enumerable: true, get: function () {
			var shades = Object.create(null);
			Object.defineProperties(shades, _.mapValues({
				dark: 0,
				light: 60
			}, function (shadeValue, shade) {
				return {enumerable: true, get: function () {
					var colors = Object.create(null);
					Object.defineProperties(colors, _.mapValues({
						black: 0,
						red: 1,
						green: 2,
						yellow: 3,
						blue: 4,
						magenta: 5,
						cyan: 6,
						white: 7
					}, function (colorValue) {
						return {enumerable: true, get: function () {
							function inside(string) {
								return String.prototype.concat(
									'\u001b[',
									30 + groundValue + shadeValue + colorValue,
									'm',
									string,
									'\u001b[',
									// "color" 9 resets this ground to default
									39 + groundValue,
									'm'
								);
							}
							// If an outside function is passed (defining ".and"
							// object), the chain stops and the color function
							// applies inside and outside functions.
							return (_.isFunction(outside) ? function (string) {
								return outside(inside(string));
							// If no outside function are passed (defining new
							// setObject object), the color function is simply
							// the inside function on which ".and" is offered
							// with only the other ground available.
							} : Object.defineProperty(inside, 'and', {
								enumerable: true,
								get: function () {
									// Omit the Getter of the ground yet defined
									return _.omit(color(inside), ground);
								}
							}));
						}};
					}));
					// Offer access to "light.black" by "dark.gray (or grey)"
					// and to "dark.white" by "light.gray (or grey)"
					Object.defineProperties(colors, _.mapValues({
						gray: undefined,
						grey: undefined
					}, function () {
						return {enumerable: true, get: function () {
							var temp = {
								dark: shades.light.black,
								light: shades.dark.white
							};
							return temp[shade];
						}};
					}));
					return colors;
				}};
			}));
			// Offer access to "dark.black" by "black"
			// and to "light.white" by "white"
			Object.defineProperties(shades, _.mapValues({
				black: shades.dark,
				white: shades.light
			}, function (shade, color) {
				return {enumerable: true, get: function () {
					return shade[color];
				}};
			}));
			return shades;
		}};
	}));
}

module.exports = color();
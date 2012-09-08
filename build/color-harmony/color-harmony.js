YUI.add('color-harmony', function (Y, NAME) {

/**
Color provides static methods for color conversion.

For all cases of option.type, valid types are:

- **keyword**:
option.value - must be a keyword in Y.Color.KEYWORDS

- **hex**:
option.value - 3 or 6 character representation with or without a '#' or Array of `[rr, gg, bb]` strings

- **rgb**:
option.value - `rgb(r, g, b)` string or Array of `[r, g, b]` values

- **rgba**:
option.value - `rgba(r, g, b, a)` string or Array of `[r, g, b, a]` values

- **hsl**:
option.value - `hsl(h, s%, l%)` string or Array of `[h, s, l]` values

- **hsla**:
option.value - `hsla(h, s%, l%, a)` string or Array of `[h, s, l, a]` values

In all cases of option.to, valid types are:

- **hex**:
returns `[rr, gg, bb]` or `#rrggbb` if options.css is true

- **rgb**:
returns `[r, g, b]` or `rgb(r, g, b)` if options.css is true

- **rgba**:
returns `[r, g, b, a]` or `rgba(r, g, b, a)` if options.css is true

- **hsl**:
returns `[h, s, l]` or `hsl(h, s%, l%)` if options.css is true

- **hsla**:
returns `[h, s, l, a]` or `hsla(h, s%, l%, a)` if options.css is true

The following is an example of how these features can be used:
    var blue = { type: 'hex', value: '#0000ff', css: true };

    Y.Color.getComplementary(blue); // #ff7700

    Y.Color.getOffset(blue, {h: 10}); // #2a00ff

    Y.Color.getOffset(blue, {l: -10}); // #0000cc


@module color
@submodule color-harmony
@class Harmony
@namespace Color
@since 3.6.1
*/
var HSL = 'hsl',
    RGB = 'rgb',

    SPLIT_OFFSET = 30,
    ANALOGOUS_OFFSET = 10,
    TRIAD_OFFSET = 360/3,
    TETRAD_OFFSET = 360/6,
    SQUARE_OFFSET = 360/4 ,

    DEF_COUNT = 5,
    DEF_OFFSET = 10,

    Color = Y.Color,



    ColorExtras = {

        // Color Groups
        /**
        Returns the complementary color of the color provided

        @public
        @method getComplementary
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getComplementary: function(options) {
            var c = ColorExtras._start(options),
                c1 = Y.merge(c),
                to = options.to || c.type;

            c1.value = c1.value.concat();
            c1 = ColorExtras.getOffset(c1, {h: 180}, true);

            return [
                    ColorExtras._finish(c, to),
                    ColorExtras._finish(c1, to)
                ];

        },

        /**
        Returns an Array of three colors. The first color in the Array
          will be the color passed in. The second two will be split
          complementary colors.

        @public
        @method getSplit
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getSplit: function(options) {
            var c = ColorExtras._start(options),
                c1,
                c2,
                to;

            c = ColorExtras.getOffset(c, {h: 180}, true);

            c1 = Y.merge(c);
            c1.value = c1.value.concat();
            c1 = ColorExtras.getOffset(c1, {h: SPLIT_OFFSET}, true);

            c2 = Y.merge(c);
            c2.value = c2.value.concat();
            c2 = ColorExtras.getOffset(c2, {h: -SPLIT_OFFSET}, true);

            // set base color back to original value
            c = ColorExtras.getOffset(c, {h: 180}, true);

            to = options.to || c.type;

            return [
                ColorExtras._finish(c, to),
                ColorExtras._finish(c1, to),
                ColorExtras._finish(c2, to)
            ];
        },

        /**
        Returns an Array of five colors. The first color in the Array
          will be the color passed in. The remaining four will be
          analogous colors two in either direction from the initially
          provided color.

        @public
        @method getAnalogous
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
          @param {Number} options.offset plus or minus maximum to offset for the analogous color
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getAnalogous: function(options) {
            var c = ColorExtras._start(options),
                c1,
                c2,
                c3,
                c4,
                offset = options.offset || ANALOGOUS_OFFSET,
                to;

            c1 = Y.merge(c);
            c1.value = c1.value.concat();
            c1 = ColorExtras.getOffset(c1, {h: offset}, true);

            c2 = Y.merge(c1);
            c2.value = c2.value.concat();
            c2 = ColorExtras.getOffset(c2, {h: offset}, true);

            c3 = Y.merge(c);
            c3.value = c3.value.concat();
            c3 = ColorExtras.getOffset(c3, {h: -offset}, true);

            c4 = Y.merge(c3);
            c4.value = c4.value.concat();
            c4 = ColorExtras.getOffset(c4, {h: -offset}, true);

            to = options.to || c.type;

            return [
                ColorExtras._finish(c, to),
                ColorExtras._finish(c1, to),
                ColorExtras._finish(c2, to),
                ColorExtras._finish(c3, to),
                ColorExtras._finish(c4, to)
            ];
        },

        /**
        Returns an Array of three colors. The first color in the Array
          will be the color passed in. The second two will be equidistant
          from the start color and each other.

        @public
        @method getTriad
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getTriad: function(options) {
            var c = ColorExtras._start(options),
                c1,
                c2,
                to;

            c1 = Y.merge(c);
            c1.value = c1.value.concat();
            c1 = ColorExtras.getOffset(c1, {h: TRIAD_OFFSET}, true);

            c2 = Y.merge(c1);
            c2.value = c2.value.concat();
            c2 = ColorExtras.getOffset(c2, {h: TRIAD_OFFSET}, true);

            to = options.to || c.type;

            return [
                ColorExtras._finish(c, to),
                ColorExtras._finish(c1, to),
                ColorExtras._finish(c2, to)
            ];
        },

        /**
        Returns an Array of four colors. The first color in the Array
          will be the color passed in. The remaining three colors are
          equidistant offsets from the starting color and each other.

        @public
        @method getTetrad
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getTetrad: function(options) {
            var c = ColorExtras._start(options),
                c1,
                c2,
                c3,
                offset = options.offset || TETRAD_OFFSET,
                to;

            c1 = Y.merge(c);
            c1.value = c1.value.concat();
            c1 = ColorExtras.getOffset(c1, {h: offset}, true);

            c2 = Y.merge(c);
            c2.value = c2.value.concat();
            c2 = ColorExtras.getOffset(c2, {h: 180}, true);

            c3 = Y.merge(c2);
            c3.value = c3.value.concat();
            c3 = ColorExtras.getOffset(c3, {h: offset}, true);

            to = options.to || c.type;

            return [
                ColorExtras._finish(c, to),
                ColorExtras._finish(c1, to),
                ColorExtras._finish(c2, to),
                ColorExtras._finish(c3, to)
            ];
        },

        /**
        Returns an Array of four colors. The first color in the Array
          will be the color passed in. The remaining three colors are
          equidistant offsets from the starting color and each other.

        @public
        @method getSquare
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getSquare: function(options) {
            var c = ColorExtras._start(options),
                c1,
                c2,
                c3,
                to;

            c1 = Y.merge(c);
            c1.value = c1.value.concat();
            c1 = ColorExtras.getOffset(c1, {h: SQUARE_OFFSET}, true);

            c2 = Y.merge(c1);
            c2.value = c2.value.concat();
            c2 = ColorExtras.getOffset(c2, {h: SQUARE_OFFSET}, true);

            c3 = Y.merge(c2);
            c3.value = c3.value.concat();
            c3 = ColorExtras.getOffset(c3, {h: SQUARE_OFFSET}, true);

            to = options.to || c.type;

            return [
                ColorExtras._finish(c, to),
                ColorExtras._finish(c1, to),
                ColorExtras._finish(c2, to),
                ColorExtras._finish(c3, to)
            ];
        },

        /**
        Calculates saturation offsets resulting in a monochromatic Array of values.

        @public
        @method getMonochrome
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
          @param {Number} options.count denotes the requested number of monochromatic values returned
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getMonochrome: function(options) {
            var c = ColorExtras._start(options),
                colors = [],
                i = 0,
                l,
                to,
                count = options.count || DEF_COUNT,
                step,
                _c = Y.merge(c);

            if (count < 2) {
                return options;
            }
            step = 100 / (count - 1);

            for (; i <= 100; i += step) {
                _c.value = _c.value.concat();
                _c.value[2] = Math.max(Math.min(i, 100), 0);
                colors.push(_c);
                _c = Y.merge(_c);
            }

            to = options.to || c.type;

            l = colors.length;

            for (i=0; i<l; i++) {
                colors[i] = ColorExtras._finish(colors[i], to);
            }

            return colors;
        },

        /**
        Creates an Array of similar colors. Returned Array is prepended
           with the color provided followed a number of colors decided
           by options.count

        @public
        @method getSimilar
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
          @param {Number} options.count denotes the requested number of similar values returned
          @param {Number} options.offset plus or minus maximum to offset the hue, saturation, and lightness
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getSimilar: function(options) {
            var c = ColorExtras._start(options),
                colors = [c],
                i = 0,
                l,
                to,
                count = options.count || DEF_COUNT,
                offset = options.offset || DEF_OFFSET,
                _c;

            for (; i < count; i++) {
                _c = Y.merge(c);
                _c.value = _c.value.concat();
                _c = ColorExtras.getOffset(_c, {
                    h: ( Math.random() * (offset * 2)) - offset,
                    s: ( Math.random() * (offset * 2)) - offset,
                    l: ( Math.random() * (offset * 2)) - offset
                }, true);
                colors.push(_c);
            }

            to = options.to || c.type;

            l = colors.length;

            for (i=0; i<l; i++) {
                colors[i] = ColorExtras._finish(colors[i], to);
            }

            return colors;
        },

        /**
        Converts provided color value to the desired return type

        @public
        @method getOffset
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @param {Object} adjust
          @param {Number} [adjust.h] Amount to adjust hue positive or negative
          @param {Number} [adjust.s] Amount to adjust saturation positive or negative
          @param {Number} [adjust.l] Amount to adjust luminance positive or negative
        @param {Boolean} started Denotes if the options pass have already been processed through _start()
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getOffset: function(options, adjust, started) {
            var c = options;

            if (!started) {
                c = ColorExtras._start(options);
            }

            if (adjust.h) {
                c.value[0] = (c.value[0] + adjust.h) % 360;
            }

            if (adjust.s) {
                c.value[1] = Math.max(Math.min(c.value[1] + adjust.s, 100), 0);
            }

            if (adjust.l) {
                c.value[2] = Math.max(Math.min(c.value[2] + adjust.l, 100), 0);
            }

            if (!started) {
                return ColorExtras._finish(c, options.to || c.type);
            }

            return c;
        },

        /**
        Returns 0 - 1 percentage of brightness from black (0) being the
          darkest to white (1) being the brightest.

        @public
        @method getBrightness
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
        @return {Float} 0 - 1
        **/
        getBrightness: function(options) {
            var c = Color._convertTo(options, RGB),
                r = c.value[0],
                g = c.value[1],
                b = c.value[2],
                weights = ColorExtras._brightnessWeights;


            return (Math.sqrt(
                (r * r * weights.r) +
                (g * g * weights.g) +
                (b * b * weights.b)
            ) / 255);
        },

        /**
        Converts provided color value to the desired return type

        @public
        @method getSimilarBrightness
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @param {Object} match
          @param {String} match.type identifies the type of color provided
          @param {String|Array} match.value color value to be converted
        @returns {String|Array} returns Array of values or CSS string if options.css is true
        **/
        getSimilarBrightness: function(options, match){
            var c = Color._convertTo(options, HSL),
                b = ColorExtras.getBrightness(match);

            c.value = c.value.concat();
            c.value[2] = ColorExtras._searchLuminanceForBrightness(c, b, 0, 100);

            c.to = options.to || c.type;

            return Color.convert(c);
        },

        //--------------------
        // PRIVATE
        //--------------------
        /**
        Copy and converts color to additive as most methods need to be additive to begin conversion
        @private
        @method _start
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @return {Object} Converted additive HSL color
        */
        _start: function(options) {
            var c = Color._convertTo(options, HSL);
            c.value = ColorExtras._toSubtractive(c.value);

            return c;
        },

        /**
        Converts color to subtractive then convert to the provided 'to' or back to what it started as
        @private
        @method _finish
        @param {Object} options
          @param {String} options.type identifies the type of color provided
          @param {String|Array} options.value color value to be converted
          @param {String} options.to desired converted color type
          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values
        @return {Object} Converted subtractive color in the options.to format specified or HSL if non is specified
        */
        _finish: function(options, to) {
            options.value = ColorExtras._toAdditive(options.value);
            options.type = HSL;
            options.to = to;

            return Color.convert(options);
        },

        /**
        Adjusts the hue degree from subtractive to additive
        @private
        @method _toAdditive
        @param {Array} hue, saturation, luminance
        @return {Array} Converted additive HSL color
        */
        _toAdditive: function(hsl) {
            var hue = hsl[0];

            if (hue <= 180) {
                hue /= 1.5;
            } else if (hue < 240) {
                hue = 120 + (hue - 180) * 2;
            }

            if (hue < 0) {
                hue += 360;
            }

            hsl[0] = Math.round((hue % 360) * 10)/10;
            return hsl;
        },

        /**
        Adjusts the hue degree from additive to subtractive
        @private
        @method _toSubtractive
        @param {Array} hue, saturation, luminance
        @return {Array} Converted subtractive HSL color
        */
        _toSubtractive: function(hsl) {
            var hue = hsl[0];

            if (hue <= 120) {
                hue *= 1.5;
            } else if (hue < 240) {
                hue = 180 + (hue - 120) / 2;
            }

            if (hue < 0) {
                hue += 360;
            }

            hsl[0] = Math.round((hue % 360) * 10)/10;
            return hsl;
        },

        /**
        Brightness weight factors for perceived brightness calculations

        "standard" values are listed as R: 0.241, G: 0.691, B: 0.068
        These values were changed based on grey scale comparison of hsl
          to new hsl where brightness is said to be within plus or minus 0.01.
        @private
        @property _brightnessWeights
        */
        _brightnessWeights: {
            r: 0.221,
            g: 0.711,
            b: 0.068
        },

        /**
        Calculates the luminance as a mid range between the min and max
          to match the brightness level provided
        @private
        @method _searchLuminanceForBrightness
        @param {Object} color
        @param {Number} brightness Brightness of color to match
        @param {Number} min Minimum value of luminance. Used for binary search
        @param {Number} max Maximum value of luminance. Used for binary search
        @return {Number} luminance value for color
        */
        _searchLuminanceForBrightness: function(color, brightness, min, max) {
            var luminance = (max + min) / 2,
                b;

            color.value[2] = luminance;
            b = ColorExtras.getBrightness(color);

            if (b + 0.01 > brightness && b - 0.01 < brightness) {
                return luminance;
            } else if (b > brightness) {
                return ColorExtras._searchLuminanceForBrightness(color, brightness, min, luminance);
            } else {
                return ColorExtras._searchLuminanceForBrightness(color, brightness, luminance, max);
            }
        }
    };

Y.Color = Y.mix(Y.Color, ColorExtras);


}, '@VERSION@', {"requires": ["color"]});

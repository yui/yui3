/**
Color provides static methods for color conversion.

For all cases of option.type, valid types are:

- **keyword**:
option.value - must be a keyword in Y.Color.KEYWORDS

- **hex**:
option.value - 3 or 6 character representation with or without a '#' or array of [rr, gg, bb] strings

- **rgb**:
option.value - rgb(r, g, b) string or array of [r, g, b] values

- **rgba**:
option.value - rgba(r, g, b, a) string or array of [r, g, b, a] values

- **hsl**:
option.value - hsl(h, s%, l%) string or array of [h, s, l] values

- **hsla**:
option.value - hsla(h, s%, l%, a) string or array of [h, s, l, a] values

In all cases of option.to, valid types are:

- **hex**:
returns [rr, gg, bb] or #rrggbb if options.css is true

- **rgb**:
returns [r, g, b] or rgb(r, g, b) if options.css is true

- **rgba**:
returns [r, g, b, a] or rgba(r, g, b, a) if options.css is true

- **hsl**:
returns [h, s, l] or hsl(h, s%, l%) if options.css is true

- **hsla**:
returns [h, s, l, a] or hsla(h, s%, l%, a) if options.css is true

The following is an example of how these features can be used:

    Y.Color.toRGB('f00'); // rgb(255, 0, 0)

    Y.Color.toHex({
        type: 'rgb',
        value: [255, 255, 0]
    }); // ["ff", "ff", "00"]

    Y.Color.convert({
        type: 'hsl',
        value: [240, 100, 50],
        to: 'hex',
        css: true
    }); // #0000ff


@module color
@class Color
@since 3.6.1
**/
var KEYWORDS = Y.Color.KEYWORDS,
    // regular expressions used for validation and identification
    REGEX_HEX = Y.Color.re_hex,
    REGEX_HEX3 = Y.Color.re_hex3,
    REGEX_RGB = Y.Color.re_RGB,
    REGEX_RGBA = /rgba\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}), ?([.0-9]{1,3})\)/,
    REGEX_HSL = /hsl\(([0-9]{1,3}), ?([0-9]*\.?[0-9]+)%, ?([0-9]*\.?[0-9]+)%\)/,
    REGEX_HSLA = /hsla\(([0-9]{1,3}), ?([0-9]*\.?[0-9]+)%, ?([0-9]*\.?[0-9]+)%, ?([.0-9]{1,3})\)/,

    HEX = 'hex',
    RGB = 'rgb',
    HSL = 'hsl',

Color = {
    //----------------------------
    // C O N S T A N T S
    //---------------------------
    REGEX: {
        'hex': REGEX_HEX,
        'hex3': REGEX_HEX3,
        'rgbcss': REGEX_RGB,
        'rgbacss': REGEX_RGBA,
        'hslcss': REGEX_HSL,
        'hslacss': REGEX_HSLA
    },

    //----------------------------
    // P U B L I C   A P I
    //---------------------------
    /**
    Converts provided color value to the desired return type

    @public
    @method convert
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {String|Array} options.value color value to be converted
      @param {String} options.to desired converted color type
      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values
    @see toHex
    @see toRGB
    @see toRGBA
    @see toHSL
    @see toHSLA
    @returns {String|Array} returns array of values or CSS string if options.css is true
    **/
    convert: function(options) {
        switch (options.to) {
            case 'hex': return Color.toHex(options);
            case 'rgb': return Color.toRGB(options);
            case 'rgba': return Color.toRGBA(options);
            case 'hsl': return Color.toHSL(options);
            case 'hsla': return Color.toHSLA(options);
            default: Y.log('options.to is not a valid type.', 'error', 'Y.Color::convert');
        }
    },

    /**
    Converts provided color value to an array of hex values or hash prepended string

    @public
    @method toHex
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {String|Array} options.value color value to be converted
      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values
    @returns {String|Array} returns array of values or CSS string if options.css is true
    **/
    toHex: function(options) {
        if (Y.Lang.isString(options)) { // Preserve backwards compatability
            options = {
                value: options,
                css: true
            };
        }
        options = Color._convertTo(options, HEX);
        if (options.css) {
            return '#' + options.value.join('');
        }
        return options.value;
    },

    /**
    Converts provided color value to an array of RGB values or rgb() string

    @public
    @method toRGB
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {String|Array} options.value color value to be converted
      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values
    @returns {String|Array} returns array of values or CSS string if options.css is true
    **/
    toRGB: function(options) {
        if (Y.Lang.isString(options)) { // Preserve backwards compatability
            options = {
                value: options,
                css: true
            };
        }
        options = Color._convertTo(options, RGB);
        if (options.css) {
            return 'rgb(' + options.value.join(', ') + ')';
        }
        return options.value;
    },

    /**
    Converts provided color value to an array of RGBA values or rgba() string. If no alpha value is provided in the original color, will return 1 as the alpha value.

    @public
    @method toRGBA
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {String|Array} options.value color value to be converted
      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values
    @returns {String|Array} returns array of values or CSS string if options.css is true
    **/
    toRGBA: function(options) {
        options = Color._convertTo(options, RGB);
        options.value.push(Y.Lang.isNumber(options.opacity) ? options.opacity : 1);
        if (options.css) {
            return 'rgba(' + options.value.join(', ') + ')';
        }
        return options.value;
    },

    /**
    Converts provided color value to an array of HSL values or hsl() string

    @public
    @method toHSL
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {String|Array} options.value color value to be converted
      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values
    @returns {String|Array} returns array of values or CSS string if options.css is true
    **/
    toHSL: function(options) {
        options = Color._convertTo(options, HSL);
        options.value[1] = Math.round( options.value[1] * 100 ) / 100;
        options.value[2] = Math.round( options.value[2] * 100 ) / 100;

        if (options.css) {
            options.value[1] += '%';
            options.value[2] += '%';
            return 'hsl(' + options.value.join(', ') + ')';
        }
        return options.value;
    },

    /**
    Converts provided color value to an array of HSLA values or hsla() string. If no alpha value is provided in the original color, will return 1 as the alpha value.

    @public
    @method toHSLA
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {String|Array} options.value color value to be converted
      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values
    @returns {String|Array} returns array of values or CSS string if options.css is true
    **/
    toHSLA: function(options) {
        options = Color._convertTo(options, HSL);
        options.value.push(Y.Lang.isNumber(options.opacity) ? options.opacity : 1);
        if (options.css) {
            options.value[1] += '%';
            options.value[2] += '%';
            return 'hsla(' + options.value.join(', ') + ')';
        }
        return options.value;
    },

    //----------------------------
    // P R O T E C T E D
    //---------------------------
    /**
    Attempts to find the type of the provided color value. Updates the
      options object if found.

    @protected
    @method _findType
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {Array} options.value color value to be converted
      @param {String} options.to desired converted color type
    @returns {Object}
    **/
    _findType: function(options) {
        var val = options.value;

        if (Y.Lang.isArray(val)) {
            Y.log('Cannot determine type of value when providing an array.', 'error', 'Y.Color::_findType');
            return options;
        }

        if (KEYWORDS[val]) {
            options.type = 'keyword';
        } else if (REGEX_RGB.exec(val)) {
            options.type = RGB;
        } else if (REGEX_RGBA.exec(val)) {
            options.type = RGB + 'a';
        } else if (REGEX_HSL.exec(val)) {
            options.type = HSL;
        } else if (REGEX_HSLA.exec(val)) {
            options.type = HSL + 'a';
        } else if (REGEX_HEX.exec(val) || REGEX_HEX3.exec(val)) {
            options.type = HEX;
        }

        return options;
    },

    /**
    Converts string and makes any adjustments to values array if
      needed. Prepares value to be used with _convertTo.
      Modifies the options object.

    @protected
    @method _toArray
    @see _convertTo
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {Array} options.value color value to be converted
      @param {String} options.to desired converted color type
    @returns {Object}
    **/
    _toArray: function(options) {
        var arr = [],
            matches = null,
            type = null,
            val = options.value;

        if (options.type === 'auto' || typeof options.type === 'undefined') {
            options = Color._findType(options);
        }
        type = options.type.toLowerCase();
        val = (Y.Lang.isString(val)) ? val.toLowerCase() : val;

        switch(type) {
            case 'keyword':
                val = KEYWORDS[val];
                type = 'hex';
                // break; overflow intentional
            case 'hex':
                matches = REGEX_HEX.exec(val);
                if (matches) {
                    arr = [matches[2], matches[3], matches[4]];
                    break;
                }
                matches = REGEX_HEX3.exec(val);
                if (matches) {
                    arr = [
                        matches[2].toString() + matches[2],
                        matches[3].toString() + matches[3],
                        matches[4].toString() + matches[4]
                        ];
                }
                break;
            case 'rgb':
            case 'rbgcss':
                if (Y.Lang.isArray(val) && val.length === 3) {
                    arr = val.concat();
                    break;
                }
                matches = REGEX_RGB.exec(val);
                if (matches) {
                    arr = [ matches[1], matches[2], matches[3] ];
                }
                break;
            case 'rgba':
            case 'rgbacss':
                if (Y.Lang.isArray(val) && val.length === 4) {
                    options.opacity = val.pop();
                    arr = val.concat();
                    break;
                }
                matches = REGEX_RGBA.exec(val);
                if (matches) {
                    options.opacity = matches[4];
                    arr = [ matches[1], matches[2], matches[3] ];
                }
                break;
            case 'hsl':
            case 'hslcss':
                if (Y.Lang.isArray(val) && val.length === 3) {
                    arr = val.concat();
                    break;
                }
                matches = REGEX_HSL.exec(val);
                if (matches) {
                    arr = [ matches[1], matches[2], matches[3] ];
                }
                break;
            case 'hsla':
            case 'hslacss':
                if (Y.Lang.isArray(val) && val.length === 4) {
                    options.opacity = val.pop();
                    arr = val.concat();
                    break;
                }
                matches = REGEX_HSLA.exec(val);
                if (matches) {
                    options.opacity = matches[4];
                    arr = [ matches[1], matches[2], matches[3] ];
                }
                break;
            default:
                Y.log('Type not found.', 'error', 'Y.Color::_toArray');
                return options;
        }

        options.type = type.replace(/a?(css)?$/,'');
        options.value = arr;

        return options;
    },

    /**
    Converts the color value from the adjusted type to desired return
      values. Updates options.type with converted type. Updates
      options.value with new value array.

    @protected
    @method _convertTo
    @param {Object} options
      @param {String} options.type identifies the type of color provided
      @param {Array} options.value color value to be converted
      @param {String} options.to desired converted color type
    @param {String} [to] (Optional) Overrides options.to if defined
    @returns {Object}
    **/
    _convertTo: function(options, to) {
        var  _options = Y.mix({}, options),
            from,
            val;

        _options.to = to || _options.to;
        _options = Color._toArray(_options);

        from = _options.type;
        val = _options.value;
        to = _options.to;

        if (from === to) {
            return _options;
        }

        if (from === HEX) {
            val = Color._fromHexToRGB(val);
            if (to === HSL) {
                val = Color._fromRGBToHSL(val);
            }
        } else if (from === RGB) {
            if (to === HEX) {
                val = Color._fromRGBToHex(val);
            } else if (to === HSL) {
                val = Color._fromRGBToHSL(val);
            }
        } else if (from === HSL) {
            val = Color._fromHSLToRGB(val);
            if (to === HEX) {
                val = Color._fromRGBToHex(val);
            }
        }

        _options.type = to;
        _options.value = val;
        return _options;
    },


    /**
    Creates an array ([h,s,l]) from the provided value array ([r,g,b])

    @protected
    @method _fromRGBToHSL
    @param {array} [val] color value to be converted
    @returns {array}
    **/
    _fromRGBToHSL: function(val) {
        // assume input is [r,g,b]
        // TODO: Find legals for use of formula
        var r = parseFloat(val[0], 10) / 255,
            g = parseFloat(val[1], 10) / 255,
            b = parseFloat(val[2], 10) / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h,
            s,
            l,
            sub = max - min,
            sum = max + min;

        // hue
        if (sub === 0) {
            h = 0;
        } else if (r === max) {
            h = ((60 * (g - b) / sub) + 360) % 360;
        } else if (g === max) {
            h = (60 * (b - r) / sub) + 120;
        } else {
            h = (60 * (r - g) / sub) + 240;
        }

        // lightness
        l = sum / 2;

        // saturation
        if (l === 0 || l === 1) {
            s = l;
        } else if (l <= 0.5) {
            s = sub / sum;
        } else {
            s = sub / (2 - sum);
        }

        // clean up hsl
        h = Math.round(h);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return [h, s, l];
    },
    /**
    Creates an array ([r,g,b]) from the provided value array ([h,s,l])

    @protected
    @method _fromRGBToHSL
    @param {array} [val] color value to be converted
    @returns {array}
    **/
    _fromHSLToRGB: function(val) {
        // assume input is [h, s, l]
        // TODO: Find legals for use of formula
        var h = parseInt(val[0], 10) /360,
            s = parseInt(val[1], 10) / 100,
            l = parseInt(val[2], 10) / 100,
            r,
            g,
            b,
            p,
            q;

        if (l <= 0.5) {
            q = l * (s + 1);
        } else {
            q = (l + s) - (l * s);
        }

        p = 2 * l - q;

        r = Math.round(Color._hueToRGB(p, q, h + 1/3) * 255);
        g = Math.round(Color._hueToRGB(p, q, h) * 255);
        b = Math.round(Color._hueToRGB(p, q, h - 1/3) * 255);

        return [r, g, b];
    },

    /**
    Converts the HSL hue to the different channels for RGB

    @protected
    @method _hueToRGB
    @param {Number} [p]
    @param {Number} [q]
    @param {Number} [hue]
    @return {Number} value for requested channel
    **/
    _hueToRGB: function(p, q, hue) {
        // TODO: Find legals for use of formula
        if (hue < 0) {
            hue += 1;
        } else if (hue > 1) {
            hue -= 1;
        }

        if (hue * 6 < 1) {
            return p + (q - p) * 6 * hue;
        }
        if (hue * 2 < 1) {
            return q;
        }
        if (hue * 3 < 2) {
            return p + (q - p) * (2/3 - hue) * 6;
        }
        return p;
    }
};

Y.mix(Color, Y.Color);
Y.Color = Color;

/**
Color provides static methods for color conversion.

    Y.Color.toRGB('f00'); // rgb(255, 0, 0)

    Y.Color.toHex('rgb(255, 255, 0)'); // #ffff00


@module color
@submodule color-base
@class Base
@namespace Color
@since 3.x
**/

var REGEX_HEX = /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/,
    REGEX_HEX3 = /^#?([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})/,
    REGEX_RGB = /rgba?\(([\d]{1,3}), ?([\d]{1,3}), ?([\d]{1,3}),? ?([.\d]*)?\)/,
    TYPES = { 'rgb': 'rgb', 'rgba': 'rgba'};


Y.Color = {
    /**
    @static
    @property KEYWORDS
    @type Object
    @since 3.x
    **/
    KEYWORDS: {'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff', 'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f', 'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0', 'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'},

    /**
    @static
    @property REGEX_HEX
    @type RegExp
    @default /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/
    @since 3.x
    **/
    REGEX_HEX: REGEX_HEX,

    /**
    @static
    @property REGEX_HEX3
    @type RegExp
    @default /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})/
    @since 3.x
    **/
    REGEX_HEX3: REGEX_HEX3,

    /**
    @static
    @property REGEX_RGB
    @type RegExp
    @default /rgba?\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}),? ?([.0-9]{1,3})?\)/
    @since 3.x
    **/
    REGEX_RGB: REGEX_RGB,

    re_RGB: REGEX_RGB,

    re_hex: REGEX_HEX,

    re_hex3: REGEX_HEX3,

    /**
    @static
    @property STR_HEX
    @type String
    @default #{*}{*}{*}
    @since 3.x
    **/
    STR_HEX: '#{*}{*}{*}',

    /**
    @static
    @property STR_RGB
    @type String
    @default rgb({*}, {*}, {*})
    @since 3.x
    **/
    STR_RGB: 'rgb({*}, {*}, {*})',

    /**
    @static
    @property STR_RGBA
    @type String
    @default rgba({*}, {*}, {*}, {*})
    @since 3.x
    **/
    STR_RGBA: 'rgba({*}, {*}, {*}, {*})',

    /**
    @static
    @property TYPES
    @type Object
    @default {'rgb':'rgb', 'rgba':'rgba'}
    @since 3.x
    **/
    TYPES: TYPES,

    /**
    @public
    @method convert
    @param {String} str
    @param {String} to
    @returns {String}
    @since 3.x
    **/
    convert: function (str, to) {
        to = to.toLowerCase();
        to[0] = to[0].toUpperCase();
        var clr = Y.Color['to' + to](str);
        return clr.toLowerCase();
    },

    /**
    Converts provided color value to a hex value string
    @public
    @method toHex
    @param {String} str Hex or RGB value string
    @returns {String} returns array of values or CSS string if options.css is true
    @since 3.x
    **/
    toHex: function (str) {
        var clr = Y.Color._convertTo(str, 'hex');
        return clr.toLowerCase();
    },

    /**
    Alias for toRgb
    @public
    @method toRGB
    @param {String} str Hex or RGB value string
    @returns {String}
    @see toRgb
    @since 3.x
    **/
    toRGB: function (str) {
        return Y.Color.toRgb(str);
    },

    /**
    Converts provided color value to an RGB value string
    @public
    @method toRgb
    @param {String} str Hex or RGB value string
    @returns {String}
    @since 3.x
    **/
    toRgb: function (str) {
        var clr = Y.Color._convertTo(str, 'rgb');
        return clr.toLowerCase();
    },

    /**
    Alias for toRgba
    @public
    @method toRGBA
    @param {String} str Hex or RGB value string
    @returns {String}
    @see toRgba
    @since 3.x
    **/
    toRGBA: function (str) {
        return Y.Color.toRgba(str);
    },

    /**
    Converts provided color value to an RGB value string
    @public
    @method toRgba
    @param {String} str Hex or RGB value string
    @returns {String}
    @since 3.x
    **/
    toRgba: function (str) {
        var clr = Y.Color._convertTo(str, 'rgba' );
        return clr.toLowerCase();
    },

    /**
    Converts the provided color string to an array of values
    @public
    @method toArray
    @param {String} str
    @returns {Array}
    @since 3.x
    **/
    toArray: function(str) {
        // parse with regex and return "matches" array
        var type = Y.Color.findType(str).toUpperCase(),
            arr;

        if (type === 'HEX' && str.length < 5) {
            type = 'HEX3';
        }

        if (type[type.length - 1] === 'A') {
            type = type.slice(0, -1);
        }
        if (Y.Color['REGEX_' + type]) {
            arr = Y.Color['REGEX_' + type].exec(str);
            arr.shift();

            if (typeof arr[arr.length -1] === 'undefined') {
                arr[arr.length - 1] = 1;
            }
            return arr;
        }

    },

    /**
    Converts the array of values to a string based on the provided template.
        Replace is used to specify replace points in the template.
    @public
    @method fromArray
    @param {Array} arr
    @param {String} template
    @param {String} [replace]
    @returns {String}
    @since 3.x
    **/
    fromArray: function(arr, template, replace) {
        arr = arr.concat();

        if (typeof template === 'undefined') {
            return arr.join(', ');
        }

        replace = replace || '{*}';

        var index;

        if (arr.length === 3 && template.match(/\{\*\}/g).length === 4) {
            arr.push(1);
        }

        while ( template.indexOf(replace) >= 0 && arr.length > 0) {
            template = template.replace(replace, arr.shift());
        }

        return template;
    },

    /**
    Finds the value type based on the str value provided.
    @public
    @method findType
    @param {String} str
    @returns {String}
    @since 3.x
    **/
    findType: function (str) {
        if (Y.Color.KEYWORDS[str]) {
            return 'keyword';
        }

        var index = str.indexOf('('),
            key;

        if (index > 0) {
            key = str.substr(0, index);
        }

        if (Y.Color.TYPES[key]) {
            return Y.Color.TYPES[key];
        }

        return 'hex';

    }, // return 'keyword', 'hex', 'rgb'

    /**
    Retrives the alpha channel from the provided string. If no alpha
        channel is present, `1` will be returned.
    @protected
    @method _getAlpha
    @param {String} clr
    @return {Number}
    @since 3.x
    **/
    _getAlpha: function (clr) {
        var alpha,
            arr = Y.Color.toArray(clr);

        if (arr.length > 3) {
            alpha = arr.pop();
        }

        return +alpha || 1;
    },

    /**
    Returns the hex value string if found in the KEYWORDS object
    @protected
    @method _keywordToHex
    @param {String} clr
    @return {String}
    @since 3.x
    **/
    _keywordToHex: function (clr) {
        if (Color.KEYWORDS[clr]) {
            return Color.KEYWORDS[clr];
        }
    },

    /**
    Converts the provided color string to the value type provided as `to`
    @protected
    @method _convertTo
    @param {String} clr
    @param {String} to
    @return {String}
    @since 3.x
    **/
    _convertTo: function(clr, to) {
        var from = Y.Color.findType(clr),
            originalTo = to,
            needsAlpha,
            alpha;

        if (from === 'keyword') {
            clr = Y.Color._keywordToHex(clr);
            from = 'hex';
        }

        if (from === 'hex' && clr.length < 5) {
            if (clr[0] === '#') {
                clr = clr.substr(1);
            }

            clr = '#' + clr[0] + clr[0] + clr[1] + clr[1] + clr[2] + clr[2];
        }

        if (from === to) {
            return clr;
        }

        if (from[from.length - 1] === 'a') {
            from = from.slice(0, -1);
        }

        needsAlpha = (to[to.length - 1] === 'a');
        if (needsAlpha) {
            to = to.slice(0, -1);
            alpha = Y.Color._getAlpha(clr);
        }

        // check to see if need conversion to rgb first
        // convertions are: hex <-> rgb <-> hsl
        if (from !== 'rgb' && to !== 'rgb') {
            clr = Y.Color['_' + from + 'ToRgb'](clr);
            from = 'rgb';
        }

        var ucTo = to.toLowerCase();
        ucTo = ucTo[0].toUpperCase() + ucTo.substr(1);

        if (Y.Color['_' + from + 'To' + ucTo ]) {
            clr = Y.Color['_' + from + 'To' + ucTo](clr, needsAlpha);
        }

        // process clr from arrays to strings after conversions if alpha is needed
        if (needsAlpha && Y.Color['STR_' + originalTo.toUpperCase()]) {
            clr.push(alpha);
            clr = Y.Color.fromArray(clr, Y.Color['STR_' + originalTo.toUpperCase()]);
        }

        return clr;
    },

    /**
    Processes the hex string into r, g, b values. Will return values as
        an array, or as an rgb string.
    @protected
    @method _hexToRgb
    @param {String} str
    @param {Boolean} [toArray]
    @return {String|Array}
    @since 3.x
    **/
    _hexToRgb: function (str, toArray) {
        var r, g, b;

        if (str.charAt(0) === '#') {
            str = str.substr(1);
        }

        str = parseInt(str, 16);

        r = str >> 16;
        g = str >> 8 & 0xFF;
        b = str & 0xFF;

        if (toArray) {
            return [r, g, b];
        }

        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    },

    /**
    Processes the rgb string into r, g, b values. Will return values as
        an array, or as a hex string.
    @protected
    @method _rgbToHex
    @param {String} str
    @param {Boolean} [toArray]
    @return {String|Array}
    @since 3.x
    **/
    _rgbToHex: function (str, toArray) {
        var rgb = Y.Color.toArray(str),
            hex = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);

        hex = (+hex).toString(16);

        while (hex.length < 6) {
            hex = '0' + hex;
        }

        if (toArray) {
            return [hex.substr(0,2), hex.substr(2,2), hex.substr(4,2)];
        }

        return '#' + hex;
    }

};


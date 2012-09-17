var REGEX_HEX = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/,
    REGEX_HEX3 = /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})/,
    REGEX_RGB = /rgba?\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}),? ?([.0-9]{1,3})?\)/;

Y.Color = {
    KEYWORDS: {'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff', 'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f', 'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0', 'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'},

    REGEX_HEX: REGEX_HEX,

    REGEX_HEX3: REGEX_HEX3,

    REGEX_RGB: REGEX_RGB,

    re_RGB: REGEX_RGB,

    re_hex: REGEX_HEX,

    re_hex3: REGEX_HEX3,

    TEMP_HEX: '#{*}{*}{*}',

    TEMP_RGB: 'rgb({*}, {*}, {*})',

    TEMP_RGBA: 'rgba({*}, {*}, {*}, {*})',

    convert: function (str, to) {
        to = to.toLowerCase();
        to[0] = to[0].toUpperCase();
        var clr = Y.Color['to' + to](str);
        return clr.toLowerCase();
    },

    toHex: function (str) {
        var clr = Y.Color._convertTo(str, 'hex');
        return clr.toLowerCase();
    },

    toRGB: function (str) {
        return Y.Color.toRgb(str);
    },

    toRgb: function (str) {
        var clr = Y.Color._convertTo(str, 'rgb');
        return clr.toLowerCase();
    },

    toRGBA: function (str) {
        return Y.Color.toRgba(str);
    },

    toRgba: function (str) {
        var clr = Y.Color._convertTo(str, 'rgba' );
        return clr.toLowerCase();
    },

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

    findType: function (str) {
        if (Y.Color.KEYWORDS[str]) {
            return 'keyword';
        }

        if (str.indexOf('rgba') === 0) {
            return 'rgba';
        } else if (str.indexOf('rgb') === 0) {
            return 'rgb';
        } else {
            return 'hex';
        }
    }, // return 'keyword', 'hex', 'rgb', 'hsl'

    _getAlpha: function (clr) {
        var alpha,
            arr = Y.Color.toArray(clr);

        if (arr.length > 3) {
            alpha = arr.pop();
        }

        return alpha || 1;
    },

    _keywordToHex: function (clr) {
        if (Color.KEYWORDS[clr]) {
            return Color.KEYWORDS[clr];
        }
    },

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

            clr = '#' + clr[0] + clr [0] + clr[1] + clr[1] + clr[2] + clr[2];
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
        if (needsAlpha && Y.Color['TEMP_' + originalTo.toUpperCase()]) {
            clr.push(alpha);
            clr = Y.Color.fromArray(clr, Y.Color['TEMP_' + originalTo.toUpperCase()]);
        }

        return clr;
    },

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


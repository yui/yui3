/**
Color provides static methods for color conversion.

<p>For all cases of option.type, valid types are:</p><dl>
<dt>keyword</dt>
    <dd>option.value - must be a keyword in Y.Color.KEYWORDS</dd>
<dt>hex</dt>
    <dd>option.value - 3 or 6 character representation with or without a '#' or array of [rr, gg, bb] strings</dd>
<dt>rgb</dt>
    <dd>option.value - rgb(r, g, b) string or array of [r, g, b] values</dd>
<dt>rgba</dt>
    <dd>option.value - rgba(r, g, b, a) string or array of [r, g, b, a] values</dd>
</dl>

<p>For all cases of option.to, valid types are:</p><dl>
<dt>hex</dt>
    <dd>returns [rr, gg, bb] or #rrggbb if options.css is true</dd>
<dt>rgb</dt>
    <dd>returns [r, g, b] or rgb(r, g, b) if options.css is true</dd>
<dt>rgba</dt>
    <dd>returns [r, g, b, a] or rgba(r, g, b, a) if options.css is true</dd>
</dl>

<pre><code>
Y.Color.toRGB('f00'); // rgb(255, 0, 0)

Y.Color.toHex({
    type: 'rgb',
    value: [255, 255, 0]
}); // ["ff", "ff", "00"]
</code></pre>
@module color
@submodule color-base
@class Base
@namespace Color
@since 3.6.1
**/
var KEYWORDS = {'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff', 'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f', 'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0', 'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'},
    // regular expressions used for validation and identification
    REXP_HEX = /^(#?)([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/,
    REXP_HEX3 = /^(#?)([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})/,
    REXP_RGB = /^rgb\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3})\)/,

    HEX = 'hex',
    RGB = 'rgb',
    HSL = 'hsl',

Color = {

    KEYWORDS: KEYWORDS,

    re_RGB: REXP_RGB,

    re_hex: REXP_HEX,

    re_hex3: REXP_HEX3,

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
        var val = options.value,
            type = options.type;

        if (KEYWORDS[val]) {
            type = 'keyword';
        } else if (REXP_RGB.exec(val)) {
            type = RGB;
        } else if (REXP_HEX.exec(val) || REXP_HEX3.exec(val)) {
            type = HEX;
        }

        options.type = type;
        return options;
    },

    /**
    Converts string and makes any adjustments to values array if
      needed. Prepares value to be used with _convertTo.
      Modifies the options object.

    @protected
    @method _toArray
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
                matches = REXP_HEX.exec(val);
                if (matches) {
                    arr = [matches[2], matches[3], matches[4]];
                    break;
                }
                matches = REXP_HEX3.exec(val);
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
                    arr = val;
                    break;
                }
                matches = REXP_RGB.exec(val);
                if (matches) {
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
            if (to === RGB) {
                val = Color._fromHexToRGB(val);
            }
        } else if (from === RGB) {
            if (to === HEX) {
                val = Color._fromRGBToHex(val);
            }
        }

        _options.type = to;
        _options.value = val;
        return _options;
    },

    /**
    Creates an array ([r,g,b]) from the provided value array ([rr,gg,bb])

    @protected
    @method _fromHexToRGB
    @param {array} [val] color value to be converted
    @returns {array}
    **/
    _fromHexToRGB: function(val) {
        // assume val is [rr,gg,bb]
        return [
            parseInt(val[0], 16),
            parseInt(val[1], 16),
            parseInt(val[2], 16)
        ];
    },

    /**
    Creates an array ([rr,gg,bb]) from the provided value array ([r,g,b])

    @protected
    @method _fromRGBToHex
    @param {array} [val] color value to be converted
    @returns {array}
    **/
    _fromRGBToHex: function(val) {
        // assume val is [r,g,b]
        var r = parseInt(val[0], 10).toString(16),
            g = parseInt(val[1], 10).toString(16),
            b = parseInt(val[2], 10).toString(16);

        while (r.length < 2) { r = '0' + r; }
        while (g.length < 2) { g = '0' + g; }
        while (b.length < 2) { b = '0' + b; }

        return [r, g, b];
    }

};

Y.Color = Color;
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/color-base/color-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/color-base/color-base.js",
    code: []
};
_yuitest_coverage["build/color-base/color-base.js"].code=["YUI.add('color-base', function (Y, NAME) {","","/**","Color provides static methods for color conversion.","","For all cases of option.type, valid types are:","","- **keyword**:","option.value - must be a keyword in Y.Color.KEYWORDS","","- **hex**:","option.value - 3 or 6 character representation with or without a '#' or array of [rr, gg, bb] strings","","- **rgb**:","option.value - rgb(r, g, b) string or array of [r, g, b] values","","- **rgba**:","option.value - rgba(r, g, b, a) string or array of [r, g, b, a] values","","- **hsl**:","option.value - hsl(h, s%, l%) string or array of [h, s, l] values","","- **hsla**:","option.value - hsla(h, s%, l%, a) string or array of [h, s, l, a] values","","In all cases of option.to, valid types are:","","- **hex**:","returns [rr, gg, bb] or #rrggbb if options.css is true","","- **rgb**:","returns [r, g, b] or rgb(r, g, b) if options.css is true","","- **rgba**:","returns [r, g, b, a] or rgba(r, g, b, a) if options.css is true","","- **hsl**:","returns [h, s, l] or hsl(h, s%, l%) if options.css is true","","- **hsla**:","returns [h, s, l, a] or hsla(h, s%, l%, a) if options.css is true","","The following is an example of how these features can be used:","    Y.Color.toRGB('f00'); // rgb(255, 0, 0)","","    Y.Color.toHex({","        type: 'rgb',","        value: [255, 255, 0]","    }); // [\"ff\", \"ff\", \"00\"]","","","@module color","@submodule color-base","@class Base","@namespace Color","@since 3.6.1","**/","var KEYWORDS = {'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff', 'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f', 'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0', 'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'},","    // regular expressions used for validation and identification","    REGEX_HEX = /^(#?)([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/,","    REGEX_HEX3 = /^(#?)([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})/,","    REGEX_RGB = /^rgb\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3})\\)/,","","    HEX = 'hex',","    RGB = 'rgb',","    HSL = 'hsl',","","Color = {","","    KEYWORDS: KEYWORDS,","","    re_RGB: REGEX_RGB,","","    re_hex: REGEX_HEX,","","    re_hex3: REGEX_HEX3,","","    /**","    Converts provided color value to an array of hex values or hash prepended string","","    @public","    @method toHex","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {String|Array} options.value color value to be converted","      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values","    @returns {String|Array} returns array of values or CSS string if options.css is true","    **/","    toHex: function(options) {","        if (Y.Lang.isString(options)) { // Preserve backwards compatability","            options = {","                value: options,","                css: true","            };","        }","        options = Color._convertTo(options, HEX);","        if (options.css) {","            return '#' + options.value.join('');","        }","        return options.value;","    },","","    /**","    Converts provided color value to an array of RGB values or rgb() string","","    @public","    @method toRGB","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {String|Array} options.value color value to be converted","      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values","    @returns {String|Array} returns array of values or CSS string if options.css is true","    **/","    toRGB: function(options) {","        if (Y.Lang.isString(options)) { // Preserve backwards compatability","            options = {","                value: options,","                css: true","            };","        }","        options = Color._convertTo(options, RGB);","        if (options.css) {","            return 'rgb(' + options.value.join(', ') + ')';","        }","        return options.value;","    },","","    //----------------------------","    // P R O T E C T E D","    //---------------------------","","","    /**","    Attempts to find the type of the provided color value. Updates the","      options object if found.","","    @protected","    @method _findType","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {Array} options.value color value to be converted","      @param {String} options.to desired converted color type","    @returns {Object}","    **/","    _findType: function(options) {","        var val = options.value,","            type = options.type;","","        if (KEYWORDS[val]) {","            type = 'keyword';","        } else if (REGEX_RGB.exec(val)) {","            type = RGB;","        } else if (REGEX_HEX.exec(val) || REGEX_HEX3.exec(val)) {","            type = HEX;","        }","","        options.type = type;","        return options;","    },","","    /**","    Converts string and makes any adjustments to values array if","      needed. Prepares value to be used with _convertTo.","      Modifies the options object.","","    @protected","    @method _toArray","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {Array} options.value color value to be converted","      @param {String} options.to desired converted color type","    @returns {Object}","    **/","    _toArray: function(options) {","        var arr = [],","            matches = null,","            type = null,","            val = options.value;","","        if (options.type === 'auto' || typeof options.type === 'undefined') {","            options = Color._findType(options);","        }","        type = options.type.toLowerCase();","        val = (Y.Lang.isString(val)) ? val.toLowerCase() : val;","","        if (type === 'keyword') {","            val = KEYWORDS[val];","            type = 'hex';","        }","","        if (type === 'hex') {","            matches = REGEX_HEX.exec(val);","            if (matches) {","                arr = [matches[2], matches[3], matches[4]];","            } else {","                matches = REGEX_HEX3.exec(val);","                if (matches) {","                    arr = [","                        matches[2].toString() + matches[2],","                        matches[3].toString() + matches[3],","                        matches[4].toString() + matches[4]","                    ];","                }","            }","        } else if (type === 'rgb' || type === 'rgbcss') {","            if (Y.Lang.isArray(val) && val.length === 3) {","                arr = val;","            } else {","                matches = REGEX_RGB.exec(val);","                if (matches) {","                    arr = [ matches[1], matches[2], matches[3] ];","                }","            }","        } else {","            return options;","        }","","","        options.type = type.replace(/a?(css)?$/,'');","        options.value = arr;","","        return options;","    },","","    /**","    Converts the color value from the adjusted type to desired return","      values. Updates options.type with converted type. Updates","      options.value with new value array.","","    @protected","    @method _convertTo","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {Array} options.value color value to be converted","      @param {String} options.to desired converted color type","    @param {String} [to] (Optional) Overrides options.to if defined","    @returns {Object}","    **/","    _convertTo: function(options, to) {","        var  _options = Y.merge(options),","            from,","            val;","","        _options.to = to || _options.to;","        _options = Color._toArray(_options);","","        from = _options.type;","        val = _options.value;","        to = _options.to;","","        if (from === to) {","            return _options;","        }","","        if (from === HEX) {","            if (to === RGB) {","                val = Color._fromHexToRGB(val);","            }","        } else if (from === RGB) {","            if (to === HEX) {","                val = Color._fromRGBToHex(val);","            }","        }","","        _options.type = to;","        _options.value = val;","        return _options;","    },","","    /**","    Creates an array ([r,g,b]) from the provided value array ([rr,gg,bb])","","    @protected","    @method _fromHexToRGB","    @param {array} [val] color value to be converted","    @returns {array}","    **/","    _fromHexToRGB: function(val) {","        // assume val is [rr,gg,bb]","        return [","            parseInt(val[0], 16),","            parseInt(val[1], 16),","            parseInt(val[2], 16)","        ];","    },","","    /**","    Creates an array ([rr,gg,bb]) from the provided value array ([r,g,b])","","    @protected","    @method _fromRGBToHex","    @param {array} [val] color value to be converted","    @returns {array}","    **/","    _fromRGBToHex: function(val) {","        // assume val is [r,g,b]","        var r = parseInt(val[0], 10).toString(16),","            g = parseInt(val[1], 10).toString(16),","            b = parseInt(val[2], 10).toString(16);","","        while (r.length < 2) { r = '0' + r; }","        while (g.length < 2) { g = '0' + g; }","        while (b.length < 2) { b = '0' + b; }","","        return [r, g, b];","    }","","};","","Y.Color = Color;","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/color-base/color-base.js"].lines = {"1":0,"58":0,"90":0,"91":0,"96":0,"97":0,"98":0,"100":0,"115":0,"116":0,"121":0,"122":0,"123":0,"125":0,"146":0,"149":0,"150":0,"151":0,"152":0,"153":0,"154":0,"157":0,"158":0,"175":0,"180":0,"181":0,"183":0,"184":0,"186":0,"187":0,"188":0,"191":0,"192":0,"193":0,"194":0,"196":0,"197":0,"198":0,"205":0,"206":0,"207":0,"209":0,"210":0,"211":0,"215":0,"219":0,"220":0,"222":0,"240":0,"244":0,"245":0,"247":0,"248":0,"249":0,"251":0,"252":0,"255":0,"256":0,"257":0,"259":0,"260":0,"261":0,"265":0,"266":0,"267":0,"280":0,"297":0,"301":0,"302":0,"303":0,"305":0,"310":0};
_yuitest_coverage["build/color-base/color-base.js"].functions = {"toHex:89":0,"toRGB:114":0,"_findType:145":0,"_toArray:174":0,"_convertTo:239":0,"_fromHexToRGB:278":0,"_fromRGBToHex:295":0,"(anonymous 1):1":0};
_yuitest_coverage["build/color-base/color-base.js"].coveredLines = 72;
_yuitest_coverage["build/color-base/color-base.js"].coveredFunctions = 8;
_yuitest_coverline("build/color-base/color-base.js", 1);
YUI.add('color-base', function (Y, NAME) {

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


@module color
@submodule color-base
@class Base
@namespace Color
@since 3.6.1
**/
_yuitest_coverfunc("build/color-base/color-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/color-base/color-base.js", 58);
var KEYWORDS = {'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff', 'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f', 'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0', 'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'},
    // regular expressions used for validation and identification
    REGEX_HEX = /^(#?)([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/,
    REGEX_HEX3 = /^(#?)([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})/,
    REGEX_RGB = /^rgb\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3})\)/,

    HEX = 'hex',
    RGB = 'rgb',
    HSL = 'hsl',

Color = {

    KEYWORDS: KEYWORDS,

    re_RGB: REGEX_RGB,

    re_hex: REGEX_HEX,

    re_hex3: REGEX_HEX3,

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
        _yuitest_coverfunc("build/color-base/color-base.js", "toHex", 89);
_yuitest_coverline("build/color-base/color-base.js", 90);
if (Y.Lang.isString(options)) { // Preserve backwards compatability
            _yuitest_coverline("build/color-base/color-base.js", 91);
options = {
                value: options,
                css: true
            };
        }
        _yuitest_coverline("build/color-base/color-base.js", 96);
options = Color._convertTo(options, HEX);
        _yuitest_coverline("build/color-base/color-base.js", 97);
if (options.css) {
            _yuitest_coverline("build/color-base/color-base.js", 98);
return '#' + options.value.join('');
        }
        _yuitest_coverline("build/color-base/color-base.js", 100);
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
        _yuitest_coverfunc("build/color-base/color-base.js", "toRGB", 114);
_yuitest_coverline("build/color-base/color-base.js", 115);
if (Y.Lang.isString(options)) { // Preserve backwards compatability
            _yuitest_coverline("build/color-base/color-base.js", 116);
options = {
                value: options,
                css: true
            };
        }
        _yuitest_coverline("build/color-base/color-base.js", 121);
options = Color._convertTo(options, RGB);
        _yuitest_coverline("build/color-base/color-base.js", 122);
if (options.css) {
            _yuitest_coverline("build/color-base/color-base.js", 123);
return 'rgb(' + options.value.join(', ') + ')';
        }
        _yuitest_coverline("build/color-base/color-base.js", 125);
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
        _yuitest_coverfunc("build/color-base/color-base.js", "_findType", 145);
_yuitest_coverline("build/color-base/color-base.js", 146);
var val = options.value,
            type = options.type;

        _yuitest_coverline("build/color-base/color-base.js", 149);
if (KEYWORDS[val]) {
            _yuitest_coverline("build/color-base/color-base.js", 150);
type = 'keyword';
        } else {_yuitest_coverline("build/color-base/color-base.js", 151);
if (REGEX_RGB.exec(val)) {
            _yuitest_coverline("build/color-base/color-base.js", 152);
type = RGB;
        } else {_yuitest_coverline("build/color-base/color-base.js", 153);
if (REGEX_HEX.exec(val) || REGEX_HEX3.exec(val)) {
            _yuitest_coverline("build/color-base/color-base.js", 154);
type = HEX;
        }}}

        _yuitest_coverline("build/color-base/color-base.js", 157);
options.type = type;
        _yuitest_coverline("build/color-base/color-base.js", 158);
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
        _yuitest_coverfunc("build/color-base/color-base.js", "_toArray", 174);
_yuitest_coverline("build/color-base/color-base.js", 175);
var arr = [],
            matches = null,
            type = null,
            val = options.value;

        _yuitest_coverline("build/color-base/color-base.js", 180);
if (options.type === 'auto' || typeof options.type === 'undefined') {
            _yuitest_coverline("build/color-base/color-base.js", 181);
options = Color._findType(options);
        }
        _yuitest_coverline("build/color-base/color-base.js", 183);
type = options.type.toLowerCase();
        _yuitest_coverline("build/color-base/color-base.js", 184);
val = (Y.Lang.isString(val)) ? val.toLowerCase() : val;

        _yuitest_coverline("build/color-base/color-base.js", 186);
if (type === 'keyword') {
            _yuitest_coverline("build/color-base/color-base.js", 187);
val = KEYWORDS[val];
            _yuitest_coverline("build/color-base/color-base.js", 188);
type = 'hex';
        }

        _yuitest_coverline("build/color-base/color-base.js", 191);
if (type === 'hex') {
            _yuitest_coverline("build/color-base/color-base.js", 192);
matches = REGEX_HEX.exec(val);
            _yuitest_coverline("build/color-base/color-base.js", 193);
if (matches) {
                _yuitest_coverline("build/color-base/color-base.js", 194);
arr = [matches[2], matches[3], matches[4]];
            } else {
                _yuitest_coverline("build/color-base/color-base.js", 196);
matches = REGEX_HEX3.exec(val);
                _yuitest_coverline("build/color-base/color-base.js", 197);
if (matches) {
                    _yuitest_coverline("build/color-base/color-base.js", 198);
arr = [
                        matches[2].toString() + matches[2],
                        matches[3].toString() + matches[3],
                        matches[4].toString() + matches[4]
                    ];
                }
            }
        } else {_yuitest_coverline("build/color-base/color-base.js", 205);
if (type === 'rgb' || type === 'rgbcss') {
            _yuitest_coverline("build/color-base/color-base.js", 206);
if (Y.Lang.isArray(val) && val.length === 3) {
                _yuitest_coverline("build/color-base/color-base.js", 207);
arr = val;
            } else {
                _yuitest_coverline("build/color-base/color-base.js", 209);
matches = REGEX_RGB.exec(val);
                _yuitest_coverline("build/color-base/color-base.js", 210);
if (matches) {
                    _yuitest_coverline("build/color-base/color-base.js", 211);
arr = [ matches[1], matches[2], matches[3] ];
                }
            }
        } else {
            _yuitest_coverline("build/color-base/color-base.js", 215);
return options;
        }}


        _yuitest_coverline("build/color-base/color-base.js", 219);
options.type = type.replace(/a?(css)?$/,'');
        _yuitest_coverline("build/color-base/color-base.js", 220);
options.value = arr;

        _yuitest_coverline("build/color-base/color-base.js", 222);
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
        _yuitest_coverfunc("build/color-base/color-base.js", "_convertTo", 239);
_yuitest_coverline("build/color-base/color-base.js", 240);
var  _options = Y.merge(options),
            from,
            val;

        _yuitest_coverline("build/color-base/color-base.js", 244);
_options.to = to || _options.to;
        _yuitest_coverline("build/color-base/color-base.js", 245);
_options = Color._toArray(_options);

        _yuitest_coverline("build/color-base/color-base.js", 247);
from = _options.type;
        _yuitest_coverline("build/color-base/color-base.js", 248);
val = _options.value;
        _yuitest_coverline("build/color-base/color-base.js", 249);
to = _options.to;

        _yuitest_coverline("build/color-base/color-base.js", 251);
if (from === to) {
            _yuitest_coverline("build/color-base/color-base.js", 252);
return _options;
        }

        _yuitest_coverline("build/color-base/color-base.js", 255);
if (from === HEX) {
            _yuitest_coverline("build/color-base/color-base.js", 256);
if (to === RGB) {
                _yuitest_coverline("build/color-base/color-base.js", 257);
val = Color._fromHexToRGB(val);
            }
        } else {_yuitest_coverline("build/color-base/color-base.js", 259);
if (from === RGB) {
            _yuitest_coverline("build/color-base/color-base.js", 260);
if (to === HEX) {
                _yuitest_coverline("build/color-base/color-base.js", 261);
val = Color._fromRGBToHex(val);
            }
        }}

        _yuitest_coverline("build/color-base/color-base.js", 265);
_options.type = to;
        _yuitest_coverline("build/color-base/color-base.js", 266);
_options.value = val;
        _yuitest_coverline("build/color-base/color-base.js", 267);
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
        _yuitest_coverfunc("build/color-base/color-base.js", "_fromHexToRGB", 278);
_yuitest_coverline("build/color-base/color-base.js", 280);
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
        _yuitest_coverfunc("build/color-base/color-base.js", "_fromRGBToHex", 295);
_yuitest_coverline("build/color-base/color-base.js", 297);
var r = parseInt(val[0], 10).toString(16),
            g = parseInt(val[1], 10).toString(16),
            b = parseInt(val[2], 10).toString(16);

        _yuitest_coverline("build/color-base/color-base.js", 301);
while (r.length < 2) { r = '0' + r; }
        _yuitest_coverline("build/color-base/color-base.js", 302);
while (g.length < 2) { g = '0' + g; }
        _yuitest_coverline("build/color-base/color-base.js", 303);
while (b.length < 2) { b = '0' + b; }

        _yuitest_coverline("build/color-base/color-base.js", 305);
return [r, g, b];
    }

};

_yuitest_coverline("build/color-base/color-base.js", 310);
Y.Color = Color;


}, '@VERSION@', {"requires": ["yui-base"]});

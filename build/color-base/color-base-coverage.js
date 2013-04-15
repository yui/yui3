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
_yuitest_coverage["build/color-base/color-base.js"].code=["YUI.add('color-base', function (Y, NAME) {","","/**","Color provides static methods for color conversion.","","    Y.Color.toRGB('f00'); // rgb(255, 0, 0)","","    Y.Color.toHex('rgb(255, 255, 0)'); // #ffff00","","","@module color","@submodule color-base","@class Color","@since 3.8.0","**/","","var REGEX_HEX = /^#?([\\da-fA-F]{2})([\\da-fA-F]{2})([\\da-fA-F]{2})/,","    REGEX_HEX3 = /^#?([\\da-fA-F]{1})([\\da-fA-F]{1})([\\da-fA-F]{1})/,","    REGEX_RGB = /rgba?\\(([\\d]{1,3}), ?([\\d]{1,3}), ?([\\d]{1,3}),? ?([.\\d]*)?\\)/,","    TYPES = { 'HEX': 'hex', 'RGB': 'rgb', 'RGBA': 'rgba' },","    CONVERTS = { 'hex': 'toHex', 'rgb': 'toRGB', 'rgba': 'toRGBA' };","","","Y.Color = {","    /**","    @static","    @property KEYWORDS","    @type Object","    @since 3.8.0","    **/","    KEYWORDS: {","        'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff',","        'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f',","        'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0',","        'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'","    },","","    /**","    @static","    @property REGEX_HEX","    @type RegExp","    @default /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/","    @since 3.8.0","    **/","    REGEX_HEX: REGEX_HEX,","","    /**","    @static","    @property REGEX_HEX3","    @type RegExp","    @default /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})/","    @since 3.8.0","    **/","    REGEX_HEX3: REGEX_HEX3,","","    /**","    @static","    @property REGEX_RGB","    @type RegExp","    @default /rgba?\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}),? ?([.0-9]{1,3})?\\)/","    @since 3.8.0","    **/","    REGEX_RGB: REGEX_RGB,","","    re_RGB: REGEX_RGB,","","    re_hex: REGEX_HEX,","","    re_hex3: REGEX_HEX3,","","    /**","    @static","    @property STR_HEX","    @type String","    @default #{*}{*}{*}","    @since 3.8.0","    **/","    STR_HEX: '#{*}{*}{*}',","","    /**","    @static","    @property STR_RGB","    @type String","    @default rgb({*}, {*}, {*})","    @since 3.8.0","    **/","    STR_RGB: 'rgb({*}, {*}, {*})',","","    /**","    @static","    @property STR_RGBA","    @type String","    @default rgba({*}, {*}, {*}, {*})","    @since 3.8.0","    **/","    STR_RGBA: 'rgba({*}, {*}, {*}, {*})',","","    /**","    @static","    @property TYPES","    @type Object","    @default {'rgb':'rgb', 'rgba':'rgba'}","    @since 3.8.0","    **/","    TYPES: TYPES,","","    /**","    @static","    @property CONVERTS","    @type Object","    @default {}","    @since 3.8.0","    **/","    CONVERTS: CONVERTS,","","    /**","     Converts the provided string to the provided type.","     You can use the `Y.Color.TYPES` to get a valid `to` type.","     If the color cannot be converted, the original color will be returned.","","     @public","     @method convert","     @param {String} str","     @param {String} to","     @return {String}","     @since 3.8.0","     **/","    convert: function (str, to) {","        var convert = Y.Color.CONVERTS[to.toLowerCase()],","            clr = str;","","        if (convert && Y.Color[convert]) {","            clr = Y.Color[convert](str).toLowerCase();","        }","","        return clr;","    },","","    /**","    Converts provided color value to a hex value string","    @public","    @method toHex","    @param {String} str Hex or RGB value string","    @return {String} returns array of values or CSS string if options.css is true","    @since 3.8.0","    **/","    toHex: function (str) {","        var clr = Y.Color._convertTo(str, 'hex');","        return clr.toLowerCase();","    },","","    /**","    Converts provided color value to an RGB value string","    @public","    @method toRGB","    @param {String} str Hex or RGB value string","    @return {String}","    @since 3.8.0","    **/","    toRGB: function (str) {","        var clr = Y.Color._convertTo(str, 'rgb');","        return clr.toLowerCase();","    },","","    /**","    Converts provided color value to an RGB value string","    @public","    @method toRGBA","    @param {String} str Hex or RGB value string","    @return {String}","    @since 3.8.0","    **/","    toRGBA: function (str) {","        var clr = Y.Color._convertTo(str, 'rgba' );","        return clr.toLowerCase();","    },","","    /**","    Converts the provided color string to an array of values. Will","        return an empty array if the provided string is not able","        to be parsed.","    @public","    @method toArray","    @param {String} str","    @return {Array}","    @since 3.8.0","    **/","    toArray: function(str) {","        // parse with regex and return \"matches\" array","        var type = Y.Color.findType(str).toUpperCase(),","            regex,","            arr,","            length,","            lastItem;","","        if (type === 'HEX' && str.length < 5) {","            type = 'HEX3';","        }","","        if (type.charAt(type.length - 1) === 'A') {","            type = type.slice(0, -1);","        }","        regex = Y.Color['REGEX_' + type];","        if (regex) {","            arr = regex.exec(str) || [];","            length = arr.length;","","            if (length) {","","                arr.shift();","                length--;","","                lastItem = arr[length - 1];","                if (!lastItem) {","                    arr[length - 1] = 1;","                }","            }","        }","","        return arr;","","    },","","    /**","    Converts the array of values to a string based on the provided template.","    @public","    @method fromArray","    @param {Array} arr","    @param {String} template","    @return {String}","    @since 3.8.0","    **/","    fromArray: function(arr, template) {","        arr = arr.concat();","","        if (typeof template === 'undefined') {","            return arr.join(', ');","        }","","        var replace = '{*}';","","        template = Y.Color['STR_' + template.toUpperCase()];","","        if (arr.length === 3 && template.match(/\\{\\*\\}/g).length === 4) {","            arr.push(1);","        }","","        while ( template.indexOf(replace) >= 0 && arr.length > 0) {","            template = template.replace(replace, arr.shift());","        }","","        return template;","    },","","    /**","    Finds the value type based on the str value provided.","    @public","    @method findType","    @param {String} str","    @return {String}","    @since 3.8.0","    **/","    findType: function (str) {","        if (Y.Color.KEYWORDS[str]) {","            return 'keyword';","        }","","        var index = str.indexOf('('),","            key;","","        if (index > 0) {","            key = str.substr(0, index);","        }","","        if (key && Y.Color.TYPES[key.toUpperCase()]) {","            return Y.Color.TYPES[key.toUpperCase()];","        }","","        return 'hex';","","    }, // return 'keyword', 'hex', 'rgb'","","    /**","    Retrives the alpha channel from the provided string. If no alpha","        channel is present, `1` will be returned.","    @protected","    @method _getAlpha","    @param {String} clr","    @return {Number}","    @since 3.8.0","    **/","    _getAlpha: function (clr) {","        var alpha,","            arr = Y.Color.toArray(clr);","","        if (arr.length > 3) {","            alpha = arr.pop();","        }","","        return +alpha || 1;","    },","","    /**","    Returns the hex value string if found in the KEYWORDS object","    @protected","    @method _keywordToHex","    @param {String} clr","    @return {String}","    @since 3.8.0","    **/","    _keywordToHex: function (clr) {","        var keyword = Y.Color.KEYWORDS[clr];","","        if (keyword) {","            return keyword;","        }","    },","","    /**","    Converts the provided color string to the value type provided as `to`","    @protected","    @method _convertTo","    @param {String} clr","    @param {String} to","    @return {String}","    @since 3.8.0","    **/","    _convertTo: function(clr, to) {","        var from = Y.Color.findType(clr),","            originalTo = to,","            needsAlpha,","            alpha,","            method,","            ucTo;","","        if (from === 'keyword') {","            clr = Y.Color._keywordToHex(clr);","            from = 'hex';","        }","","        if (from === 'hex' && clr.length < 5) {","            if (clr.charAt(0) === '#') {","                clr = clr.substr(1);","            }","","            clr = '#' + clr.charAt(0) + clr.charAt(0) +","                        clr.charAt(1) + clr.charAt(1) +","                        clr.charAt(2) + clr.charAt(2);","        }","","        if (from === to) {","            return clr;","        }","","        if (from.charAt(from.length - 1) === 'a') {","            from = from.slice(0, -1);","        }","","        needsAlpha = (to.charAt(to.length - 1) === 'a');","        if (needsAlpha) {","            to = to.slice(0, -1);","            alpha = Y.Color._getAlpha(clr);","        }","","        ucTo = to.charAt(0).toUpperCase() + to.substr(1).toLowerCase();","        method = Y.Color['_' + from + 'To' + ucTo ];","","        // check to see if need conversion to rgb first","        // check to see if there is a direct conversion method","        // convertions are: hex <-> rgb <-> hsl","        if (!method) {","            if (from !== 'rgb' && to !== 'rgb') {","                clr = Y.Color['_' + from + 'ToRgb'](clr);","                from = 'rgb';","                method = Y.Color['_' + from + 'To' + ucTo ];","            }","        }","","        if (method) {","            clr = ((method)(clr, needsAlpha));","        }","","        // process clr from arrays to strings after conversions if alpha is needed","        if (needsAlpha) {","            if (!Y.Lang.isArray(clr)) {","                clr = Y.Color.toArray(clr);","            }","            clr.push(alpha);","            clr = Y.Color.fromArray(clr, originalTo.toUpperCase());","        }","","        return clr;","    },","","    /**","    Processes the hex string into r, g, b values. Will return values as","        an array, or as an rgb string.","    @protected","    @method _hexToRgb","    @param {String} str","    @param {Boolean} [toArray]","    @return {String|Array}","    @since 3.8.0","    **/","    _hexToRgb: function (str, toArray) {","        var r, g, b;","","        /*jshint bitwise:false*/","        if (str.charAt(0) === '#') {","            str = str.substr(1);","        }","","        str = parseInt(str, 16);","","        r = str >> 16;","        g = str >> 8 & 0xFF;","        b = str & 0xFF;","","        if (toArray) {","            return [r, g, b];","        }","","        return 'rgb(' + r + ', ' + g + ', ' + b + ')';","    },","","    /**","    Processes the rgb string into r, g, b values. Will return values as","        an array, or as a hex string.","    @protected","    @method _rgbToHex","    @param {String} str","    @param {Boolean} [toArray]","    @return {String|Array}","    @since 3.8.0","    **/","    _rgbToHex: function (str) {","        /*jshint bitwise:false*/","        var rgb = Y.Color.toArray(str),","            hex = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);","","        hex = (+hex).toString(16);","","        while (hex.length < 6) {","            hex = '0' + hex;","        }","","        return '#' + hex;","    }","","};","","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/color-base/color-base.js"].lines = {"1":0,"17":0,"24":0,"129":0,"132":0,"133":0,"136":0,"148":0,"149":0,"161":0,"162":0,"174":0,"175":0,"190":0,"196":0,"197":0,"200":0,"201":0,"203":0,"204":0,"205":0,"206":0,"208":0,"210":0,"211":0,"213":0,"214":0,"215":0,"220":0,"234":0,"236":0,"237":0,"240":0,"242":0,"244":0,"245":0,"248":0,"249":0,"252":0,"264":0,"265":0,"268":0,"271":0,"272":0,"275":0,"276":0,"279":0,"293":0,"296":0,"297":0,"300":0,"312":0,"314":0,"315":0,"329":0,"336":0,"337":0,"338":0,"341":0,"342":0,"343":0,"346":0,"351":0,"352":0,"355":0,"356":0,"359":0,"360":0,"361":0,"362":0,"365":0,"366":0,"371":0,"372":0,"373":0,"374":0,"375":0,"379":0,"380":0,"384":0,"385":0,"386":0,"388":0,"389":0,"392":0,"406":0,"409":0,"410":0,"413":0,"415":0,"416":0,"417":0,"419":0,"420":0,"423":0,"438":0,"441":0,"443":0,"444":0,"447":0};
_yuitest_coverage["build/color-base/color-base.js"].functions = {"convert:128":0,"toHex:147":0,"toRGB:160":0,"toRGBA:173":0,"toArray:188":0,"fromArray:233":0,"findType:263":0,"_getAlpha:292":0,"_keywordToHex:311":0,"_convertTo:328":0,"_hexToRgb:405":0,"_rgbToHex:436":0,"(anonymous 1):1":0};
_yuitest_coverage["build/color-base/color-base.js"].coveredLines = 100;
_yuitest_coverage["build/color-base/color-base.js"].coveredFunctions = 13;
_yuitest_coverline("build/color-base/color-base.js", 1);
YUI.add('color-base', function (Y, NAME) {

/**
Color provides static methods for color conversion.

    Y.Color.toRGB('f00'); // rgb(255, 0, 0)

    Y.Color.toHex('rgb(255, 255, 0)'); // #ffff00


@module color
@submodule color-base
@class Color
@since 3.8.0
**/

_yuitest_coverfunc("build/color-base/color-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/color-base/color-base.js", 17);
var REGEX_HEX = /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/,
    REGEX_HEX3 = /^#?([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})/,
    REGEX_RGB = /rgba?\(([\d]{1,3}), ?([\d]{1,3}), ?([\d]{1,3}),? ?([.\d]*)?\)/,
    TYPES = { 'HEX': 'hex', 'RGB': 'rgb', 'RGBA': 'rgba' },
    CONVERTS = { 'hex': 'toHex', 'rgb': 'toRGB', 'rgba': 'toRGBA' };


_yuitest_coverline("build/color-base/color-base.js", 24);
Y.Color = {
    /**
    @static
    @property KEYWORDS
    @type Object
    @since 3.8.0
    **/
    KEYWORDS: {
        'black': '000', 'silver': 'c0c0c0', 'gray': '808080', 'white': 'fff',
        'maroon': '800000', 'red': 'f00', 'purple': '800080', 'fuchsia': 'f0f',
        'green': '008000', 'lime': '0f0', 'olive': '808000', 'yellow': 'ff0',
        'navy': '000080', 'blue': '00f', 'teal': '008080', 'aqua': '0ff'
    },

    /**
    @static
    @property REGEX_HEX
    @type RegExp
    @default /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/
    @since 3.8.0
    **/
    REGEX_HEX: REGEX_HEX,

    /**
    @static
    @property REGEX_HEX3
    @type RegExp
    @default /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})/
    @since 3.8.0
    **/
    REGEX_HEX3: REGEX_HEX3,

    /**
    @static
    @property REGEX_RGB
    @type RegExp
    @default /rgba?\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}),? ?([.0-9]{1,3})?\)/
    @since 3.8.0
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
    @since 3.8.0
    **/
    STR_HEX: '#{*}{*}{*}',

    /**
    @static
    @property STR_RGB
    @type String
    @default rgb({*}, {*}, {*})
    @since 3.8.0
    **/
    STR_RGB: 'rgb({*}, {*}, {*})',

    /**
    @static
    @property STR_RGBA
    @type String
    @default rgba({*}, {*}, {*}, {*})
    @since 3.8.0
    **/
    STR_RGBA: 'rgba({*}, {*}, {*}, {*})',

    /**
    @static
    @property TYPES
    @type Object
    @default {'rgb':'rgb', 'rgba':'rgba'}
    @since 3.8.0
    **/
    TYPES: TYPES,

    /**
    @static
    @property CONVERTS
    @type Object
    @default {}
    @since 3.8.0
    **/
    CONVERTS: CONVERTS,

    /**
     Converts the provided string to the provided type.
     You can use the `Y.Color.TYPES` to get a valid `to` type.
     If the color cannot be converted, the original color will be returned.

     @public
     @method convert
     @param {String} str
     @param {String} to
     @return {String}
     @since 3.8.0
     **/
    convert: function (str, to) {
        _yuitest_coverfunc("build/color-base/color-base.js", "convert", 128);
_yuitest_coverline("build/color-base/color-base.js", 129);
var convert = Y.Color.CONVERTS[to.toLowerCase()],
            clr = str;

        _yuitest_coverline("build/color-base/color-base.js", 132);
if (convert && Y.Color[convert]) {
            _yuitest_coverline("build/color-base/color-base.js", 133);
clr = Y.Color[convert](str).toLowerCase();
        }

        _yuitest_coverline("build/color-base/color-base.js", 136);
return clr;
    },

    /**
    Converts provided color value to a hex value string
    @public
    @method toHex
    @param {String} str Hex or RGB value string
    @return {String} returns array of values or CSS string if options.css is true
    @since 3.8.0
    **/
    toHex: function (str) {
        _yuitest_coverfunc("build/color-base/color-base.js", "toHex", 147);
_yuitest_coverline("build/color-base/color-base.js", 148);
var clr = Y.Color._convertTo(str, 'hex');
        _yuitest_coverline("build/color-base/color-base.js", 149);
return clr.toLowerCase();
    },

    /**
    Converts provided color value to an RGB value string
    @public
    @method toRGB
    @param {String} str Hex or RGB value string
    @return {String}
    @since 3.8.0
    **/
    toRGB: function (str) {
        _yuitest_coverfunc("build/color-base/color-base.js", "toRGB", 160);
_yuitest_coverline("build/color-base/color-base.js", 161);
var clr = Y.Color._convertTo(str, 'rgb');
        _yuitest_coverline("build/color-base/color-base.js", 162);
return clr.toLowerCase();
    },

    /**
    Converts provided color value to an RGB value string
    @public
    @method toRGBA
    @param {String} str Hex or RGB value string
    @return {String}
    @since 3.8.0
    **/
    toRGBA: function (str) {
        _yuitest_coverfunc("build/color-base/color-base.js", "toRGBA", 173);
_yuitest_coverline("build/color-base/color-base.js", 174);
var clr = Y.Color._convertTo(str, 'rgba' );
        _yuitest_coverline("build/color-base/color-base.js", 175);
return clr.toLowerCase();
    },

    /**
    Converts the provided color string to an array of values. Will
        return an empty array if the provided string is not able
        to be parsed.
    @public
    @method toArray
    @param {String} str
    @return {Array}
    @since 3.8.0
    **/
    toArray: function(str) {
        // parse with regex and return "matches" array
        _yuitest_coverfunc("build/color-base/color-base.js", "toArray", 188);
_yuitest_coverline("build/color-base/color-base.js", 190);
var type = Y.Color.findType(str).toUpperCase(),
            regex,
            arr,
            length,
            lastItem;

        _yuitest_coverline("build/color-base/color-base.js", 196);
if (type === 'HEX' && str.length < 5) {
            _yuitest_coverline("build/color-base/color-base.js", 197);
type = 'HEX3';
        }

        _yuitest_coverline("build/color-base/color-base.js", 200);
if (type.charAt(type.length - 1) === 'A') {
            _yuitest_coverline("build/color-base/color-base.js", 201);
type = type.slice(0, -1);
        }
        _yuitest_coverline("build/color-base/color-base.js", 203);
regex = Y.Color['REGEX_' + type];
        _yuitest_coverline("build/color-base/color-base.js", 204);
if (regex) {
            _yuitest_coverline("build/color-base/color-base.js", 205);
arr = regex.exec(str) || [];
            _yuitest_coverline("build/color-base/color-base.js", 206);
length = arr.length;

            _yuitest_coverline("build/color-base/color-base.js", 208);
if (length) {

                _yuitest_coverline("build/color-base/color-base.js", 210);
arr.shift();
                _yuitest_coverline("build/color-base/color-base.js", 211);
length--;

                _yuitest_coverline("build/color-base/color-base.js", 213);
lastItem = arr[length - 1];
                _yuitest_coverline("build/color-base/color-base.js", 214);
if (!lastItem) {
                    _yuitest_coverline("build/color-base/color-base.js", 215);
arr[length - 1] = 1;
                }
            }
        }

        _yuitest_coverline("build/color-base/color-base.js", 220);
return arr;

    },

    /**
    Converts the array of values to a string based on the provided template.
    @public
    @method fromArray
    @param {Array} arr
    @param {String} template
    @return {String}
    @since 3.8.0
    **/
    fromArray: function(arr, template) {
        _yuitest_coverfunc("build/color-base/color-base.js", "fromArray", 233);
_yuitest_coverline("build/color-base/color-base.js", 234);
arr = arr.concat();

        _yuitest_coverline("build/color-base/color-base.js", 236);
if (typeof template === 'undefined') {
            _yuitest_coverline("build/color-base/color-base.js", 237);
return arr.join(', ');
        }

        _yuitest_coverline("build/color-base/color-base.js", 240);
var replace = '{*}';

        _yuitest_coverline("build/color-base/color-base.js", 242);
template = Y.Color['STR_' + template.toUpperCase()];

        _yuitest_coverline("build/color-base/color-base.js", 244);
if (arr.length === 3 && template.match(/\{\*\}/g).length === 4) {
            _yuitest_coverline("build/color-base/color-base.js", 245);
arr.push(1);
        }

        _yuitest_coverline("build/color-base/color-base.js", 248);
while ( template.indexOf(replace) >= 0 && arr.length > 0) {
            _yuitest_coverline("build/color-base/color-base.js", 249);
template = template.replace(replace, arr.shift());
        }

        _yuitest_coverline("build/color-base/color-base.js", 252);
return template;
    },

    /**
    Finds the value type based on the str value provided.
    @public
    @method findType
    @param {String} str
    @return {String}
    @since 3.8.0
    **/
    findType: function (str) {
        _yuitest_coverfunc("build/color-base/color-base.js", "findType", 263);
_yuitest_coverline("build/color-base/color-base.js", 264);
if (Y.Color.KEYWORDS[str]) {
            _yuitest_coverline("build/color-base/color-base.js", 265);
return 'keyword';
        }

        _yuitest_coverline("build/color-base/color-base.js", 268);
var index = str.indexOf('('),
            key;

        _yuitest_coverline("build/color-base/color-base.js", 271);
if (index > 0) {
            _yuitest_coverline("build/color-base/color-base.js", 272);
key = str.substr(0, index);
        }

        _yuitest_coverline("build/color-base/color-base.js", 275);
if (key && Y.Color.TYPES[key.toUpperCase()]) {
            _yuitest_coverline("build/color-base/color-base.js", 276);
return Y.Color.TYPES[key.toUpperCase()];
        }

        _yuitest_coverline("build/color-base/color-base.js", 279);
return 'hex';

    }, // return 'keyword', 'hex', 'rgb'

    /**
    Retrives the alpha channel from the provided string. If no alpha
        channel is present, `1` will be returned.
    @protected
    @method _getAlpha
    @param {String} clr
    @return {Number}
    @since 3.8.0
    **/
    _getAlpha: function (clr) {
        _yuitest_coverfunc("build/color-base/color-base.js", "_getAlpha", 292);
_yuitest_coverline("build/color-base/color-base.js", 293);
var alpha,
            arr = Y.Color.toArray(clr);

        _yuitest_coverline("build/color-base/color-base.js", 296);
if (arr.length > 3) {
            _yuitest_coverline("build/color-base/color-base.js", 297);
alpha = arr.pop();
        }

        _yuitest_coverline("build/color-base/color-base.js", 300);
return +alpha || 1;
    },

    /**
    Returns the hex value string if found in the KEYWORDS object
    @protected
    @method _keywordToHex
    @param {String} clr
    @return {String}
    @since 3.8.0
    **/
    _keywordToHex: function (clr) {
        _yuitest_coverfunc("build/color-base/color-base.js", "_keywordToHex", 311);
_yuitest_coverline("build/color-base/color-base.js", 312);
var keyword = Y.Color.KEYWORDS[clr];

        _yuitest_coverline("build/color-base/color-base.js", 314);
if (keyword) {
            _yuitest_coverline("build/color-base/color-base.js", 315);
return keyword;
        }
    },

    /**
    Converts the provided color string to the value type provided as `to`
    @protected
    @method _convertTo
    @param {String} clr
    @param {String} to
    @return {String}
    @since 3.8.0
    **/
    _convertTo: function(clr, to) {
        _yuitest_coverfunc("build/color-base/color-base.js", "_convertTo", 328);
_yuitest_coverline("build/color-base/color-base.js", 329);
var from = Y.Color.findType(clr),
            originalTo = to,
            needsAlpha,
            alpha,
            method,
            ucTo;

        _yuitest_coverline("build/color-base/color-base.js", 336);
if (from === 'keyword') {
            _yuitest_coverline("build/color-base/color-base.js", 337);
clr = Y.Color._keywordToHex(clr);
            _yuitest_coverline("build/color-base/color-base.js", 338);
from = 'hex';
        }

        _yuitest_coverline("build/color-base/color-base.js", 341);
if (from === 'hex' && clr.length < 5) {
            _yuitest_coverline("build/color-base/color-base.js", 342);
if (clr.charAt(0) === '#') {
                _yuitest_coverline("build/color-base/color-base.js", 343);
clr = clr.substr(1);
            }

            _yuitest_coverline("build/color-base/color-base.js", 346);
clr = '#' + clr.charAt(0) + clr.charAt(0) +
                        clr.charAt(1) + clr.charAt(1) +
                        clr.charAt(2) + clr.charAt(2);
        }

        _yuitest_coverline("build/color-base/color-base.js", 351);
if (from === to) {
            _yuitest_coverline("build/color-base/color-base.js", 352);
return clr;
        }

        _yuitest_coverline("build/color-base/color-base.js", 355);
if (from.charAt(from.length - 1) === 'a') {
            _yuitest_coverline("build/color-base/color-base.js", 356);
from = from.slice(0, -1);
        }

        _yuitest_coverline("build/color-base/color-base.js", 359);
needsAlpha = (to.charAt(to.length - 1) === 'a');
        _yuitest_coverline("build/color-base/color-base.js", 360);
if (needsAlpha) {
            _yuitest_coverline("build/color-base/color-base.js", 361);
to = to.slice(0, -1);
            _yuitest_coverline("build/color-base/color-base.js", 362);
alpha = Y.Color._getAlpha(clr);
        }

        _yuitest_coverline("build/color-base/color-base.js", 365);
ucTo = to.charAt(0).toUpperCase() + to.substr(1).toLowerCase();
        _yuitest_coverline("build/color-base/color-base.js", 366);
method = Y.Color['_' + from + 'To' + ucTo ];

        // check to see if need conversion to rgb first
        // check to see if there is a direct conversion method
        // convertions are: hex <-> rgb <-> hsl
        _yuitest_coverline("build/color-base/color-base.js", 371);
if (!method) {
            _yuitest_coverline("build/color-base/color-base.js", 372);
if (from !== 'rgb' && to !== 'rgb') {
                _yuitest_coverline("build/color-base/color-base.js", 373);
clr = Y.Color['_' + from + 'ToRgb'](clr);
                _yuitest_coverline("build/color-base/color-base.js", 374);
from = 'rgb';
                _yuitest_coverline("build/color-base/color-base.js", 375);
method = Y.Color['_' + from + 'To' + ucTo ];
            }
        }

        _yuitest_coverline("build/color-base/color-base.js", 379);
if (method) {
            _yuitest_coverline("build/color-base/color-base.js", 380);
clr = ((method)(clr, needsAlpha));
        }

        // process clr from arrays to strings after conversions if alpha is needed
        _yuitest_coverline("build/color-base/color-base.js", 384);
if (needsAlpha) {
            _yuitest_coverline("build/color-base/color-base.js", 385);
if (!Y.Lang.isArray(clr)) {
                _yuitest_coverline("build/color-base/color-base.js", 386);
clr = Y.Color.toArray(clr);
            }
            _yuitest_coverline("build/color-base/color-base.js", 388);
clr.push(alpha);
            _yuitest_coverline("build/color-base/color-base.js", 389);
clr = Y.Color.fromArray(clr, originalTo.toUpperCase());
        }

        _yuitest_coverline("build/color-base/color-base.js", 392);
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
    @since 3.8.0
    **/
    _hexToRgb: function (str, toArray) {
        _yuitest_coverfunc("build/color-base/color-base.js", "_hexToRgb", 405);
_yuitest_coverline("build/color-base/color-base.js", 406);
var r, g, b;

        /*jshint bitwise:false*/
        _yuitest_coverline("build/color-base/color-base.js", 409);
if (str.charAt(0) === '#') {
            _yuitest_coverline("build/color-base/color-base.js", 410);
str = str.substr(1);
        }

        _yuitest_coverline("build/color-base/color-base.js", 413);
str = parseInt(str, 16);

        _yuitest_coverline("build/color-base/color-base.js", 415);
r = str >> 16;
        _yuitest_coverline("build/color-base/color-base.js", 416);
g = str >> 8 & 0xFF;
        _yuitest_coverline("build/color-base/color-base.js", 417);
b = str & 0xFF;

        _yuitest_coverline("build/color-base/color-base.js", 419);
if (toArray) {
            _yuitest_coverline("build/color-base/color-base.js", 420);
return [r, g, b];
        }

        _yuitest_coverline("build/color-base/color-base.js", 423);
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
    @since 3.8.0
    **/
    _rgbToHex: function (str) {
        /*jshint bitwise:false*/
        _yuitest_coverfunc("build/color-base/color-base.js", "_rgbToHex", 436);
_yuitest_coverline("build/color-base/color-base.js", 438);
var rgb = Y.Color.toArray(str),
            hex = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);

        _yuitest_coverline("build/color-base/color-base.js", 441);
hex = (+hex).toString(16);

        _yuitest_coverline("build/color-base/color-base.js", 443);
while (hex.length < 6) {
            _yuitest_coverline("build/color-base/color-base.js", 444);
hex = '0' + hex;
        }

        _yuitest_coverline("build/color-base/color-base.js", 447);
return '#' + hex;
    }

};



}, '@VERSION@', {"requires": ["yui-base"]});

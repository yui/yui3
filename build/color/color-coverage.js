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
_yuitest_coverage["build/color/color.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/color/color.js",
    code: []
};
_yuitest_coverage["build/color/color.js"].code=["YUI.add('color', function (Y, NAME) {","","/**","Color provides static methods for color conversion.","","For all cases of option.type, valid types are:","","- **keyword**:","option.value - must be a keyword in Y.Color.KEYWORDS","","- **hex**:","option.value - 3 or 6 character representation with or without a '#' or array of [rr, gg, bb] strings","","- **rgb**:","option.value - rgb(r, g, b) string or array of [r, g, b] values","","- **rgba**:","option.value - rgba(r, g, b, a) string or array of [r, g, b, a] values","","- **hsl**:","option.value - hsl(h, s%, l%) string or array of [h, s, l] values","","- **hsla**:","option.value - hsla(h, s%, l%, a) string or array of [h, s, l, a] values","","In all cases of option.to, valid types are:","","- **hex**:","returns [rr, gg, bb] or #rrggbb if options.css is true","","- **rgb**:","returns [r, g, b] or rgb(r, g, b) if options.css is true","","- **rgba**:","returns [r, g, b, a] or rgba(r, g, b, a) if options.css is true","","- **hsl**:","returns [h, s, l] or hsl(h, s%, l%) if options.css is true","","- **hsla**:","returns [h, s, l, a] or hsla(h, s%, l%, a) if options.css is true","","The following is an example of how these features can be used:","","    Y.Color.toRGB('f00'); // rgb(255, 0, 0)","","    Y.Color.toHex({","        type: 'rgb',","        value: [255, 255, 0]","    }); // [\"ff\", \"ff\", \"00\"]","","    Y.Color.convert({","        type: 'hsl',","        value: [240, 100, 50],","        to: 'hex',","        css: true","    }); // #0000ff","","","@module color","@class Color","@since 3.6.1","**/","var KEYWORDS = Y.Color.KEYWORDS,","    // regular expressions used for validation and identification","    REGEX_HEX = Y.Color.re_hex,","    REGEX_HEX3 = Y.Color.re_hex3,","    REGEX_RGB = Y.Color.re_RGB,","    REGEX_RGBA = /rgba\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}), ?([.0-9]{1,3})\\)/,","    REGEX_HSL = /hsl\\(([0-9]{1,3}), ?([0-9]*\\.?[0-9]+)%, ?([0-9]*\\.?[0-9]+)%\\)/,","    REGEX_HSLA = /hsla\\(([0-9]{1,3}), ?([0-9]*\\.?[0-9]+)%, ?([0-9]*\\.?[0-9]+)%, ?([.0-9]{1,3})\\)/,","","    HEX = 'hex',","    RGB = 'rgb',","    HSL = 'hsl',","","Color = {","    //----------------------------","    // C O N S T A N T S","    //---------------------------","    REGEX: {","        'hex': REGEX_HEX,","        'hex3': REGEX_HEX3,","        'rgbcss': REGEX_RGB,","        'rgbacss': REGEX_RGBA,","        'hslcss': REGEX_HSL,","        'hslacss': REGEX_HSLA","    },","","    //----------------------------","    // P U B L I C   A P I","    //---------------------------","    /**","    Converts provided color value to the desired return type","","    @public","    @method convert","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {String|Array} options.value color value to be converted","      @param {String} options.to desired converted color type","      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values","    @see toHex","    @see toRGB","    @see toRGBA","    @see toHSL","    @see toHSLA","    @returns {String|Array} returns array of values or CSS string if options.css is true","    **/","    convert: function(options) {","        switch (options.to) {","            case 'hex': return Color.toHex(options);","            case 'rgb': return Color.toRGB(options);","            case 'rgba': return Color.toRGBA(options);","            case 'hsl': return Color.toHSL(options);","            case 'hsla': return Color.toHSLA(options);","        }","    },","","    /**","    Converts provided color value to an array of hex values or hash prepended string","","    @public","    @method toHex","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {String|Array} options.value color value to be converted","      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values","    @returns {String|Array} returns array of values or CSS string if options.css is true","    **/","    toHex: function(options) {","        if (Y.Lang.isString(options)) { // Preserve backwards compatability","            options = {","                value: options,","                css: true","            };","        }","        options = Color._convertTo(options, HEX);","        if (options.css) {","            return '#' + options.value.join('');","        }","        return options.value;","    },","","    /**","    Converts provided color value to an array of RGB values or rgb() string","","    @public","    @method toRGB","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {String|Array} options.value color value to be converted","      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values","    @returns {String|Array} returns array of values or CSS string if options.css is true","    **/","    toRGB: function(options) {","        if (Y.Lang.isString(options)) { // Preserve backwards compatability","            options = {","                value: options,","                css: true","            };","        }","        options = Color._convertTo(options, RGB);","        if (options.css) {","            return 'rgb(' + options.value.join(', ') + ')';","        }","        return options.value;","    },","","    /**","    Converts provided color value to an array of RGBA values or rgba() string. If no alpha value is provided in the original color, will return 1 as the alpha value.","","    @public","    @method toRGBA","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {String|Array} options.value color value to be converted","      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values","    @returns {String|Array} returns array of values or CSS string if options.css is true","    **/","    toRGBA: function(options) {","        options = Color._convertTo(options, RGB);","        options.value.push(Y.Lang.isNumber(options.opacity) ? options.opacity : 1);","        if (options.css) {","            return 'rgba(' + options.value.join(', ') + ')';","        }","        return options.value;","    },","","    /**","    Converts provided color value to an array of HSL values or hsl() string","","    @public","    @method toHSL","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {String|Array} options.value color value to be converted","      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values","    @returns {String|Array} returns array of values or CSS string if options.css is true","    **/","    toHSL: function(options) {","        options = Color._convertTo(options, HSL);","        options.value[1] = Math.round( options.value[1] * 100 ) / 100;","        options.value[2] = Math.round( options.value[2] * 100 ) / 100;","","        if (options.css) {","            options.value[1] += '%';","            options.value[2] += '%';","            return 'hsl(' + options.value.join(', ') + ')';","        }","        return options.value;","    },","","    /**","    Converts provided color value to an array of HSLA values or hsla() string. If no alpha value is provided in the original color, will return 1 as the alpha value.","","    @public","    @method toHSLA","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {String|Array} options.value color value to be converted","      @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an array of color values","    @returns {String|Array} returns array of values or CSS string if options.css is true","    **/","    toHSLA: function(options) {","        options = Color._convertTo(options, HSL);","        options.value.push(Y.Lang.isNumber(options.opacity) ? options.opacity : 1);","        if (options.css) {","            options.value[1] += '%';","            options.value[2] += '%';","            return 'hsla(' + options.value.join(', ') + ')';","        }","        return options.value;","    },","","    //----------------------------","    // P R O T E C T E D","    //---------------------------","    /**","    Attempts to find the type of the provided color value. Updates the","      options object if found.","","    @protected","    @method _findType","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {Array} options.value color value to be converted","      @param {String} options.to desired converted color type","    @returns {Object}","    **/","    _findType: function(options) {","        var val = options.value;","","        if (Y.Lang.isArray(val)) {","            return options;","        }","","        if (KEYWORDS[val]) {","            options.type = 'keyword';","        } else if (REGEX_RGB.exec(val)) {","            options.type = RGB;","        } else if (REGEX_RGBA.exec(val)) {","            options.type = RGB + 'a';","        } else if (REGEX_HSL.exec(val)) {","            options.type = HSL;","        } else if (REGEX_HSLA.exec(val)) {","            options.type = HSL + 'a';","        } else if (REGEX_HEX.exec(val) || REGEX_HEX3.exec(val)) {","            options.type = HEX;","        }","","        return options;","    },","","    /**","    Converts string and makes any adjustments to values array if","      needed. Prepares value to be used with _convertTo.","      Modifies the options object.","","    @protected","    @method _toArray","    @see _convertTo","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {Array} options.value color value to be converted","      @param {String} options.to desired converted color type","    @returns {Object}","    **/","    _toArray: function(options) {","        var arr = [],","            matches = null,","            type = null,","            val = options.value;","","        if (options.type === 'auto' || typeof options.type === 'undefined') {","            options = Color._findType(options);","        }","        type = options.type.toLowerCase();","        val = (Y.Lang.isString(val)) ? val.toLowerCase() : val;","","        switch(type) {","            case 'keyword':","                val = KEYWORDS[val];","                type = 'hex';","                // break; overflow intentional","            case 'hex':","                matches = REGEX_HEX.exec(val);","                if (matches) {","                    arr = [matches[2], matches[3], matches[4]];","                    break;","                }","                matches = REGEX_HEX3.exec(val);","                if (matches) {","                    arr = [","                        matches[2].toString() + matches[2],","                        matches[3].toString() + matches[3],","                        matches[4].toString() + matches[4]","                        ];","                }","                break;","            case 'rgb':","            case 'rbgcss':","                if (Y.Lang.isArray(val) && val.length === 3) {","                    arr = val.concat();","                    break;","                }","                matches = REGEX_RGB.exec(val);","                if (matches) {","                    arr = [ matches[1], matches[2], matches[3] ];","                }","                break;","            case 'rgba':","            case 'rgbacss':","                if (Y.Lang.isArray(val) && val.length === 4) {","                    options.opacity = val.pop();","                    arr = val.concat();","                    break;","                }","                matches = REGEX_RGBA.exec(val);","                if (matches) {","                    options.opacity = matches[4];","                    arr = [ matches[1], matches[2], matches[3] ];","                }","                break;","            case 'hsl':","            case 'hslcss':","                if (Y.Lang.isArray(val) && val.length === 3) {","                    arr = val.concat();","                    break;","                }","                matches = REGEX_HSL.exec(val);","                if (matches) {","                    arr = [ matches[1], matches[2], matches[3] ];","                }","                break;","            case 'hsla':","            case 'hslacss':","                if (Y.Lang.isArray(val) && val.length === 4) {","                    options.opacity = val.pop();","                    arr = val.concat();","                    break;","                }","                matches = REGEX_HSLA.exec(val);","                if (matches) {","                    options.opacity = matches[4];","                    arr = [ matches[1], matches[2], matches[3] ];","                }","                break;","            default:","                return options;","        }","","        options.type = type.replace(/a?(css)?$/,'');","        options.value = arr;","","        return options;","    },","","    /**","    Converts the color value from the adjusted type to desired return","      values. Updates options.type with converted type. Updates","      options.value with new value array.","","    @protected","    @method _convertTo","    @param {Object} options","      @param {String} options.type identifies the type of color provided","      @param {Array} options.value color value to be converted","      @param {String} options.to desired converted color type","    @param {String} [to] (Optional) Overrides options.to if defined","    @returns {Object}","    **/","    _convertTo: function(options, to) {","        var  _options = Y.merge(options),","            from,","            val;","","        _options.to = to || _options.to;","        _options = Color._toArray(_options);","","        from = _options.type;","        val = _options.value;","        to = _options.to;","","        if (from === to) {","            return _options;","        }","","        if (from === HEX) {","            val = Color._fromHexToRGB(val);","            if (to === HSL) {","                val = Color._fromRGBToHSL(val);","            }","        } else if (from === RGB) {","            if (to === HEX) {","                val = Color._fromRGBToHex(val);","            } else if (to === HSL) {","                val = Color._fromRGBToHSL(val);","            }","        } else if (from === HSL) {","            val = Color._fromHSLToRGB(val);","            if (to === HEX) {","                val = Color._fromRGBToHex(val);","            }","        }","","        _options.type = to;","        _options.value = val;","        return _options;","    },","","","    /**","    Creates an array ([h,s,l]) from the provided value array ([r,g,b])","","    @protected","    @method _fromRGBToHSL","    @param {array} [val] color value to be converted","    @returns {array}","    **/","    _fromRGBToHSL: function(val) {","        // assume input is [r,g,b]","        // TODO: Find legals for use of formula","        var r = parseFloat(val[0], 10) / 255,","            g = parseFloat(val[1], 10) / 255,","            b = parseFloat(val[2], 10) / 255,","            max = Math.max(r, g, b),","            min = Math.min(r, g, b),","            h,","            s,","            l,","            isGrayScale = false,","            sub = max - min,","            sum = max + min;","","        if (r === g && g === b) {","            isGrayScale = true;","        }","","        // hue","        if (sub === 0) {","            h = 0;","        } else if (r === max) {","            h = ((60 * (g - b) / sub) + 360) % 360;","        } else if (g === max) {","            h = (60 * (b - r) / sub) + 120;","        } else {","            h = (60 * (r - g) / sub) + 240;","        }","","        // lightness","        l = sum / 2;","","        // saturation","        if (l === 0 || l === 1) {","            s = l;","        } else if (l <= 0.5) {","            s = sub / sum;","        } else {","            s = sub / (2 - sum);","        }","","        if (isGrayScale) {","            s = 0;","        }","","        // clean up hsl","        h = Math.round(h);","        s = Math.round(s * 100);","        l = Math.round(l * 100);","","        return [h, s, l];","    },","    /**","    Creates an array ([r,g,b]) from the provided value array ([h,s,l])","","    @protected","    @method _fromRGBToHSL","    @param {array} [val] color value to be converted","    @returns {array}","    **/","    _fromHSLToRGB: function(val) {","        // assume input is [h, s, l]","        // TODO: Find legals for use of formula","        var h = parseInt(val[0], 10) /360,","            s = parseInt(val[1], 10) / 100,","            l = parseInt(val[2], 10) / 100,","            r,","            g,","            b,","            p,","            q;","","        if (l <= 0.5) {","            q = l * (s + 1);","        } else {","            q = (l + s) - (l * s);","        }","","        p = 2 * l - q;","","        r = Math.round(Color._hueToRGB(p, q, h + 1/3) * 255);","        g = Math.round(Color._hueToRGB(p, q, h) * 255);","        b = Math.round(Color._hueToRGB(p, q, h - 1/3) * 255);","","        return [r, g, b];","    },","","    /**","    Converts the HSL hue to the different channels for RGB","","    @protected","    @method _hueToRGB","    @param {Number} [p]","    @param {Number} [q]","    @param {Number} [hue]","    @return {Number} value for requested channel","    **/","    _hueToRGB: function(p, q, hue) {","        // TODO: Find legals for use of formula","        if (hue < 0) {","            hue += 1;","        } else if (hue > 1) {","            hue -= 1;","        }","","        if (hue * 6 < 1) {","            return p + (q - p) * 6 * hue;","        }","        if (hue * 2 < 1) {","            return q;","        }","        if (hue * 3 < 2) {","            return p + (q - p) * (2/3 - hue) * 6;","        }","        return p;","    }","};","","Y.mix(Color, Y.Color);","Y.Color = Color;","","","}, '@VERSION@', {\"requires\": [\"color-base\"]});"];
_yuitest_coverage["build/color/color.js"].lines = {"1":0,"64":0,"111":0,"112":0,"113":0,"114":0,"115":0,"116":0,"132":0,"133":0,"138":0,"139":0,"140":0,"142":0,"157":0,"158":0,"163":0,"164":0,"165":0,"167":0,"182":0,"183":0,"184":0,"185":0,"187":0,"202":0,"203":0,"204":0,"206":0,"207":0,"208":0,"209":0,"211":0,"226":0,"227":0,"228":0,"229":0,"230":0,"231":0,"233":0,"252":0,"254":0,"255":0,"258":0,"259":0,"260":0,"261":0,"262":0,"263":0,"264":0,"265":0,"266":0,"267":0,"268":0,"269":0,"272":0,"290":0,"295":0,"296":0,"298":0,"299":0,"301":0,"303":0,"304":0,"307":0,"308":0,"309":0,"310":0,"312":0,"313":0,"314":0,"320":0,"323":0,"324":0,"325":0,"327":0,"328":0,"329":0,"331":0,"334":0,"335":0,"336":0,"337":0,"339":0,"340":0,"341":0,"342":0,"344":0,"347":0,"348":0,"349":0,"351":0,"352":0,"353":0,"355":0,"358":0,"359":0,"360":0,"361":0,"363":0,"364":0,"365":0,"366":0,"368":0,"370":0,"373":0,"374":0,"376":0,"394":0,"398":0,"399":0,"401":0,"402":0,"403":0,"405":0,"406":0,"409":0,"410":0,"411":0,"412":0,"414":0,"415":0,"416":0,"417":0,"418":0,"420":0,"421":0,"422":0,"423":0,"427":0,"428":0,"429":0,"444":0,"456":0,"457":0,"461":0,"462":0,"463":0,"464":0,"465":0,"466":0,"468":0,"472":0,"475":0,"476":0,"477":0,"478":0,"480":0,"483":0,"484":0,"488":0,"489":0,"490":0,"492":0,"505":0,"514":0,"515":0,"517":0,"520":0,"522":0,"523":0,"524":0,"526":0,"541":0,"542":0,"543":0,"544":0,"547":0,"548":0,"550":0,"551":0,"553":0,"554":0,"556":0,"560":0,"561":0};
_yuitest_coverage["build/color/color.js"].functions = {"convert:110":0,"toHex:131":0,"toRGB:156":0,"toRGBA:181":0,"toHSL:201":0,"toHSLA:225":0,"_findType:251":0,"_toArray:289":0,"_convertTo:393":0,"_fromRGBToHSL:441":0,"_fromHSLToRGB:502":0,"_hueToRGB:539":0,"(anonymous 1):1":0};
_yuitest_coverage["build/color/color.js"].coveredLines = 176;
_yuitest_coverage["build/color/color.js"].coveredFunctions = 13;
_yuitest_coverline("build/color/color.js", 1);
YUI.add('color', function (Y, NAME) {

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
_yuitest_coverfunc("build/color/color.js", "(anonymous 1)", 1);
_yuitest_coverline("build/color/color.js", 64);
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
        _yuitest_coverfunc("build/color/color.js", "convert", 110);
_yuitest_coverline("build/color/color.js", 111);
switch (options.to) {
            case 'hex': _yuitest_coverline("build/color/color.js", 112);
return Color.toHex(options);
            case 'rgb': _yuitest_coverline("build/color/color.js", 113);
return Color.toRGB(options);
            case 'rgba': _yuitest_coverline("build/color/color.js", 114);
return Color.toRGBA(options);
            case 'hsl': _yuitest_coverline("build/color/color.js", 115);
return Color.toHSL(options);
            case 'hsla': _yuitest_coverline("build/color/color.js", 116);
return Color.toHSLA(options);
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
        _yuitest_coverfunc("build/color/color.js", "toHex", 131);
_yuitest_coverline("build/color/color.js", 132);
if (Y.Lang.isString(options)) { // Preserve backwards compatability
            _yuitest_coverline("build/color/color.js", 133);
options = {
                value: options,
                css: true
            };
        }
        _yuitest_coverline("build/color/color.js", 138);
options = Color._convertTo(options, HEX);
        _yuitest_coverline("build/color/color.js", 139);
if (options.css) {
            _yuitest_coverline("build/color/color.js", 140);
return '#' + options.value.join('');
        }
        _yuitest_coverline("build/color/color.js", 142);
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
        _yuitest_coverfunc("build/color/color.js", "toRGB", 156);
_yuitest_coverline("build/color/color.js", 157);
if (Y.Lang.isString(options)) { // Preserve backwards compatability
            _yuitest_coverline("build/color/color.js", 158);
options = {
                value: options,
                css: true
            };
        }
        _yuitest_coverline("build/color/color.js", 163);
options = Color._convertTo(options, RGB);
        _yuitest_coverline("build/color/color.js", 164);
if (options.css) {
            _yuitest_coverline("build/color/color.js", 165);
return 'rgb(' + options.value.join(', ') + ')';
        }
        _yuitest_coverline("build/color/color.js", 167);
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
        _yuitest_coverfunc("build/color/color.js", "toRGBA", 181);
_yuitest_coverline("build/color/color.js", 182);
options = Color._convertTo(options, RGB);
        _yuitest_coverline("build/color/color.js", 183);
options.value.push(Y.Lang.isNumber(options.opacity) ? options.opacity : 1);
        _yuitest_coverline("build/color/color.js", 184);
if (options.css) {
            _yuitest_coverline("build/color/color.js", 185);
return 'rgba(' + options.value.join(', ') + ')';
        }
        _yuitest_coverline("build/color/color.js", 187);
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
        _yuitest_coverfunc("build/color/color.js", "toHSL", 201);
_yuitest_coverline("build/color/color.js", 202);
options = Color._convertTo(options, HSL);
        _yuitest_coverline("build/color/color.js", 203);
options.value[1] = Math.round( options.value[1] * 100 ) / 100;
        _yuitest_coverline("build/color/color.js", 204);
options.value[2] = Math.round( options.value[2] * 100 ) / 100;

        _yuitest_coverline("build/color/color.js", 206);
if (options.css) {
            _yuitest_coverline("build/color/color.js", 207);
options.value[1] += '%';
            _yuitest_coverline("build/color/color.js", 208);
options.value[2] += '%';
            _yuitest_coverline("build/color/color.js", 209);
return 'hsl(' + options.value.join(', ') + ')';
        }
        _yuitest_coverline("build/color/color.js", 211);
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
        _yuitest_coverfunc("build/color/color.js", "toHSLA", 225);
_yuitest_coverline("build/color/color.js", 226);
options = Color._convertTo(options, HSL);
        _yuitest_coverline("build/color/color.js", 227);
options.value.push(Y.Lang.isNumber(options.opacity) ? options.opacity : 1);
        _yuitest_coverline("build/color/color.js", 228);
if (options.css) {
            _yuitest_coverline("build/color/color.js", 229);
options.value[1] += '%';
            _yuitest_coverline("build/color/color.js", 230);
options.value[2] += '%';
            _yuitest_coverline("build/color/color.js", 231);
return 'hsla(' + options.value.join(', ') + ')';
        }
        _yuitest_coverline("build/color/color.js", 233);
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
        _yuitest_coverfunc("build/color/color.js", "_findType", 251);
_yuitest_coverline("build/color/color.js", 252);
var val = options.value;

        _yuitest_coverline("build/color/color.js", 254);
if (Y.Lang.isArray(val)) {
            _yuitest_coverline("build/color/color.js", 255);
return options;
        }

        _yuitest_coverline("build/color/color.js", 258);
if (KEYWORDS[val]) {
            _yuitest_coverline("build/color/color.js", 259);
options.type = 'keyword';
        } else {_yuitest_coverline("build/color/color.js", 260);
if (REGEX_RGB.exec(val)) {
            _yuitest_coverline("build/color/color.js", 261);
options.type = RGB;
        } else {_yuitest_coverline("build/color/color.js", 262);
if (REGEX_RGBA.exec(val)) {
            _yuitest_coverline("build/color/color.js", 263);
options.type = RGB + 'a';
        } else {_yuitest_coverline("build/color/color.js", 264);
if (REGEX_HSL.exec(val)) {
            _yuitest_coverline("build/color/color.js", 265);
options.type = HSL;
        } else {_yuitest_coverline("build/color/color.js", 266);
if (REGEX_HSLA.exec(val)) {
            _yuitest_coverline("build/color/color.js", 267);
options.type = HSL + 'a';
        } else {_yuitest_coverline("build/color/color.js", 268);
if (REGEX_HEX.exec(val) || REGEX_HEX3.exec(val)) {
            _yuitest_coverline("build/color/color.js", 269);
options.type = HEX;
        }}}}}}

        _yuitest_coverline("build/color/color.js", 272);
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
        _yuitest_coverfunc("build/color/color.js", "_toArray", 289);
_yuitest_coverline("build/color/color.js", 290);
var arr = [],
            matches = null,
            type = null,
            val = options.value;

        _yuitest_coverline("build/color/color.js", 295);
if (options.type === 'auto' || typeof options.type === 'undefined') {
            _yuitest_coverline("build/color/color.js", 296);
options = Color._findType(options);
        }
        _yuitest_coverline("build/color/color.js", 298);
type = options.type.toLowerCase();
        _yuitest_coverline("build/color/color.js", 299);
val = (Y.Lang.isString(val)) ? val.toLowerCase() : val;

        _yuitest_coverline("build/color/color.js", 301);
switch(type) {
            case 'keyword':
                _yuitest_coverline("build/color/color.js", 303);
val = KEYWORDS[val];
                _yuitest_coverline("build/color/color.js", 304);
type = 'hex';
                // break; overflow intentional
            case 'hex':
                _yuitest_coverline("build/color/color.js", 307);
matches = REGEX_HEX.exec(val);
                _yuitest_coverline("build/color/color.js", 308);
if (matches) {
                    _yuitest_coverline("build/color/color.js", 309);
arr = [matches[2], matches[3], matches[4]];
                    _yuitest_coverline("build/color/color.js", 310);
break;
                }
                _yuitest_coverline("build/color/color.js", 312);
matches = REGEX_HEX3.exec(val);
                _yuitest_coverline("build/color/color.js", 313);
if (matches) {
                    _yuitest_coverline("build/color/color.js", 314);
arr = [
                        matches[2].toString() + matches[2],
                        matches[3].toString() + matches[3],
                        matches[4].toString() + matches[4]
                        ];
                }
                _yuitest_coverline("build/color/color.js", 320);
break;
            case 'rgb':
            case 'rbgcss':
                _yuitest_coverline("build/color/color.js", 323);
if (Y.Lang.isArray(val) && val.length === 3) {
                    _yuitest_coverline("build/color/color.js", 324);
arr = val.concat();
                    _yuitest_coverline("build/color/color.js", 325);
break;
                }
                _yuitest_coverline("build/color/color.js", 327);
matches = REGEX_RGB.exec(val);
                _yuitest_coverline("build/color/color.js", 328);
if (matches) {
                    _yuitest_coverline("build/color/color.js", 329);
arr = [ matches[1], matches[2], matches[3] ];
                }
                _yuitest_coverline("build/color/color.js", 331);
break;
            case 'rgba':
            case 'rgbacss':
                _yuitest_coverline("build/color/color.js", 334);
if (Y.Lang.isArray(val) && val.length === 4) {
                    _yuitest_coverline("build/color/color.js", 335);
options.opacity = val.pop();
                    _yuitest_coverline("build/color/color.js", 336);
arr = val.concat();
                    _yuitest_coverline("build/color/color.js", 337);
break;
                }
                _yuitest_coverline("build/color/color.js", 339);
matches = REGEX_RGBA.exec(val);
                _yuitest_coverline("build/color/color.js", 340);
if (matches) {
                    _yuitest_coverline("build/color/color.js", 341);
options.opacity = matches[4];
                    _yuitest_coverline("build/color/color.js", 342);
arr = [ matches[1], matches[2], matches[3] ];
                }
                _yuitest_coverline("build/color/color.js", 344);
break;
            case 'hsl':
            case 'hslcss':
                _yuitest_coverline("build/color/color.js", 347);
if (Y.Lang.isArray(val) && val.length === 3) {
                    _yuitest_coverline("build/color/color.js", 348);
arr = val.concat();
                    _yuitest_coverline("build/color/color.js", 349);
break;
                }
                _yuitest_coverline("build/color/color.js", 351);
matches = REGEX_HSL.exec(val);
                _yuitest_coverline("build/color/color.js", 352);
if (matches) {
                    _yuitest_coverline("build/color/color.js", 353);
arr = [ matches[1], matches[2], matches[3] ];
                }
                _yuitest_coverline("build/color/color.js", 355);
break;
            case 'hsla':
            case 'hslacss':
                _yuitest_coverline("build/color/color.js", 358);
if (Y.Lang.isArray(val) && val.length === 4) {
                    _yuitest_coverline("build/color/color.js", 359);
options.opacity = val.pop();
                    _yuitest_coverline("build/color/color.js", 360);
arr = val.concat();
                    _yuitest_coverline("build/color/color.js", 361);
break;
                }
                _yuitest_coverline("build/color/color.js", 363);
matches = REGEX_HSLA.exec(val);
                _yuitest_coverline("build/color/color.js", 364);
if (matches) {
                    _yuitest_coverline("build/color/color.js", 365);
options.opacity = matches[4];
                    _yuitest_coverline("build/color/color.js", 366);
arr = [ matches[1], matches[2], matches[3] ];
                }
                _yuitest_coverline("build/color/color.js", 368);
break;
            default:
                _yuitest_coverline("build/color/color.js", 370);
return options;
        }

        _yuitest_coverline("build/color/color.js", 373);
options.type = type.replace(/a?(css)?$/,'');
        _yuitest_coverline("build/color/color.js", 374);
options.value = arr;

        _yuitest_coverline("build/color/color.js", 376);
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
        _yuitest_coverfunc("build/color/color.js", "_convertTo", 393);
_yuitest_coverline("build/color/color.js", 394);
var  _options = Y.merge(options),
            from,
            val;

        _yuitest_coverline("build/color/color.js", 398);
_options.to = to || _options.to;
        _yuitest_coverline("build/color/color.js", 399);
_options = Color._toArray(_options);

        _yuitest_coverline("build/color/color.js", 401);
from = _options.type;
        _yuitest_coverline("build/color/color.js", 402);
val = _options.value;
        _yuitest_coverline("build/color/color.js", 403);
to = _options.to;

        _yuitest_coverline("build/color/color.js", 405);
if (from === to) {
            _yuitest_coverline("build/color/color.js", 406);
return _options;
        }

        _yuitest_coverline("build/color/color.js", 409);
if (from === HEX) {
            _yuitest_coverline("build/color/color.js", 410);
val = Color._fromHexToRGB(val);
            _yuitest_coverline("build/color/color.js", 411);
if (to === HSL) {
                _yuitest_coverline("build/color/color.js", 412);
val = Color._fromRGBToHSL(val);
            }
        } else {_yuitest_coverline("build/color/color.js", 414);
if (from === RGB) {
            _yuitest_coverline("build/color/color.js", 415);
if (to === HEX) {
                _yuitest_coverline("build/color/color.js", 416);
val = Color._fromRGBToHex(val);
            } else {_yuitest_coverline("build/color/color.js", 417);
if (to === HSL) {
                _yuitest_coverline("build/color/color.js", 418);
val = Color._fromRGBToHSL(val);
            }}
        } else {_yuitest_coverline("build/color/color.js", 420);
if (from === HSL) {
            _yuitest_coverline("build/color/color.js", 421);
val = Color._fromHSLToRGB(val);
            _yuitest_coverline("build/color/color.js", 422);
if (to === HEX) {
                _yuitest_coverline("build/color/color.js", 423);
val = Color._fromRGBToHex(val);
            }
        }}}

        _yuitest_coverline("build/color/color.js", 427);
_options.type = to;
        _yuitest_coverline("build/color/color.js", 428);
_options.value = val;
        _yuitest_coverline("build/color/color.js", 429);
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
        _yuitest_coverfunc("build/color/color.js", "_fromRGBToHSL", 441);
_yuitest_coverline("build/color/color.js", 444);
var r = parseFloat(val[0], 10) / 255,
            g = parseFloat(val[1], 10) / 255,
            b = parseFloat(val[2], 10) / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h,
            s,
            l,
            isGrayScale = false,
            sub = max - min,
            sum = max + min;

        _yuitest_coverline("build/color/color.js", 456);
if (r === g && g === b) {
            _yuitest_coverline("build/color/color.js", 457);
isGrayScale = true;
        }

        // hue
        _yuitest_coverline("build/color/color.js", 461);
if (sub === 0) {
            _yuitest_coverline("build/color/color.js", 462);
h = 0;
        } else {_yuitest_coverline("build/color/color.js", 463);
if (r === max) {
            _yuitest_coverline("build/color/color.js", 464);
h = ((60 * (g - b) / sub) + 360) % 360;
        } else {_yuitest_coverline("build/color/color.js", 465);
if (g === max) {
            _yuitest_coverline("build/color/color.js", 466);
h = (60 * (b - r) / sub) + 120;
        } else {
            _yuitest_coverline("build/color/color.js", 468);
h = (60 * (r - g) / sub) + 240;
        }}}

        // lightness
        _yuitest_coverline("build/color/color.js", 472);
l = sum / 2;

        // saturation
        _yuitest_coverline("build/color/color.js", 475);
if (l === 0 || l === 1) {
            _yuitest_coverline("build/color/color.js", 476);
s = l;
        } else {_yuitest_coverline("build/color/color.js", 477);
if (l <= 0.5) {
            _yuitest_coverline("build/color/color.js", 478);
s = sub / sum;
        } else {
            _yuitest_coverline("build/color/color.js", 480);
s = sub / (2 - sum);
        }}

        _yuitest_coverline("build/color/color.js", 483);
if (isGrayScale) {
            _yuitest_coverline("build/color/color.js", 484);
s = 0;
        }

        // clean up hsl
        _yuitest_coverline("build/color/color.js", 488);
h = Math.round(h);
        _yuitest_coverline("build/color/color.js", 489);
s = Math.round(s * 100);
        _yuitest_coverline("build/color/color.js", 490);
l = Math.round(l * 100);

        _yuitest_coverline("build/color/color.js", 492);
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
        _yuitest_coverfunc("build/color/color.js", "_fromHSLToRGB", 502);
_yuitest_coverline("build/color/color.js", 505);
var h = parseInt(val[0], 10) /360,
            s = parseInt(val[1], 10) / 100,
            l = parseInt(val[2], 10) / 100,
            r,
            g,
            b,
            p,
            q;

        _yuitest_coverline("build/color/color.js", 514);
if (l <= 0.5) {
            _yuitest_coverline("build/color/color.js", 515);
q = l * (s + 1);
        } else {
            _yuitest_coverline("build/color/color.js", 517);
q = (l + s) - (l * s);
        }

        _yuitest_coverline("build/color/color.js", 520);
p = 2 * l - q;

        _yuitest_coverline("build/color/color.js", 522);
r = Math.round(Color._hueToRGB(p, q, h + 1/3) * 255);
        _yuitest_coverline("build/color/color.js", 523);
g = Math.round(Color._hueToRGB(p, q, h) * 255);
        _yuitest_coverline("build/color/color.js", 524);
b = Math.round(Color._hueToRGB(p, q, h - 1/3) * 255);

        _yuitest_coverline("build/color/color.js", 526);
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
        _yuitest_coverfunc("build/color/color.js", "_hueToRGB", 539);
_yuitest_coverline("build/color/color.js", 541);
if (hue < 0) {
            _yuitest_coverline("build/color/color.js", 542);
hue += 1;
        } else {_yuitest_coverline("build/color/color.js", 543);
if (hue > 1) {
            _yuitest_coverline("build/color/color.js", 544);
hue -= 1;
        }}

        _yuitest_coverline("build/color/color.js", 547);
if (hue * 6 < 1) {
            _yuitest_coverline("build/color/color.js", 548);
return p + (q - p) * 6 * hue;
        }
        _yuitest_coverline("build/color/color.js", 550);
if (hue * 2 < 1) {
            _yuitest_coverline("build/color/color.js", 551);
return q;
        }
        _yuitest_coverline("build/color/color.js", 553);
if (hue * 3 < 2) {
            _yuitest_coverline("build/color/color.js", 554);
return p + (q - p) * (2/3 - hue) * 6;
        }
        _yuitest_coverline("build/color/color.js", 556);
return p;
    }
};

_yuitest_coverline("build/color/color.js", 560);
Y.mix(Color, Y.Color);
_yuitest_coverline("build/color/color.js", 561);
Y.Color = Color;


}, '@VERSION@', {"requires": ["color-base"]});

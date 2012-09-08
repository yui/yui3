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
_yuitest_coverage["build/color-harmony/color-harmony.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/color-harmony/color-harmony.js",
    code: []
};
_yuitest_coverage["build/color-harmony/color-harmony.js"].code=["YUI.add('color-harmony', function (Y, NAME) {","","/**","Color provides static methods for color conversion.","","For all cases of option.type, valid types are:","","- **keyword**:","option.value - must be a keyword in Y.Color.KEYWORDS","","- **hex**:","option.value - 3 or 6 character representation with or without a '#' or Array of `[rr, gg, bb]` strings","","- **rgb**:","option.value - `rgb(r, g, b)` string or Array of `[r, g, b]` values","","- **rgba**:","option.value - `rgba(r, g, b, a)` string or Array of `[r, g, b, a]` values","","- **hsl**:","option.value - `hsl(h, s%, l%)` string or Array of `[h, s, l]` values","","- **hsla**:","option.value - `hsla(h, s%, l%, a)` string or Array of `[h, s, l, a]` values","","In all cases of option.to, valid types are:","","- **hex**:","returns `[rr, gg, bb]` or `#rrggbb` if options.css is true","","- **rgb**:","returns `[r, g, b]` or `rgb(r, g, b)` if options.css is true","","- **rgba**:","returns `[r, g, b, a]` or `rgba(r, g, b, a)` if options.css is true","","- **hsl**:","returns `[h, s, l]` or `hsl(h, s%, l%)` if options.css is true","","- **hsla**:","returns `[h, s, l, a]` or `hsla(h, s%, l%, a)` if options.css is true","","The following is an example of how these features can be used:","    var blue = { type: 'hex', value: '#0000ff', css: true };","","    Y.Color.getComplementary(blue); // #ff7700","","    Y.Color.getOffset(blue, {h: 10}); // #2a00ff","","    Y.Color.getOffset(blue, {l: -10}); // #0000cc","","","@module color","@submodule color-harmony","@class Harmony","@namespace Color","@since 3.6.1","*/","var HSL = 'hsl',","    RGB = 'rgb',","","    SPLIT_OFFSET = 30,","    ANALOGOUS_OFFSET = 10,","    TRIAD_OFFSET = 360/3,","    TETRAD_OFFSET = 360/6,","    SQUARE_OFFSET = 360/4 ,","","    DEF_COUNT = 5,","    DEF_OFFSET = 10,","","    Color = Y.Color,","","","","    ColorExtras = {","","        // Color Groups","        /**","        Returns the complementary color of the color provided","","        @public","        @method getComplementary","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getComplementary: function(options) {","            var c = ColorExtras._start(options),","                c1 = Y.merge(c),","                to = options.to || c.type;","","            c1.value = c1.value.concat();","            c1 = ColorExtras.getOffset(c1, {h: 180}, true);","","            return [","                    ColorExtras._finish(c, to),","                    ColorExtras._finish(c1, to)","                ];","","        },","","        /**","        Returns an Array of three colors. The first color in the Array","          will be the color passed in. The second two will be split","          complementary colors.","","        @public","        @method getSplit","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getSplit: function(options) {","            var c = ColorExtras._start(options),","                c1,","                c2,","                to;","","            c = ColorExtras.getOffset(c, {h: 180}, true);","","            c1 = Y.merge(c);","            c1.value = c1.value.concat();","            c1 = ColorExtras.getOffset(c1, {h: SPLIT_OFFSET}, true);","","            c2 = Y.merge(c);","            c2.value = c2.value.concat();","            c2 = ColorExtras.getOffset(c2, {h: -SPLIT_OFFSET}, true);","","            // set base color back to original value","            c = ColorExtras.getOffset(c, {h: 180}, true);","","            to = options.to || c.type;","","            return [","                ColorExtras._finish(c, to),","                ColorExtras._finish(c1, to),","                ColorExtras._finish(c2, to)","            ];","        },","","        /**","        Returns an Array of five colors. The first color in the Array","          will be the color passed in. The remaining four will be","          analogous colors two in either direction from the initially","          provided color.","","        @public","        @method getAnalogous","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","          @param {Number} options.offset plus or minus maximum to offset for the analogous color","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getAnalogous: function(options) {","            var c = ColorExtras._start(options),","                c1,","                c2,","                c3,","                c4,","                offset = options.offset || ANALOGOUS_OFFSET,","                to;","","            c1 = Y.merge(c);","            c1.value = c1.value.concat();","            c1 = ColorExtras.getOffset(c1, {h: offset}, true);","","            c2 = Y.merge(c1);","            c2.value = c2.value.concat();","            c2 = ColorExtras.getOffset(c2, {h: offset}, true);","","            c3 = Y.merge(c);","            c3.value = c3.value.concat();","            c3 = ColorExtras.getOffset(c3, {h: -offset}, true);","","            c4 = Y.merge(c3);","            c4.value = c4.value.concat();","            c4 = ColorExtras.getOffset(c4, {h: -offset}, true);","","            to = options.to || c.type;","","            return [","                ColorExtras._finish(c, to),","                ColorExtras._finish(c1, to),","                ColorExtras._finish(c2, to),","                ColorExtras._finish(c3, to),","                ColorExtras._finish(c4, to)","            ];","        },","","        /**","        Returns an Array of three colors. The first color in the Array","          will be the color passed in. The second two will be equidistant","          from the start color and each other.","","        @public","        @method getTriad","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getTriad: function(options) {","            var c = ColorExtras._start(options),","                c1,","                c2,","                to;","","            c1 = Y.merge(c);","            c1.value = c1.value.concat();","            c1 = ColorExtras.getOffset(c1, {h: TRIAD_OFFSET}, true);","","            c2 = Y.merge(c1);","            c2.value = c2.value.concat();","            c2 = ColorExtras.getOffset(c2, {h: TRIAD_OFFSET}, true);","","            to = options.to || c.type;","","            return [","                ColorExtras._finish(c, to),","                ColorExtras._finish(c1, to),","                ColorExtras._finish(c2, to)","            ];","        },","","        /**","        Returns an Array of four colors. The first color in the Array","          will be the color passed in. The remaining three colors are","          equidistant offsets from the starting color and each other.","","        @public","        @method getTetrad","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getTetrad: function(options) {","            var c = ColorExtras._start(options),","                c1,","                c2,","                c3,","                offset = options.offset || TETRAD_OFFSET,","                to;","","            c1 = Y.merge(c);","            c1.value = c1.value.concat();","            c1 = ColorExtras.getOffset(c1, {h: offset}, true);","","            c2 = Y.merge(c);","            c2.value = c2.value.concat();","            c2 = ColorExtras.getOffset(c2, {h: 180}, true);","","            c3 = Y.merge(c2);","            c3.value = c3.value.concat();","            c3 = ColorExtras.getOffset(c3, {h: offset}, true);","","            to = options.to || c.type;","","            return [","                ColorExtras._finish(c, to),","                ColorExtras._finish(c1, to),","                ColorExtras._finish(c2, to),","                ColorExtras._finish(c3, to)","            ];","        },","","        /**","        Returns an Array of four colors. The first color in the Array","          will be the color passed in. The remaining three colors are","          equidistant offsets from the starting color and each other.","","        @public","        @method getSquare","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getSquare: function(options) {","            var c = ColorExtras._start(options),","                c1,","                c2,","                c3,","                to;","","            c1 = Y.merge(c);","            c1.value = c1.value.concat();","            c1 = ColorExtras.getOffset(c1, {h: SQUARE_OFFSET}, true);","","            c2 = Y.merge(c1);","            c2.value = c2.value.concat();","            c2 = ColorExtras.getOffset(c2, {h: SQUARE_OFFSET}, true);","","            c3 = Y.merge(c2);","            c3.value = c3.value.concat();","            c3 = ColorExtras.getOffset(c3, {h: SQUARE_OFFSET}, true);","","            to = options.to || c.type;","","            return [","                ColorExtras._finish(c, to),","                ColorExtras._finish(c1, to),","                ColorExtras._finish(c2, to),","                ColorExtras._finish(c3, to)","            ];","        },","","        /**","        Calculates saturation offsets resulting in a monochromatic Array of values.","","        @public","        @method getMonochrome","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","          @param {Number} options.count denotes the requested number of monochromatic values returned","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getMonochrome: function(options) {","            var c = ColorExtras._start(options),","                colors = [],","                i = 0,","                l,","                to,","                count = options.count || DEF_COUNT,","                step,","                _c = Y.merge(c);","","            if (count < 2) {","                return options;","            }","            step = 100 / (count - 1);","","            for (; i <= 100; i += step) {","                _c.value = _c.value.concat();","                _c.value[2] = Math.max(Math.min(i, 100), 0);","                colors.push(_c);","                _c = Y.merge(_c);","            }","","            to = options.to || c.type;","","            l = colors.length;","","            for (i=0; i<l; i++) {","                colors[i] = ColorExtras._finish(colors[i], to);","            }","","            return colors;","        },","","        /**","        Creates an Array of similar colors. Returned Array is prepended","           with the color provided followed a number of colors decided","           by options.count","","        @public","        @method getSimilar","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","          @param {Number} options.count denotes the requested number of similar values returned","          @param {Number} options.offset plus or minus maximum to offset the hue, saturation, and lightness","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getSimilar: function(options) {","            var c = ColorExtras._start(options),","                colors = [c],","                i = 0,","                l,","                to,","                count = options.count || DEF_COUNT,","                offset = options.offset || DEF_OFFSET,","                _c;","","            for (; i < count; i++) {","                _c = Y.merge(c);","                _c.value = _c.value.concat();","                _c = ColorExtras.getOffset(_c, {","                    h: ( Math.random() * (offset * 2)) - offset,","                    s: ( Math.random() * (offset * 2)) - offset,","                    l: ( Math.random() * (offset * 2)) - offset","                }, true);","                colors.push(_c);","            }","","            to = options.to || c.type;","","            l = colors.length;","","            for (i=0; i<l; i++) {","                colors[i] = ColorExtras._finish(colors[i], to);","            }","","            return colors;","        },","","        /**","        Converts provided color value to the desired return type","","        @public","        @method getOffset","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @param {Object} adjust","          @param {Number} [adjust.h] Amount to adjust hue positive or negative","          @param {Number} [adjust.s] Amount to adjust saturation positive or negative","          @param {Number} [adjust.l] Amount to adjust luminance positive or negative","        @param {Boolean} started Denotes if the options pass have already been processed through _start()","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getOffset: function(options, adjust, started) {","            var c = options;","","            if (!started) {","                c = ColorExtras._start(options);","            }","","            if (adjust.h) {","                c.value[0] = (c.value[0] + adjust.h) % 360;","            }","","            if (adjust.s) {","                c.value[1] = Math.max(Math.min(c.value[1] + adjust.s, 100), 0);","            }","","            if (adjust.l) {","                c.value[2] = Math.max(Math.min(c.value[2] + adjust.l, 100), 0);","            }","","            if (!started) {","                return ColorExtras._finish(c, options.to || c.type);","            }","","            return c;","        },","","        /**","        Returns 0 - 1 percentage of brightness from black (0) being the","          darkest to white (1) being the brightest.","","        @public","        @method getBrightness","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","        @return {Float} 0 - 1","        **/","        getBrightness: function(options) {","            var c = Color._convertTo(options, RGB),","                r = c.value[0],","                g = c.value[1],","                b = c.value[2],","                weights = ColorExtras._brightnessWeights;","","","            return (Math.sqrt(","                (r * r * weights.r) +","                (g * g * weights.g) +","                (b * b * weights.b)","            ) / 255);","        },","","        /**","        Converts provided color value to the desired return type","","        @public","        @method getSimilarBrightness","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @param {Object} match","          @param {String} match.type identifies the type of color provided","          @param {String|Array} match.value color value to be converted","        @returns {String|Array} returns Array of values or CSS string if options.css is true","        **/","        getSimilarBrightness: function(options, match){","            var c = Color._convertTo(options, HSL),","                b = ColorExtras.getBrightness(match);","","            c.value = c.value.concat();","            c.value[2] = ColorExtras._searchLuminanceForBrightness(c, b, 0, 100);","","            c.to = options.to || c.type;","","            return Color.convert(c);","        },","","        //--------------------","        // PRIVATE","        //--------------------","        /**","        Copy and converts color to additive as most methods need to be additive to begin conversion","        @private","        @method _start","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @return {Object} Converted additive HSL color","        */","        _start: function(options) {","            var c = Color._convertTo(options, HSL);","            c.value = ColorExtras._toSubtractive(c.value);","","            return c;","        },","","        /**","        Converts color to subtractive then convert to the provided 'to' or back to what it started as","        @private","        @method _finish","        @param {Object} options","          @param {String} options.type identifies the type of color provided","          @param {String|Array} options.value color value to be converted","          @param {String} options.to desired converted color type","          @param {Boolean} options.css denotes if the returned value should be a CSS string (true) or an Array of color values","        @return {Object} Converted subtractive color in the options.to format specified or HSL if non is specified","        */","        _finish: function(options, to) {","            options.value = ColorExtras._toAdditive(options.value);","            options.type = HSL;","            options.to = to;","","            return Color.convert(options);","        },","","        /**","        Adjusts the hue degree from subtractive to additive","        @private","        @method _toAdditive","        @param {Array} hue, saturation, luminance","        @return {Array} Converted additive HSL color","        */","        _toAdditive: function(hsl) {","            var hue = hsl[0];","","            if (hue <= 180) {","                hue /= 1.5;","            } else if (hue < 240) {","                hue = 120 + (hue - 180) * 2;","            }","","            if (hue < 0) {","                hue += 360;","            }","","            hsl[0] = Math.round((hue % 360) * 10)/10;","            return hsl;","        },","","        /**","        Adjusts the hue degree from additive to subtractive","        @private","        @method _toSubtractive","        @param {Array} hue, saturation, luminance","        @return {Array} Converted subtractive HSL color","        */","        _toSubtractive: function(hsl) {","            var hue = hsl[0];","","            if (hue <= 120) {","                hue *= 1.5;","            } else if (hue < 240) {","                hue = 180 + (hue - 120) / 2;","            }","","            if (hue < 0) {","                hue += 360;","            }","","            hsl[0] = Math.round((hue % 360) * 10)/10;","            return hsl;","        },","","        /**","        Brightness weight factors for perceived brightness calculations","","        \"standard\" values are listed as R: 0.241, G: 0.691, B: 0.068","        These values were changed based on grey scale comparison of hsl","          to new hsl where brightness is said to be within plus or minus 0.01.","        @private","        @property _brightnessWeights","        */","        _brightnessWeights: {","            r: 0.221,","            g: 0.711,","            b: 0.068","        },","","        /**","        Calculates the luminance as a mid range between the min and max","          to match the brightness level provided","        @private","        @method _searchLuminanceForBrightness","        @param {Object} color","        @param {Number} brightness Brightness of color to match","        @param {Number} min Minimum value of luminance. Used for binary search","        @param {Number} max Maximum value of luminance. Used for binary search","        @return {Number} luminance value for color","        */","        _searchLuminanceForBrightness: function(color, brightness, min, max) {","            var luminance = (max + min) / 2,","                b;","","            color.value[2] = luminance;","            b = ColorExtras.getBrightness(color);","","            if (b + 0.01 > brightness && b - 0.01 < brightness) {","                return luminance;","            } else if (b > brightness) {","                return ColorExtras._searchLuminanceForBrightness(color, brightness, min, luminance);","            } else {","                return ColorExtras._searchLuminanceForBrightness(color, brightness, luminance, max);","            }","        }","    };","","Y.Color = Y.mix(Y.Color, ColorExtras);","","","}, '@VERSION@', {\"requires\": [\"color\"]});"];
_yuitest_coverage["build/color-harmony/color-harmony.js"].lines = {"1":0,"59":0,"91":0,"95":0,"96":0,"98":0,"120":0,"125":0,"127":0,"128":0,"129":0,"131":0,"132":0,"133":0,"136":0,"138":0,"140":0,"164":0,"172":0,"173":0,"174":0,"176":0,"177":0,"178":0,"180":0,"181":0,"182":0,"184":0,"185":0,"186":0,"188":0,"190":0,"214":0,"219":0,"220":0,"221":0,"223":0,"224":0,"225":0,"227":0,"229":0,"251":0,"258":0,"259":0,"260":0,"262":0,"263":0,"264":0,"266":0,"267":0,"268":0,"270":0,"272":0,"295":0,"301":0,"302":0,"303":0,"305":0,"306":0,"307":0,"309":0,"310":0,"311":0,"313":0,"315":0,"337":0,"346":0,"347":0,"349":0,"351":0,"352":0,"353":0,"354":0,"355":0,"358":0,"360":0,"362":0,"363":0,"366":0,"386":0,"395":0,"396":0,"397":0,"398":0,"403":0,"406":0,"408":0,"410":0,"411":0,"414":0,"435":0,"437":0,"438":0,"441":0,"442":0,"445":0,"446":0,"449":0,"450":0,"453":0,"454":0,"457":0,"472":0,"479":0,"502":0,"505":0,"506":0,"508":0,"510":0,"528":0,"529":0,"531":0,"546":0,"547":0,"548":0,"550":0,"561":0,"563":0,"564":0,"565":0,"566":0,"569":0,"570":0,"573":0,"574":0,"585":0,"587":0,"588":0,"589":0,"590":0,"593":0,"594":0,"597":0,"598":0,"628":0,"631":0,"632":0,"634":0,"635":0,"636":0,"637":0,"639":0,"644":0};
_yuitest_coverage["build/color-harmony/color-harmony.js"].functions = {"getComplementary:90":0,"getSplit:119":0,"getAnalogous:163":0,"getTriad:213":0,"getTetrad:250":0,"getSquare:294":0,"getMonochrome:336":0,"getSimilar:385":0,"getOffset:434":0,"getBrightness:471":0,"getSimilarBrightness:501":0,"_start:527":0,"_finish:545":0,"_toAdditive:560":0,"_toSubtractive:584":0,"_searchLuminanceForBrightness:627":0,"(anonymous 1):1":0};
_yuitest_coverage["build/color-harmony/color-harmony.js"].coveredLines = 143;
_yuitest_coverage["build/color-harmony/color-harmony.js"].coveredFunctions = 17;
_yuitest_coverline("build/color-harmony/color-harmony.js", 1);
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
_yuitest_coverfunc("build/color-harmony/color-harmony.js", "(anonymous 1)", 1);
_yuitest_coverline("build/color-harmony/color-harmony.js", 59);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getComplementary", 90);
_yuitest_coverline("build/color-harmony/color-harmony.js", 91);
var c = ColorExtras._start(options),
                c1 = Y.merge(c),
                to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 95);
c1.value = c1.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 96);
c1 = ColorExtras.getOffset(c1, {h: 180}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 98);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getSplit", 119);
_yuitest_coverline("build/color-harmony/color-harmony.js", 120);
var c = ColorExtras._start(options),
                c1,
                c2,
                to;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 125);
c = ColorExtras.getOffset(c, {h: 180}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 127);
c1 = Y.merge(c);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 128);
c1.value = c1.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 129);
c1 = ColorExtras.getOffset(c1, {h: SPLIT_OFFSET}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 131);
c2 = Y.merge(c);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 132);
c2.value = c2.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 133);
c2 = ColorExtras.getOffset(c2, {h: -SPLIT_OFFSET}, true);

            // set base color back to original value
            _yuitest_coverline("build/color-harmony/color-harmony.js", 136);
c = ColorExtras.getOffset(c, {h: 180}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 138);
to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 140);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getAnalogous", 163);
_yuitest_coverline("build/color-harmony/color-harmony.js", 164);
var c = ColorExtras._start(options),
                c1,
                c2,
                c3,
                c4,
                offset = options.offset || ANALOGOUS_OFFSET,
                to;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 172);
c1 = Y.merge(c);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 173);
c1.value = c1.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 174);
c1 = ColorExtras.getOffset(c1, {h: offset}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 176);
c2 = Y.merge(c1);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 177);
c2.value = c2.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 178);
c2 = ColorExtras.getOffset(c2, {h: offset}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 180);
c3 = Y.merge(c);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 181);
c3.value = c3.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 182);
c3 = ColorExtras.getOffset(c3, {h: -offset}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 184);
c4 = Y.merge(c3);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 185);
c4.value = c4.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 186);
c4 = ColorExtras.getOffset(c4, {h: -offset}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 188);
to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 190);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getTriad", 213);
_yuitest_coverline("build/color-harmony/color-harmony.js", 214);
var c = ColorExtras._start(options),
                c1,
                c2,
                to;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 219);
c1 = Y.merge(c);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 220);
c1.value = c1.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 221);
c1 = ColorExtras.getOffset(c1, {h: TRIAD_OFFSET}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 223);
c2 = Y.merge(c1);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 224);
c2.value = c2.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 225);
c2 = ColorExtras.getOffset(c2, {h: TRIAD_OFFSET}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 227);
to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 229);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getTetrad", 250);
_yuitest_coverline("build/color-harmony/color-harmony.js", 251);
var c = ColorExtras._start(options),
                c1,
                c2,
                c3,
                offset = options.offset || TETRAD_OFFSET,
                to;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 258);
c1 = Y.merge(c);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 259);
c1.value = c1.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 260);
c1 = ColorExtras.getOffset(c1, {h: offset}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 262);
c2 = Y.merge(c);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 263);
c2.value = c2.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 264);
c2 = ColorExtras.getOffset(c2, {h: 180}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 266);
c3 = Y.merge(c2);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 267);
c3.value = c3.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 268);
c3 = ColorExtras.getOffset(c3, {h: offset}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 270);
to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 272);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getSquare", 294);
_yuitest_coverline("build/color-harmony/color-harmony.js", 295);
var c = ColorExtras._start(options),
                c1,
                c2,
                c3,
                to;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 301);
c1 = Y.merge(c);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 302);
c1.value = c1.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 303);
c1 = ColorExtras.getOffset(c1, {h: SQUARE_OFFSET}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 305);
c2 = Y.merge(c1);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 306);
c2.value = c2.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 307);
c2 = ColorExtras.getOffset(c2, {h: SQUARE_OFFSET}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 309);
c3 = Y.merge(c2);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 310);
c3.value = c3.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 311);
c3 = ColorExtras.getOffset(c3, {h: SQUARE_OFFSET}, true);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 313);
to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 315);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getMonochrome", 336);
_yuitest_coverline("build/color-harmony/color-harmony.js", 337);
var c = ColorExtras._start(options),
                colors = [],
                i = 0,
                l,
                to,
                count = options.count || DEF_COUNT,
                step,
                _c = Y.merge(c);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 346);
if (count < 2) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 347);
return options;
            }
            _yuitest_coverline("build/color-harmony/color-harmony.js", 349);
step = 100 / (count - 1);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 351);
for (; i <= 100; i += step) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 352);
_c.value = _c.value.concat();
                _yuitest_coverline("build/color-harmony/color-harmony.js", 353);
_c.value[2] = Math.max(Math.min(i, 100), 0);
                _yuitest_coverline("build/color-harmony/color-harmony.js", 354);
colors.push(_c);
                _yuitest_coverline("build/color-harmony/color-harmony.js", 355);
_c = Y.merge(_c);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 358);
to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 360);
l = colors.length;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 362);
for (i=0; i<l; i++) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 363);
colors[i] = ColorExtras._finish(colors[i], to);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 366);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getSimilar", 385);
_yuitest_coverline("build/color-harmony/color-harmony.js", 386);
var c = ColorExtras._start(options),
                colors = [c],
                i = 0,
                l,
                to,
                count = options.count || DEF_COUNT,
                offset = options.offset || DEF_OFFSET,
                _c;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 395);
for (; i < count; i++) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 396);
_c = Y.merge(c);
                _yuitest_coverline("build/color-harmony/color-harmony.js", 397);
_c.value = _c.value.concat();
                _yuitest_coverline("build/color-harmony/color-harmony.js", 398);
_c = ColorExtras.getOffset(_c, {
                    h: ( Math.random() * (offset * 2)) - offset,
                    s: ( Math.random() * (offset * 2)) - offset,
                    l: ( Math.random() * (offset * 2)) - offset
                }, true);
                _yuitest_coverline("build/color-harmony/color-harmony.js", 403);
colors.push(_c);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 406);
to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 408);
l = colors.length;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 410);
for (i=0; i<l; i++) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 411);
colors[i] = ColorExtras._finish(colors[i], to);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 414);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getOffset", 434);
_yuitest_coverline("build/color-harmony/color-harmony.js", 435);
var c = options;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 437);
if (!started) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 438);
c = ColorExtras._start(options);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 441);
if (adjust.h) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 442);
c.value[0] = (c.value[0] + adjust.h) % 360;
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 445);
if (adjust.s) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 446);
c.value[1] = Math.max(Math.min(c.value[1] + adjust.s, 100), 0);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 449);
if (adjust.l) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 450);
c.value[2] = Math.max(Math.min(c.value[2] + adjust.l, 100), 0);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 453);
if (!started) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 454);
return ColorExtras._finish(c, options.to || c.type);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 457);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getBrightness", 471);
_yuitest_coverline("build/color-harmony/color-harmony.js", 472);
var c = Color._convertTo(options, RGB),
                r = c.value[0],
                g = c.value[1],
                b = c.value[2],
                weights = ColorExtras._brightnessWeights;


            _yuitest_coverline("build/color-harmony/color-harmony.js", 479);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getSimilarBrightness", 501);
_yuitest_coverline("build/color-harmony/color-harmony.js", 502);
var c = Color._convertTo(options, HSL),
                b = ColorExtras.getBrightness(match);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 505);
c.value = c.value.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 506);
c.value[2] = ColorExtras._searchLuminanceForBrightness(c, b, 0, 100);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 508);
c.to = options.to || c.type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 510);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_start", 527);
_yuitest_coverline("build/color-harmony/color-harmony.js", 528);
var c = Color._convertTo(options, HSL);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 529);
c.value = ColorExtras._toSubtractive(c.value);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 531);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_finish", 545);
_yuitest_coverline("build/color-harmony/color-harmony.js", 546);
options.value = ColorExtras._toAdditive(options.value);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 547);
options.type = HSL;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 548);
options.to = to;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 550);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_toAdditive", 560);
_yuitest_coverline("build/color-harmony/color-harmony.js", 561);
var hue = hsl[0];

            _yuitest_coverline("build/color-harmony/color-harmony.js", 563);
if (hue <= 180) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 564);
hue /= 1.5;
            } else {_yuitest_coverline("build/color-harmony/color-harmony.js", 565);
if (hue < 240) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 566);
hue = 120 + (hue - 180) * 2;
            }}

            _yuitest_coverline("build/color-harmony/color-harmony.js", 569);
if (hue < 0) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 570);
hue += 360;
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 573);
hsl[0] = Math.round((hue % 360) * 10)/10;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 574);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_toSubtractive", 584);
_yuitest_coverline("build/color-harmony/color-harmony.js", 585);
var hue = hsl[0];

            _yuitest_coverline("build/color-harmony/color-harmony.js", 587);
if (hue <= 120) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 588);
hue *= 1.5;
            } else {_yuitest_coverline("build/color-harmony/color-harmony.js", 589);
if (hue < 240) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 590);
hue = 180 + (hue - 120) / 2;
            }}

            _yuitest_coverline("build/color-harmony/color-harmony.js", 593);
if (hue < 0) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 594);
hue += 360;
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 597);
hsl[0] = Math.round((hue % 360) * 10)/10;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 598);
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
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_searchLuminanceForBrightness", 627);
_yuitest_coverline("build/color-harmony/color-harmony.js", 628);
var luminance = (max + min) / 2,
                b;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 631);
color.value[2] = luminance;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 632);
b = ColorExtras.getBrightness(color);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 634);
if (b + 0.01 > brightness && b - 0.01 < brightness) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 635);
return luminance;
            } else {_yuitest_coverline("build/color-harmony/color-harmony.js", 636);
if (b > brightness) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 637);
return ColorExtras._searchLuminanceForBrightness(color, brightness, min, luminance);
            } else {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 639);
return ColorExtras._searchLuminanceForBrightness(color, brightness, luminance, max);
            }}
        }
    };

_yuitest_coverline("build/color-harmony/color-harmony.js", 644);
Y.Color = Y.mix(Y.Color, ColorExtras);


}, '@VERSION@', {"requires": ["color"]});

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
_yuitest_coverage["build/color-harmony/color-harmony.js"].code=["YUI.add('color-harmony', function (Y, NAME) {","","/**","Color Harmony provides methods useful for color combination discovery.","","@module color","@submodule color-harmony","@class Harmony","@namespace Color","@since 3.8.0","*/","var HSL = 'hsl',","    RGB = 'rgb',","","    SPLIT_OFFSET = 30,","    ANALOGOUS_OFFSET = 10,","    TRIAD_OFFSET = 360/3,","    TETRAD_OFFSET = 360/6,","    SQUARE_OFFSET = 360/4 ,","","    DEF_COUNT = 5,","    DEF_OFFSET = 10,","","    Color = Y.Color,","","    Harmony = {","","        // Color Groups","        /**","        Returns an Array of two colors. The first color in the Array","          will be the color passed in. The second will be the","          complementary color of the color provided","        @public","        @method getComplementary","        @param {String} str","        @param {String} [to]","        @return {Array}","        @since 3.8.0","        **/","        getComplementary: function(str, to) {","            var c = Harmony._start(str),","                c1 = c.concat();","","            to = to || Color.findType(str);","","            c1 = Harmony.getOffset(c1, {h: 180});","","            return [","                    Harmony._finish(c, to),","                    Harmony._finish(c1, to)","                ];","        },","","        /**","        Returns an Array of three colors. The first color in the Array","          will be the color passed in. The second two will be split","          complementary colors.","        @public","        @method getSplit","        @param {String} str","        @param {Number} [offset]","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getSplit: function(str, offset, to) {","            var c = Harmony._start(str),","                c1,","                c2;","","            offset = offset || SPLIT_OFFSET;","","            to = to || Color.findType(str);","","            c = Harmony.getOffset(c, {h: 180});","","            c1 = c.concat();","            c1 = Harmony.getOffset(c1, {h: offset});","","            c2 = c.concat();","            c2 = Harmony.getOffset(c2, {h: -offset});","","            // set base color back to original value","            c = Harmony.getOffset(c, {h: 180});","","            return [","                Harmony._finish(c, to),","                Harmony._finish(c1, to),","                Harmony._finish(c2, to)","            ];","        },","","        /**","        Returns an Array of five colors. The first color in the Array","          will be the color passed in. The remaining four will be","          analogous colors two in either direction from the initially","          provided color.","        @public","        @method getAnalogous","        @param {String} str","        @param {Number} [offset]","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getAnalogous: function(str, offset, to) {","            var c = Harmony._start(str),","                c1,","                c2,","                c3,","                c4;","","            offset = offset || ANALOGOUS_OFFSET;","            to = to || Color.findType(str);","","            c1 = c.concat();","            c1 = Harmony.getOffset(c1, {h: offset});","","            c2 = c1.concat();","            c2 = Harmony.getOffset(c2, {h: offset});","","            c3 = c.concat();","            c3 = Harmony.getOffset(c3, {h: -offset});","","            c4 = c3.concat();","            c4 = Harmony.getOffset(c4, {h: -offset});","","            return [","                Harmony._finish(c, to),","                Harmony._finish(c1, to),","                Harmony._finish(c2, to),","                Harmony._finish(c3, to),","                Harmony._finish(c4, to)","            ];","        },","","        /**","        Returns an Array of three colors. The first color in the Array","          will be the color passed in. The second two will be equidistant","          from the start color and each other.","        @public","        @method getTriad","        @param {String} str","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getTriad: function(str, to) {","            var c = Harmony._start(str),","                c1,","                c2;","","            to = to || Color.findType(str);","","            c1 = c.concat();","            c1 = Harmony.getOffset(c1, {h: TRIAD_OFFSET});","","            c2 = c1.concat();","            c2 = Harmony.getOffset(c2, {h: TRIAD_OFFSET});","","            return [","                Harmony._finish(c, to),","                Harmony._finish(c1, to),","                Harmony._finish(c2, to)","            ];","        },","","        /**","        Returns an Array of four colors. The first color in the Array","          will be the color passed in. The remaining three colors are","          equidistant offsets from the starting color and each other.","        @public","        @method getTetrad","        @param {String} str","        @param {Number} [offset]","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getTetrad: function(str, offset, to) {","            var c = Harmony._start(str),","                c1,","                c2,","                c3;","","            offset = offset || TETRAD_OFFSET;","            to = to || Color.findType(str);","","            c1 = c.concat();","            c1 = Harmony.getOffset(c1, {h: offset});","","            c2 = c.concat();","            c2 = Harmony.getOffset(c2, {h: 180});","","            c3 = c2.concat();","            c3 = Harmony.getOffset(c3, {h: offset});","","            return [","                Harmony._finish(c, to),","                Harmony._finish(c1, to),","                Harmony._finish(c2, to),","                Harmony._finish(c3, to)","            ];","        },","","        /**","        Returns an Array of four colors. The first color in the Array","          will be the color passed in. The remaining three colors are","          equidistant offsets from the starting color and each other.","        @public","        @method getSquare","        @param {String} str","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getSquare: function(str, to) {","            var c = Harmony._start(str),","                c1,","                c2,","                c3;","","            to = to || Color.findType(str);","","            c1 = c.concat();","            c1 = Harmony.getOffset(c1, {h: SQUARE_OFFSET});","","            c2 = c1.concat();","            c2 = Harmony.getOffset(c2, {h: SQUARE_OFFSET});","","            c3 = c2.concat();","            c3 = Harmony.getOffset(c3, {h: SQUARE_OFFSET});","","            return [","                Harmony._finish(c, to),","                Harmony._finish(c1, to),","                Harmony._finish(c2, to),","                Harmony._finish(c3, to)","            ];","        },","","        /**","        Calculates lightness offsets resulting in a monochromatic Array","          of values.","        @public","        @method getMonochrome","        @param {String} str","        @param {Number} [count]","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getMonochrome: function(str, count, to) {","            var c = Harmony._start(str),","                colors = [],","                i = 0,","                l,","                step,","                _c = c.concat();","","            count = count || DEF_COUNT;","            to = to || Color.findType(str);","","","            if (count < 2) {","                return str;","            }","","            step = 100 / (count - 1);","","            for (; i <= 100; i += step) {","                _c[2] = Math.max(Math.min(i, 100), 0);","                colors.push(_c.concat());","            }","","            l = colors.length;","","            for (i=0; i<l; i++) {","                colors[i] = Harmony._finish(colors[i], to);","            }","","            return colors;","        },","","        /**","        Creates an Array of similar colors. Returned Array is prepended","           with the color provided followed a number of colors decided","           by count","        @public","        @method getSimilar","        @param {String} str","        @param {Number} [offset]","        @param {Number} [count]","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getSimilar: function(str, offset, count, to) {","            var c = Harmony._start(str),","                colors = [c],","                slOffset,","                i = 0,","                l,","                o,","                _c = c.concat();","","            to = to || Color.findType(str);","            count = count || DEF_COUNT;","            offset = offset || DEF_OFFSET;","            slOffset = (offset > 100) ? 100 : offset;","","            for (; i < count; i++) {","                o = {","                    h: ( Math.random() * (offset * 2)) - offset,","                    s: ( Math.random() * (slOffset * 2)),","                    l: ( Math.random() * (slOffset * 2))","                };","                _c = Harmony.getOffset(_c, o);","                colors.push(_c.concat());","            }","","            l = colors.length;","","            for (i=0; i<l; i++) {","                colors[i] = Harmony._finish(colors[i], to);","            }","","            return colors;","        },","","        /**","        Adjusts the provided color by the offset(s) given. You may","          adjust hue, saturation, and/or luminance in one step.","        @public","        @method getOffset","        @param {String} str","        @param {Object} adjust","          @param {Number} [adjust.h]","          @param {Number} [adjust.s]","          @param {Number} [adjust.l]","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getOffset: function(str, adjust, to) {","            var started = Y.Lang.isArray(str),","                hsla,","                type;","","            if (!started) {","                hsla = Harmony._start(str);","                type = Color.findType(str);","            } else {","                hsla = str;","                type = 'hsl';","            }","","            to = to || type;","","            if (adjust.h) {","                hsla[0] = ((+hsla[0]) + adjust.h) % 360;","            }","","            if (adjust.s) {","                hsla[1] = Math.max(Math.min((+hsla[1]) + adjust.s, 100), 0);","            }","","            if (adjust.l) {","                hsla[2] = Math.max(Math.min((+hsla[2]) + adjust.l, 100), 0);","            }","","            if (!started) {","                return Harmony._finish(hsla, to);","            }","","            return hsla;","        },","","        /**","        Returns 0 - 1 percentage of brightness from `0` (black) being the","          darkest to `1` (white) being the brightest.","        @public","        @method getBrightness","        @param {String} str","        @return {Number}","        @since 3.8.0","        **/","        getBrightness: function(str) {","            var c = Color.toArray(Color._convertTo(str, RGB)),","                r = c[0],","                g = c[1],","                b = c[2],","                weights = Y.Color._brightnessWeights;","","","            return (Math.sqrt(","                (r * r * weights.r) +","                (g * g * weights.g) +","                (b * b * weights.b)","            ) / 255);","        },","","        /**","        Returns a new color value with adjusted luminance so that the","          brightness of the return color matches the perceived brightness","          of the `match` color provided.","        @public","        @method getSimilarBrightness","        @param {String} str","        @param {String} match","        @param {String} [to]","        @return {String}","        @since 3.8.0","        **/","        getSimilarBrightness: function(str, match, to){","            var c = Color.toArray(Color._convertTo(str, HSL)),","                b = Harmony.getBrightness(match);","","            to = to || Color.findType(str);","","            if (to === 'keyword') {","                to = 'hex';","            }","","            c[2] = Harmony._searchLuminanceForBrightness(c, b, 0, 100);","","            str = Color.fromArray(c, Y.Color.TYPES.HSLA);","","            return Color._convertTo(str, to);","        },","","        //--------------------","        // PRIVATE","        //--------------------","        /**","        Converts the provided color from additive to subtractive returning","          an Array of HSLA values","        @private","        @method _start","        @param {String} str","        @return {Array}","        @since 3.8.0","        */","        _start: function(str) {","            var hsla = Color.toArray(Color._convertTo(str, HSL));","            hsla[0] = Harmony._toSubtractive(hsla[0]);","","            return hsla;","        },","","        /**","        Converts the provided HSLA values from subtractive to additive","          returning a converted color string","        @private","        @method _finish","        @param {Array} hsla","        @param {String} [to]","        @return {String}","        @since 3.8.0","        */","        _finish: function(hsla, to) {","            hsla[0] = Harmony._toAdditive(hsla[0]);","            hsla = 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';","","            if (to === 'keyword') {","                to = 'hex';","            }","","            return Color._convertTo(hsla, to);","        },","","        /**","        Adjusts the hue degree from subtractive to additive","        @private","        @method _toAdditive","        @param {Number} hue","        @return {Number} Converted additive hue","        @since 3.8.0","        */","        _toAdditive: function(hue) {","            hue = Y.Color._constrainHue(hue);","","            if (hue <= 180) {","                hue /= 1.5;","            } else if (hue < 240) {","                hue = 120 + (hue - 180) * 2;","            }","","            return Y.Color._constrainHue(hue, 10);","        },","","        /**","        Adjusts the hue degree from additive to subtractive","        @private","        @method _toSubtractive","        @param {Number} hue","        @return {Number} Converted subtractive hue","        @since 3.8.0","        */","        _toSubtractive: function(hue) {","            hue = Y.Color._constrainHue(hue);","","            if (hue <= 120) {","                hue *= 1.5;","            } else if (hue < 240) {","                hue = 180 + (hue - 120) / 2;","            }","","            return Y.Color._constrainHue(hue, 10);","        },","","        /**","        Contrain the hue to a value between 0 and 360 for calculations","            and real color wheel value space. Provide a precision value","            to round return value to a decimal place","        @private","        @method _constrainHue","        @param {Number} hue","        @param {Number} [precision]","        @return {Number} Constrained hue value","        @since 3.8.0","        **/","        _constrainHue: function(hue, precision) {","            while (hue < 0) {","                hue += 360;","            }","            hue %= 360;","","            if (precision) {","                hue = Math.round(hue * precision) / precision;","            }","","            return hue;","        },","","        /**","        Brightness weight factors for perceived brightness calculations","","        \"standard\" values are listed as R: 0.241, G: 0.691, B: 0.068","        These values were changed based on grey scale comparison of hsl","          to new hsl where brightness is said to be within plus or minus 0.01.","        @private","        @property _brightnessWeights","        @since 3.8.0","        */","        _brightnessWeights: {","            r: 0.221,","            g: 0.711,","            b: 0.068","        },","","        /**","        Calculates the luminance as a mid range between the min and max","          to match the brightness level provided","        @private","        @method _searchLuminanceForBrightness","        @param {Array} color HSLA values","        @param {Number} brightness Brightness to be matched","        @param {Number} min Minimum range for luminance","        @param {Number} max Maximum range for luminance","        @return {Number} Found luminance to achieve requested brightness","        @since 3.8.0","        **/","        _searchLuminanceForBrightness: function(color, brightness, min, max) {","            var luminance = (max + min) / 2,","                b;","","            color[2] = luminance;","            b = Harmony.getBrightness(Color.fromArray(color, Y.Color.TYPES.HSL));","","            if (b + 0.01 > brightness && b - 0.01 < brightness) {","                return luminance;","            } else if (b > brightness) {","                return Harmony._searchLuminanceForBrightness(color, brightness, min, luminance);","            } else {","                return Harmony._searchLuminanceForBrightness(color, brightness, luminance, max);","            }","        }","","    };","","Y.Color = Y.mix(Y.Color, Harmony);","","","}, '@VERSION@', {\"requires\": [\"color-hsl\"]});"];
_yuitest_coverage["build/color-harmony/color-harmony.js"].lines = {"1":0,"12":0,"41":0,"44":0,"46":0,"48":0,"67":0,"71":0,"73":0,"75":0,"77":0,"78":0,"80":0,"81":0,"84":0,"86":0,"107":0,"113":0,"114":0,"116":0,"117":0,"119":0,"120":0,"122":0,"123":0,"125":0,"126":0,"128":0,"149":0,"153":0,"155":0,"156":0,"158":0,"159":0,"161":0,"181":0,"186":0,"187":0,"189":0,"190":0,"192":0,"193":0,"195":0,"196":0,"198":0,"218":0,"223":0,"225":0,"226":0,"228":0,"229":0,"231":0,"232":0,"234":0,"254":0,"261":0,"262":0,"265":0,"266":0,"269":0,"271":0,"272":0,"273":0,"276":0,"278":0,"279":0,"282":0,"299":0,"307":0,"308":0,"309":0,"310":0,"312":0,"313":0,"318":0,"319":0,"322":0,"324":0,"325":0,"328":0,"346":0,"350":0,"351":0,"352":0,"354":0,"355":0,"358":0,"360":0,"361":0,"364":0,"365":0,"368":0,"369":0,"372":0,"373":0,"376":0,"389":0,"396":0,"416":0,"419":0,"421":0,"422":0,"425":0,"427":0,"429":0,"445":0,"446":0,"448":0,"462":0,"463":0,"465":0,"466":0,"469":0,"481":0,"483":0,"484":0,"485":0,"486":0,"489":0,"501":0,"503":0,"504":0,"505":0,"506":0,"509":0,"524":0,"525":0,"527":0,"529":0,"530":0,"533":0,"565":0,"568":0,"569":0,"571":0,"572":0,"573":0,"574":0,"576":0,"582":0};
_yuitest_coverage["build/color-harmony/color-harmony.js"].functions = {"getComplementary:40":0,"getSplit:66":0,"getAnalogous:106":0,"getTriad:148":0,"getTetrad:180":0,"getSquare:217":0,"getMonochrome:253":0,"getSimilar:298":0,"getOffset:345":0,"getBrightness:388":0,"getSimilarBrightness:415":0,"_start:444":0,"_finish:461":0,"_toAdditive:480":0,"_toSubtractive:500":0,"_constrainHue:523":0,"_searchLuminanceForBrightness:564":0,"(anonymous 1):1":0};
_yuitest_coverage["build/color-harmony/color-harmony.js"].coveredLines = 140;
_yuitest_coverage["build/color-harmony/color-harmony.js"].coveredFunctions = 18;
_yuitest_coverline("build/color-harmony/color-harmony.js", 1);
YUI.add('color-harmony', function (Y, NAME) {

/**
Color Harmony provides methods useful for color combination discovery.

@module color
@submodule color-harmony
@class Harmony
@namespace Color
@since 3.8.0
*/
_yuitest_coverfunc("build/color-harmony/color-harmony.js", "(anonymous 1)", 1);
_yuitest_coverline("build/color-harmony/color-harmony.js", 12);
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

    Harmony = {

        // Color Groups
        /**
        Returns an Array of two colors. The first color in the Array
          will be the color passed in. The second will be the
          complementary color of the color provided
        @public
        @method getComplementary
        @param {String} str
        @param {String} [to]
        @return {Array}
        @since 3.8.0
        **/
        getComplementary: function(str, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getComplementary", 40);
_yuitest_coverline("build/color-harmony/color-harmony.js", 41);
var c = Harmony._start(str),
                c1 = c.concat();

            _yuitest_coverline("build/color-harmony/color-harmony.js", 44);
to = to || Color.findType(str);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 46);
c1 = Harmony.getOffset(c1, {h: 180});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 48);
return [
                    Harmony._finish(c, to),
                    Harmony._finish(c1, to)
                ];
        },

        /**
        Returns an Array of three colors. The first color in the Array
          will be the color passed in. The second two will be split
          complementary colors.
        @public
        @method getSplit
        @param {String} str
        @param {Number} [offset]
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getSplit: function(str, offset, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getSplit", 66);
_yuitest_coverline("build/color-harmony/color-harmony.js", 67);
var c = Harmony._start(str),
                c1,
                c2;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 71);
offset = offset || SPLIT_OFFSET;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 73);
to = to || Color.findType(str);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 75);
c = Harmony.getOffset(c, {h: 180});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 77);
c1 = c.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 78);
c1 = Harmony.getOffset(c1, {h: offset});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 80);
c2 = c.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 81);
c2 = Harmony.getOffset(c2, {h: -offset});

            // set base color back to original value
            _yuitest_coverline("build/color-harmony/color-harmony.js", 84);
c = Harmony.getOffset(c, {h: 180});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 86);
return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to)
            ];
        },

        /**
        Returns an Array of five colors. The first color in the Array
          will be the color passed in. The remaining four will be
          analogous colors two in either direction from the initially
          provided color.
        @public
        @method getAnalogous
        @param {String} str
        @param {Number} [offset]
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getAnalogous: function(str, offset, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getAnalogous", 106);
_yuitest_coverline("build/color-harmony/color-harmony.js", 107);
var c = Harmony._start(str),
                c1,
                c2,
                c3,
                c4;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 113);
offset = offset || ANALOGOUS_OFFSET;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 114);
to = to || Color.findType(str);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 116);
c1 = c.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 117);
c1 = Harmony.getOffset(c1, {h: offset});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 119);
c2 = c1.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 120);
c2 = Harmony.getOffset(c2, {h: offset});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 122);
c3 = c.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 123);
c3 = Harmony.getOffset(c3, {h: -offset});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 125);
c4 = c3.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 126);
c4 = Harmony.getOffset(c4, {h: -offset});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 128);
return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to),
                Harmony._finish(c3, to),
                Harmony._finish(c4, to)
            ];
        },

        /**
        Returns an Array of three colors. The first color in the Array
          will be the color passed in. The second two will be equidistant
          from the start color and each other.
        @public
        @method getTriad
        @param {String} str
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getTriad: function(str, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getTriad", 148);
_yuitest_coverline("build/color-harmony/color-harmony.js", 149);
var c = Harmony._start(str),
                c1,
                c2;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 153);
to = to || Color.findType(str);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 155);
c1 = c.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 156);
c1 = Harmony.getOffset(c1, {h: TRIAD_OFFSET});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 158);
c2 = c1.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 159);
c2 = Harmony.getOffset(c2, {h: TRIAD_OFFSET});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 161);
return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to)
            ];
        },

        /**
        Returns an Array of four colors. The first color in the Array
          will be the color passed in. The remaining three colors are
          equidistant offsets from the starting color and each other.
        @public
        @method getTetrad
        @param {String} str
        @param {Number} [offset]
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getTetrad: function(str, offset, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getTetrad", 180);
_yuitest_coverline("build/color-harmony/color-harmony.js", 181);
var c = Harmony._start(str),
                c1,
                c2,
                c3;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 186);
offset = offset || TETRAD_OFFSET;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 187);
to = to || Color.findType(str);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 189);
c1 = c.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 190);
c1 = Harmony.getOffset(c1, {h: offset});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 192);
c2 = c.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 193);
c2 = Harmony.getOffset(c2, {h: 180});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 195);
c3 = c2.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 196);
c3 = Harmony.getOffset(c3, {h: offset});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 198);
return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to),
                Harmony._finish(c3, to)
            ];
        },

        /**
        Returns an Array of four colors. The first color in the Array
          will be the color passed in. The remaining three colors are
          equidistant offsets from the starting color and each other.
        @public
        @method getSquare
        @param {String} str
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getSquare: function(str, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getSquare", 217);
_yuitest_coverline("build/color-harmony/color-harmony.js", 218);
var c = Harmony._start(str),
                c1,
                c2,
                c3;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 223);
to = to || Color.findType(str);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 225);
c1 = c.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 226);
c1 = Harmony.getOffset(c1, {h: SQUARE_OFFSET});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 228);
c2 = c1.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 229);
c2 = Harmony.getOffset(c2, {h: SQUARE_OFFSET});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 231);
c3 = c2.concat();
            _yuitest_coverline("build/color-harmony/color-harmony.js", 232);
c3 = Harmony.getOffset(c3, {h: SQUARE_OFFSET});

            _yuitest_coverline("build/color-harmony/color-harmony.js", 234);
return [
                Harmony._finish(c, to),
                Harmony._finish(c1, to),
                Harmony._finish(c2, to),
                Harmony._finish(c3, to)
            ];
        },

        /**
        Calculates lightness offsets resulting in a monochromatic Array
          of values.
        @public
        @method getMonochrome
        @param {String} str
        @param {Number} [count]
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getMonochrome: function(str, count, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getMonochrome", 253);
_yuitest_coverline("build/color-harmony/color-harmony.js", 254);
var c = Harmony._start(str),
                colors = [],
                i = 0,
                l,
                step,
                _c = c.concat();

            _yuitest_coverline("build/color-harmony/color-harmony.js", 261);
count = count || DEF_COUNT;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 262);
to = to || Color.findType(str);


            _yuitest_coverline("build/color-harmony/color-harmony.js", 265);
if (count < 2) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 266);
return str;
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 269);
step = 100 / (count - 1);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 271);
for (; i <= 100; i += step) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 272);
_c[2] = Math.max(Math.min(i, 100), 0);
                _yuitest_coverline("build/color-harmony/color-harmony.js", 273);
colors.push(_c.concat());
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 276);
l = colors.length;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 278);
for (i=0; i<l; i++) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 279);
colors[i] = Harmony._finish(colors[i], to);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 282);
return colors;
        },

        /**
        Creates an Array of similar colors. Returned Array is prepended
           with the color provided followed a number of colors decided
           by count
        @public
        @method getSimilar
        @param {String} str
        @param {Number} [offset]
        @param {Number} [count]
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getSimilar: function(str, offset, count, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getSimilar", 298);
_yuitest_coverline("build/color-harmony/color-harmony.js", 299);
var c = Harmony._start(str),
                colors = [c],
                slOffset,
                i = 0,
                l,
                o,
                _c = c.concat();

            _yuitest_coverline("build/color-harmony/color-harmony.js", 307);
to = to || Color.findType(str);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 308);
count = count || DEF_COUNT;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 309);
offset = offset || DEF_OFFSET;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 310);
slOffset = (offset > 100) ? 100 : offset;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 312);
for (; i < count; i++) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 313);
o = {
                    h: ( Math.random() * (offset * 2)) - offset,
                    s: ( Math.random() * (slOffset * 2)),
                    l: ( Math.random() * (slOffset * 2))
                };
                _yuitest_coverline("build/color-harmony/color-harmony.js", 318);
_c = Harmony.getOffset(_c, o);
                _yuitest_coverline("build/color-harmony/color-harmony.js", 319);
colors.push(_c.concat());
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 322);
l = colors.length;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 324);
for (i=0; i<l; i++) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 325);
colors[i] = Harmony._finish(colors[i], to);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 328);
return colors;
        },

        /**
        Adjusts the provided color by the offset(s) given. You may
          adjust hue, saturation, and/or luminance in one step.
        @public
        @method getOffset
        @param {String} str
        @param {Object} adjust
          @param {Number} [adjust.h]
          @param {Number} [adjust.s]
          @param {Number} [adjust.l]
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getOffset: function(str, adjust, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getOffset", 345);
_yuitest_coverline("build/color-harmony/color-harmony.js", 346);
var started = Y.Lang.isArray(str),
                hsla,
                type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 350);
if (!started) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 351);
hsla = Harmony._start(str);
                _yuitest_coverline("build/color-harmony/color-harmony.js", 352);
type = Color.findType(str);
            } else {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 354);
hsla = str;
                _yuitest_coverline("build/color-harmony/color-harmony.js", 355);
type = 'hsl';
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 358);
to = to || type;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 360);
if (adjust.h) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 361);
hsla[0] = ((+hsla[0]) + adjust.h) % 360;
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 364);
if (adjust.s) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 365);
hsla[1] = Math.max(Math.min((+hsla[1]) + adjust.s, 100), 0);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 368);
if (adjust.l) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 369);
hsla[2] = Math.max(Math.min((+hsla[2]) + adjust.l, 100), 0);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 372);
if (!started) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 373);
return Harmony._finish(hsla, to);
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 376);
return hsla;
        },

        /**
        Returns 0 - 1 percentage of brightness from `0` (black) being the
          darkest to `1` (white) being the brightest.
        @public
        @method getBrightness
        @param {String} str
        @return {Number}
        @since 3.8.0
        **/
        getBrightness: function(str) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getBrightness", 388);
_yuitest_coverline("build/color-harmony/color-harmony.js", 389);
var c = Color.toArray(Color._convertTo(str, RGB)),
                r = c[0],
                g = c[1],
                b = c[2],
                weights = Y.Color._brightnessWeights;


            _yuitest_coverline("build/color-harmony/color-harmony.js", 396);
return (Math.sqrt(
                (r * r * weights.r) +
                (g * g * weights.g) +
                (b * b * weights.b)
            ) / 255);
        },

        /**
        Returns a new color value with adjusted luminance so that the
          brightness of the return color matches the perceived brightness
          of the `match` color provided.
        @public
        @method getSimilarBrightness
        @param {String} str
        @param {String} match
        @param {String} [to]
        @return {String}
        @since 3.8.0
        **/
        getSimilarBrightness: function(str, match, to){
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "getSimilarBrightness", 415);
_yuitest_coverline("build/color-harmony/color-harmony.js", 416);
var c = Color.toArray(Color._convertTo(str, HSL)),
                b = Harmony.getBrightness(match);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 419);
to = to || Color.findType(str);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 421);
if (to === 'keyword') {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 422);
to = 'hex';
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 425);
c[2] = Harmony._searchLuminanceForBrightness(c, b, 0, 100);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 427);
str = Color.fromArray(c, Y.Color.TYPES.HSLA);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 429);
return Color._convertTo(str, to);
        },

        //--------------------
        // PRIVATE
        //--------------------
        /**
        Converts the provided color from additive to subtractive returning
          an Array of HSLA values
        @private
        @method _start
        @param {String} str
        @return {Array}
        @since 3.8.0
        */
        _start: function(str) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_start", 444);
_yuitest_coverline("build/color-harmony/color-harmony.js", 445);
var hsla = Color.toArray(Color._convertTo(str, HSL));
            _yuitest_coverline("build/color-harmony/color-harmony.js", 446);
hsla[0] = Harmony._toSubtractive(hsla[0]);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 448);
return hsla;
        },

        /**
        Converts the provided HSLA values from subtractive to additive
          returning a converted color string
        @private
        @method _finish
        @param {Array} hsla
        @param {String} [to]
        @return {String}
        @since 3.8.0
        */
        _finish: function(hsla, to) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_finish", 461);
_yuitest_coverline("build/color-harmony/color-harmony.js", 462);
hsla[0] = Harmony._toAdditive(hsla[0]);
            _yuitest_coverline("build/color-harmony/color-harmony.js", 463);
hsla = 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';

            _yuitest_coverline("build/color-harmony/color-harmony.js", 465);
if (to === 'keyword') {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 466);
to = 'hex';
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 469);
return Color._convertTo(hsla, to);
        },

        /**
        Adjusts the hue degree from subtractive to additive
        @private
        @method _toAdditive
        @param {Number} hue
        @return {Number} Converted additive hue
        @since 3.8.0
        */
        _toAdditive: function(hue) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_toAdditive", 480);
_yuitest_coverline("build/color-harmony/color-harmony.js", 481);
hue = Y.Color._constrainHue(hue);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 483);
if (hue <= 180) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 484);
hue /= 1.5;
            } else {_yuitest_coverline("build/color-harmony/color-harmony.js", 485);
if (hue < 240) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 486);
hue = 120 + (hue - 180) * 2;
            }}

            _yuitest_coverline("build/color-harmony/color-harmony.js", 489);
return Y.Color._constrainHue(hue, 10);
        },

        /**
        Adjusts the hue degree from additive to subtractive
        @private
        @method _toSubtractive
        @param {Number} hue
        @return {Number} Converted subtractive hue
        @since 3.8.0
        */
        _toSubtractive: function(hue) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_toSubtractive", 500);
_yuitest_coverline("build/color-harmony/color-harmony.js", 501);
hue = Y.Color._constrainHue(hue);

            _yuitest_coverline("build/color-harmony/color-harmony.js", 503);
if (hue <= 120) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 504);
hue *= 1.5;
            } else {_yuitest_coverline("build/color-harmony/color-harmony.js", 505);
if (hue < 240) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 506);
hue = 180 + (hue - 120) / 2;
            }}

            _yuitest_coverline("build/color-harmony/color-harmony.js", 509);
return Y.Color._constrainHue(hue, 10);
        },

        /**
        Contrain the hue to a value between 0 and 360 for calculations
            and real color wheel value space. Provide a precision value
            to round return value to a decimal place
        @private
        @method _constrainHue
        @param {Number} hue
        @param {Number} [precision]
        @return {Number} Constrained hue value
        @since 3.8.0
        **/
        _constrainHue: function(hue, precision) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_constrainHue", 523);
_yuitest_coverline("build/color-harmony/color-harmony.js", 524);
while (hue < 0) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 525);
hue += 360;
            }
            _yuitest_coverline("build/color-harmony/color-harmony.js", 527);
hue %= 360;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 529);
if (precision) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 530);
hue = Math.round(hue * precision) / precision;
            }

            _yuitest_coverline("build/color-harmony/color-harmony.js", 533);
return hue;
        },

        /**
        Brightness weight factors for perceived brightness calculations

        "standard" values are listed as R: 0.241, G: 0.691, B: 0.068
        These values were changed based on grey scale comparison of hsl
          to new hsl where brightness is said to be within plus or minus 0.01.
        @private
        @property _brightnessWeights
        @since 3.8.0
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
        @param {Array} color HSLA values
        @param {Number} brightness Brightness to be matched
        @param {Number} min Minimum range for luminance
        @param {Number} max Maximum range for luminance
        @return {Number} Found luminance to achieve requested brightness
        @since 3.8.0
        **/
        _searchLuminanceForBrightness: function(color, brightness, min, max) {
            _yuitest_coverfunc("build/color-harmony/color-harmony.js", "_searchLuminanceForBrightness", 564);
_yuitest_coverline("build/color-harmony/color-harmony.js", 565);
var luminance = (max + min) / 2,
                b;

            _yuitest_coverline("build/color-harmony/color-harmony.js", 568);
color[2] = luminance;
            _yuitest_coverline("build/color-harmony/color-harmony.js", 569);
b = Harmony.getBrightness(Color.fromArray(color, Y.Color.TYPES.HSL));

            _yuitest_coverline("build/color-harmony/color-harmony.js", 571);
if (b + 0.01 > brightness && b - 0.01 < brightness) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 572);
return luminance;
            } else {_yuitest_coverline("build/color-harmony/color-harmony.js", 573);
if (b > brightness) {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 574);
return Harmony._searchLuminanceForBrightness(color, brightness, min, luminance);
            } else {
                _yuitest_coverline("build/color-harmony/color-harmony.js", 576);
return Harmony._searchLuminanceForBrightness(color, brightness, luminance, max);
            }}
        }

    };

_yuitest_coverline("build/color-harmony/color-harmony.js", 582);
Y.Color = Y.mix(Y.Color, Harmony);


}, '@VERSION@', {"requires": ["color-hsl"]});

Color = {

    REGEX_HSL: /hsla?\(([.\d]*), ?([.\d]*)%, ?([.\d]*)%,? ?([.\d]*)?\)/,

    TEMP_HSL: 'hsl({*}, {*}%, {*}%)',

    TEMP_HSLA: 'hsla({*}, {*}%, {*}%, {*})',

    toHSL: function (str) {
        return Y.Color.toHsl(str);
    },

    toHsl: function (str) {
        var clr = Y.Color._convertTo(str, 'hsl');
        return clr.toLowerCase();
    },

    toHSLA: function (str) {
        return Y.Color.toHsla(str);
    },

    toHsla: function (str) {
        var clr = Y.Color._convertTo(str, 'hsla');
        return clr.toLowerCase();
    },

    findType: function (str) {
        if (Y.Color.KEYWORDS[str]) {
            return 'keyword';
        }

        if (str.indexOf('hsla') === 0) {
            return 'hsla';
        } else if (str.indexOf('hsl') === 0) {
            return 'hsl';
        } else if (str.indexOf('rgba') === 0) {
            return 'rgba';
        } else if (str.indexOf('rgb') === 0) {
            return 'rgb';
        } else {
            return 'hex';
        }
    }, // return 'keyword', 'hex', 'rgb', 'rgba', 'hsl', 'hsla'

    _rgbToHsl: function (str, toArray) {
        var h, s, l,
            rgb = Y.Color.REGEX_RGB.exec(str),
            r = rgb[1] / 255,
            g = rgb[2] / 255,
            b = rgb[3] / 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            isGrayScale = false,
            sub = max - min,
            sum = max + min;


        if (r === g && g === b) {
            isGrayScale = true;
        }

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

        if (isGrayScale) {
            s = 0;
        }

        // clean up hsl
        h = Math.round(h);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        if (toArray) {
            return [h, s, l];
        }

        return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    },

    _hslToRgb: function (str, toArray) {
        var rgb = [];

        // assume input is [h, s, l]
        // TODO: Find legals for use of formula
        var hsl = Y.Color.REGEX_HSL.exec(str),
            h = parseInt(hsl[1], 10) / 360,
            s = parseInt(hsl[2], 10) / 100,
            l = parseInt(hsl[3], 10) / 100,
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

        if (toArray) {
            return [r, g, b];
        }

        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
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

Y.Color = Y.mix(Color, Y.Color);
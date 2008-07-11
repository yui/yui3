var TO_STRING = 'toString',
    RE = RegExp,
    re_color = /color$/i,
    re_rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
    re_hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
    re_hex3 = /([0-9A-F])/gi;

Y.Color = {
    KEYWORDS: {
        black: '000',
        silver: 'c0c0c0',
        gray: '808080',
        white: 'fff',
        maroon: '800000',
        red: 'f00',
        purple: '800080',
        fuchsia: 'f0f',
        green: '008000',
        lime: '0f0',
        olive: '808000',
        yellow: 'ff0',
        navy: '000080',
        blue: '00f',
        teal: '008080',
        aqua: '0ff'
    },

    toRGB: function(val) {
        val = Y.Color.toHex(val);

        if(re_hex.exec(val)) {
            val = 'rgb(' + [
                parseInt(RE.$1, 16),
                parseInt(RE.$2, 16),
                parseInt(RE.$3, 16)
            ].join(', ') + ')';
        }
        return val;
    },

    toHex: function(val) {
        val = Y.Color.KEYWORDS[val] || val;
        if (re_rgb.exec(val)) {
            val = [
                Number(RE.$1)[TO_STRING](16),
                Number(RE.$2)[TO_STRING](16),
                Number(RE.$3)[TO_STRING](16)
            ].join('');
        }

        if (val[LENGTH] < 6) {
            val = val.replace(re_hex3, '$1$1');
        }

        return (val.indexOf('#') < 0 ? val = '#' + val : val).toLowerCase();
    }
};


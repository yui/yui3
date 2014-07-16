YUI.add('color-hsv-tests', function(Y) {

    var areSame = Y.Assert.areSame,
        TRANSPARENT = 'transparent',
        testBasic = new Y.Test.Case({
            name: "Color HSV Convertion Tests",

            'convert hex to hsv': function() {
                var c = Y.Color.toHSV('#ff00ff'),
                    C = Y.Color.toHSV('#ff00ff');

                areSame('hsv(300, 100%, 100%)', c);
                areSame('hsv(300, 100%, 100%)', C);
            },

            'convert hex to hsva': function() {
                var c = Y.Color.toHSVA('#ff00ff'),
                    C = Y.Color.toHSVA('#ff00ff');

                areSame('hsva(300, 100%, 100%, 1)', c);
                areSame('hsva(300, 100%, 100%, 1)', C);
            },

            'convert rgb to hsv': function() {
                var c = Y.Color.toHSV('rgb(255, 0, 255)');

                areSame('hsv(300, 100%, 100%)', c);
            },

            'convert rgb to hsva': function() {
                var c = Y.Color.toHSVA('rgb(255, 0, 255)');

                areSame('hsva(300, 100%, 100%, 1)', c);
            },

            'convert rgba to hsv': function() {
                var c = Y.Color.toHSV('rgba(255, 0, 255, 0.5)');

                areSame('hsv(300, 100%, 100%)', c);
            },

            'convert rgba to hsva': function() {
                var c = Y.Color.toHSVA('rgba(255, 0, 255, 0.5)'),
                    g = Y.Color.toHSVA('rgba(0, 255, 0, 0.5)'),
                    b = Y.Color.toHSVA('#2345ff');

                areSame('hsva(300, 100%, 100%, 0.5)', c, 'magenta is not preserved');
                areSame('hsva(120, 100%, 100%, 0.5)', g, 'lime is not preserved');
                areSame('hsva(231, 86%, 100%, 1)', b, 'royal blue is not preserved');
            },

            'convert hsv to hex': function() {
                var c = Y.Color.toHex('hsv(0, 100%, 50%)');

                areSame('#800000', c);
            },

            'convert hsva to hex': function() {
                var c = Y.Color.toHex('hsva(200, 50%, 50%, 1)');

                areSame('#406B80', c);
            },

            'convert hsv to rgb': function() {
                var c = Y.Color.toRGB('hsv(340, 100%, 50%)');

                areSame('rgb(128, 0, 43)', c);
            },

            'convert hsva to rgb': function() {
                var c = Y.Color.toRGB('hsva(70, 100%, 50%, 0.5)');

                areSame('rgb(107, 128, 0)', c);
            },

            'convert hsv to rgba': function() {
                var c = Y.Color.toRGBA('hsv(15, 100%, 50%)');

                areSame('rgba(128, 32, 0, 1)', c);
            },

            'convert hsva to rgba': function() {
                var c = Y.Color.toRGBA('hsva(240, 100%, 50%, 0.4)');

                areSame('rgba(0, 0, 128, 0.4)', c);
            },

            'test gray scale conversion': function() {
                var c = Y.Color.toHSV('#999999');

                areSame('hsv(0, 0%, 60%)', c);
            },

            'test varying saturation toHSV conversions': function() {
                var low = Y.Color.toHSV('#679883'),
                    med = Y.Color.toHSV('#3CC389'),
                    high = Y.Color.toHSV('#11EE8E');

                areSame('hsv(154, 32%, 60%)', low, 'low saturation is not preserved');
                areSame('hsv(154, 69%, 76%)', med, 'med saturation is not preserved');
                areSame('hsv(154, 93%, 93%)', high, 'high saturation is not preserved');
            },

            'test varying luminance toHSV conversions': function() {
                var no = Y.Color.toHSV('#000000'),
                    low = Y.Color.toHSV('#1B143D'),
                    med = Y.Color.toHSV('#5D4BC3'),
                    high = Y.Color.toHSV('#CBC6EC'),
                    full = Y.Color.toHSV('#ffffff');

                areSame('hsv(0, 0%, 0%)', no, 'no luminance is not preserved');
                areSame('hsv(250, 67%, 24%)', low, 'low luminance is not preserved');
                areSame('hsv(249, 62%, 76%)', med, 'med luminance is not preserved');
                areSame('hsv(248, 16%, 93%)', high, 'high luminance is not preserved');
                areSame('hsv(0, 0%, 100%)', full, 'full luminance is not preserved');
            },

            'test varying saturation toHex conversions': function() {
                var low = Y.Color.toHex('hsv(154, 32%, 60%)'),
                    med = Y.Color.toHex('hsv(154, 69%, 76%)'),
                    high = Y.Color.toHex('hsv(154, 93%, 93%)');

                areSame('#689A84', low, 'low saturation is not preserved');
                areSame('#3CC388', med, 'med saturation is not preserved');
                areSame('#11EE8E', high, 'high saturation is not preserved');
            },

            'test varying luminance toHex conversions': function() {
                var no = Y.Color.toHex('hsv(0, 0%, 0%)'),
                    low = Y.Color.toHex('hsv(250, 67%, 24%)'),
                    med = Y.Color.toHex('hsv(249, 62%, 73%)'),
                    high = Y.Color.toHex('hsv(248, 16%, 93%)'),
                    full = Y.Color.toHex('hsv(0, 0%, 100%)');

                areSame('#000000', no, 'no luminance is not preserved');
                areSame('#1B143D', low, 'low luminance is not preserved');
                areSame('#5847BB', med, 'med luminance is not preserved');
                areSame('#CDC8EE', high, 'high luminance is not preserved');
                areSame('#FFFFFF', full, 'full luminance is not preserved');
            },

            'test for trasnparent': function () {
                Y.Assert.areSame(TRANSPARENT, Y.Color.toHSV(TRANSPARENT), 'trasnparent to hsv');
                Y.Assert.areSame(TRANSPARENT, Y.Color.toHSVA(TRANSPARENT), 'trasnparent to hsva');
            }

        });

    var suite = new Y.Test.Suite("Color HSV");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

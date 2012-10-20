YUI.add('color-hsl-tests', function(Y) {

    var areSame = Y.Assert.areSame,
        testBasic = new Y.Test.Case({
            name: "Color Convertion Tests",

            'convert hex to hsl': function() {
                var c = Y.Color.toHsl('#ff00ff'),
                    C = Y.Color.toHSL('#ff00ff');

                areSame('hsl(300, 100%, 50%)', c);
                areSame('hsl(300, 100%, 50%)', C);
            },

            'convert hex to hsla': function() {
                var c = Y.Color.toHsla('#ff00ff'),
                    C = Y.Color.toHSLA('#ff00ff');

                areSame('hsla(300, 100%, 50%, 1)', c);
                areSame('hsla(300, 100%, 50%, 1)', C);
            },

            'convert rgb to hsl': function() {
                var c = Y.Color.toHsl('rgb(255, 0, 255)');

                areSame('hsl(300, 100%, 50%)', c);
            },

            'convert rgb to hsla': function() {
                var c = Y.Color.toHsla('rgb(255, 0, 255)');

                areSame('hsla(300, 100%, 50%, 1)', c);
            },

            'convert rgba to hsl': function() {
                var c = Y.Color.toHsl('rgba(255, 0, 255, 0.5)');

                areSame('hsl(300, 100%, 50%)', c);
            },

            'convert rgba to hsla': function() {
                var c = Y.Color.toHsla('rgba(255, 0, 255, 0.5)'),
                    g = Y.Color.toHsla('rgba(0, 255, 0, 0.5)'),
                    b = Y.Color.toHsla('#2345ff');

                areSame('hsla(300, 100%, 50%, 0.5)', c, 'magenta is not preserved');
                areSame('hsla(120, 100%, 50%, 0.5)', g, 'lime is not preserved');
                areSame('hsla(231, 100%, 57%, 1)', b, 'royal blue is not preserved');
            },

            'convert hsl to hex': function() {
                var c = Y.Color.toHex('hsl(0, 100%, 50%)');

                areSame('#ff0000', c);
            },

            'convert hsla to hex': function() {
                var c = Y.Color.toHex('hsla(200, 50%, 50%)');

                areSame('#4095bf', c);
            },

            'convert hsl to rgb': function() {
                var c = Y.Color.toRgb('hsl(120, 100%, 50%)');

                areSame('rgb(0, 255, 0)', c);
            },

            'convert hsla to rgb': function() {
                var c = Y.Color.toRgb('hsla(120, 100%, 50%)');

                areSame('rgb(0, 255, 0)', c);
            },

            'convert hsl to rgba': function() {
                var c = Y.Color.toRgba('hsl(15, 100%, 50%)');

                areSame('rgba(255, 64, 0, 1)', c);
            },

            'convert hsla to rgba': function() {
                var c = Y.Color.toRgba('hsla(240, 100%, 50%, 0.4)');

                areSame('rgba(0, 0, 255, 0.4)', c);
            },

            'test gray scale conversion': function() {
                var c = Y.Color.toHSL('#999999');

                areSame('hsl(0, 0%, 60%)', c);
            },

            'test varying saturation toHsl conversions': function() {
                var low = Y.Color.toHsl('#679883'),
                    med = Y.Color.toHsl('#3CC389'),
                    high = Y.Color.toHsl('#11EE8E');

                areSame('hsl(154, 19%, 50%)', low, 'low saturation is not preserved');
                areSame('hsl(154, 53%, 50%)', med, 'med saturation is not preserved');
                areSame('hsl(154, 87%, 50%)', high, 'high saturation is not preserved');
            },

            'test varying luminance toHsl conversions': function() {
                var no = Y.Color.toHsl('#000000'),
                    low = Y.Color.toHsl('#1B143D'),
                    med = Y.Color.toHsl('#5D4BC3'),
                    high = Y.Color.toHsl('#CBC6EC'),
                    full = Y.Color.toHsl('#ffffff');

                areSame('hsl(0, 0%, 0%)', no, 'no luminance is not preserved');
                areSame('hsl(250, 51%, 16%)', low, 'low luminance is not preserved');
                areSame('hsl(249, 50%, 53%)', med, 'med luminance is not preserved');
                areSame('hsl(248, 50%, 85%)', high, 'high luminance is not preserved');
                areSame('hsl(0, 0%, 100%)', full, 'full luminance is not preserved');
            },

            'test varying saturation toHex conversions': function() {
                var low = Y.Color.toHex('hsl(154, 19%, 50%)'),
                    med = Y.Color.toHex('hsl(154, 53%, 50%)'),
                    high = Y.Color.toHex('hsl(154, 87%, 50%)');

                areSame('#679883', low, 'low saturation is not preserved');
                areSame('#3cc389', med, 'med saturation is not preserved');
                areSame('#11ee8e', high, 'high saturation is not preserved');
            },

            'test varying luminance toHex conversions': function() {
                var no = Y.Color.toHex('hsl(0, 0%, 0%)'),
                    low = Y.Color.toHex('hsl(250, 51%, 16%)'),
                    med = Y.Color.toHex('hsl(249, 50%, 53%)'),
                    high = Y.Color.toHex('hsl(248, 50%, 85%)'),
                    full = Y.Color.toHex('hsl(0, 0%, 100%)');

                areSame('#000000', no, 'no luminance is not preserved');
                areSame('#1b143e', low, 'low luminance is not preserved');
                areSame('#5d4bc3', med, 'med luminance is not preserved');
                areSame('#cbc6ec', high, 'high luminance is not preserved');
                areSame('#ffffff', full, 'full luminance is not preserved');
            }

        });

    var suite = new Y.Test.Suite("Color");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

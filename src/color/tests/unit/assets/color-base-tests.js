YUI.add('color-tests', function(Y) {

    var Assert = Y.Assert,
        Types = Y.Color.TYPES,
        TRANSPARENT = 'transparent',
        testBasic = new Y.Test.Case({
            name: "Color Base Convertion Tests",

            'test conversion': function() {
                Assert.areEqual('#FFFFFF', Y.Color.convert('fff', Types.HEX), 'Hex to Hex');

                Assert.areEqual('rgb(255, 2, 5)', Y.Color.convert('rgb(255, 2, 5)', Types.RGB), 'RGB to RGB');

                Assert.areEqual('rgba(255, 2, 5, 1)', Y.Color.convert('rgba(255, 2, 5, 1)', Types.RGBA), 'RGBa to RGBa');

                Assert.areEqual('rgba(255, 2, 5, 1)', Y.Color.convert('rgb(255, 2, 5)', Types.RGBA), 'RGB to RGBa');

                Assert.areEqual('rgb(0, 0, 0)', Y.Color.convert('000', Types.RGB), 'Hex to RGB');

                Assert.areEqual('rgba(0, 0, 0, 1)', Y.Color.convert('000', Types.RGBA), 'Hex to RGBa');

                Assert.areEqual('#FF0000', Y.Color.convert('rgb(255, 0, 0)', Types.HEX), 'RGB to Hex');

                Assert.areEqual('#0000FF', Y.Color.convert('rgba(0, 0, 255, 1)', Types.HEX), 'RGBa to Hex');

                Assert.areEqual('#00FF00', Y.Color.convert('lime', Types.HEX), 'Keyword to Hex');

                Assert.areEqual('rgb(0, 255, 0)', Y.Color.convert('lime', Types.RGB), 'Keyword to RGB');

                Assert.areEqual('rgba(0, 255, 0, 1)', Y.Color.convert('lime', Types.RGBA), 'Keyword to RGBa');
            },

            'test conversion with various strings': function () {
                Assert.areEqual('#FFFFFF', Y.Color.convert('fff', 'hex'));
                Assert.areEqual('#FFFFFF', Y.Color.convert('fff', 'HEX'));

                // invalid conversion types
                Assert.areEqual('fff', Y.Color.convert('fff', 'foo'));
                Assert.areEqual('FFF', Y.Color.convert('FFF', 'foo'));
            },

            'test original Y.DOM color conversons': function() {
                var rgb = 'rgb(97, 11, 11)', // #610b0b
                    rgba = 'rgba(97, 11, 11, 1)',
                    hex = Y.Color.toHex(rgb);

                Assert.areEqual("#610B0B", hex, '1. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '1. toRGB(' + hex + ')');
                Assert.areEqual(rgba, Y.Color.toRGBA(hex), '1. toRGBA(' + hex + ')');

            },

            'test invalid params or direct calls': function() {
                Assert.areEqual([].join(''), Y.Color.toArray('bar').join(''), 'toArray should return and empty array');

                Assert.areEqual(undefined, Y.Color._keywordToHex('orange'), 'orange should not be found as a valid keyword');

                Assert.areEqual('rgb(255, 255, 0)', Y.Color._hexToRgb('ffff00'), 'direct call to _hexToRgb');
            },

            'test fromArray conversions': function() {
                Assert.areEqual('0, 0, 0', Y.Color.fromArray([0,0,0]), 'template undefined');

                Assert.areEqual('rgba(255, 255, 255, 1)', Y.Color.fromArray([255,255,255], Types.RGBA), 'template rgba with three values');

                Assert.areEqual('rgba(255, 255, 255, 0)', Y.Color.fromArray([255,255,255,0], Types.RGBA), 'template rgba with four values');
            },

            'test direct toArray conversions': function() {
                Assert.areEqual(['ff','00','00', 1].join(', '), Y.Color.toArray('f00').join(', '), 'toArray with hex3');

                Assert.areEqual(['ff','00','00', 1].join(', '), Y.Color.toArray('#ff0000').join(', '), 'toArray with hex');

                Assert.areEqual(['0','255','0', '1'].join(', '), Y.Color.toArray('rgb(0, 255, 0)').join(', '), 'toArray with rgb');

                Assert.areEqual(['0','255','0', '1'].join(', '), Y.Color.toArray('rgba(0, 255, 0, 1)').join(', '), 'toArray with rgb');
            },

            'test toHex and back with toRGB': function() {
                var rgb = 'rgb(97, 11, 11)', // #610b0b
                    hex = Y.Color.toHex(rgb);

                Assert.areEqual("#610B0B", hex, '1. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '1. toRGB(' + hex + ')');

                rgb = 'rgb(255, 255, 255)';
                hex = Y.Color.toHex(rgb);

                Assert.areEqual("#FFFFFF", hex, '2. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '2. toRGB(' + hex + ')');

                rgb = 'rgb(255, 255, 255)';
                hex = '#fff';
                hex = Y.Color.toHex(hex);

                Assert.areEqual("#FFFFFF", hex, '3. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '3. toRGB(' + hex + ')');

                rgb = 'rgb(255, 255, 255)';
                hex = 'fff';
                hex = Y.Color.toHex(hex);

                Assert.areEqual("#FFFFFF", hex, '4. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '4. toRGB(' + hex + ')');

                rgb = 'rgb(0, 0, 0)';
                hex = '000';
                hex = Y.Color.toHex(hex);

                Assert.areEqual("#000000", hex, '5. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '5. toRGB(' + hex + ')');

                rgb = "rgb(97, 56, 11)" ;
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#61380B", "6. should be #61380B");
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '6. toRGB(' + hex + ')');

                rgb = "rgb(11, 97, 11)" ; // 0B610B
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#0B610B", "7. shoudl be #0B610B");
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '7. toRGB(' + hex + ')');

                rgb = "rgb(56, 11, 97)" ; //380B61
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#380B61", "8. shoudl be #380B61");
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '8. toRGB(' + hex + ')');

                rgb = "rgb(97, 11, 56)" ; //610B38
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#610B38", "9. shoudl be #610B38");
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '9. toRGB(' + hex + ')');
            },

            'test for trasnparent': function () {
                Y.Assert.areSame(TRANSPARENT, Y.Color.toHex(TRANSPARENT), 'trasnparent to hex');
                Y.Assert.areSame(TRANSPARENT, Y.Color.toRGB(TRANSPARENT), 'trasnparent to rgb');
                Y.Assert.areSame(TRANSPARENT, Y.Color.toRGBA(TRANSPARENT), 'transparent to rgba');
            },

            'test toHex preceeds with `#`': function () {
                Assert.areSame('#', Y.Color.toHex('olive').charAt(0), 'olive');
                Assert.areSame('#', Y.Color.toHex('fff').charAt(0), 'fff');
                Assert.areSame('#', Y.Color.toHex('#fff').charAt(0), '#fff');
                Assert.areSame('#', Y.Color.toHex('rgb(255, 255, 255)').charAt(0), 'rgb');
                Assert.areSame('#', Y.Color.toHex('rgba(255, 255, 255, 1)').charAt(0), 'rgba');
                Assert.areSame('#', Y.Color.toHex('hsl(0, 0%, 0%)').charAt(0), 'hsl');
                Assert.areSame('#', Y.Color.toHex('hsla(0, 0%, 0%, 1)').charAt(0), 'hsla');
            }

    });

    var suite = new Y.Test.Suite("Color Base");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

YUI.add('color-tests', function(Y) {

    var Assert = Y.Assert,
        testBasic = new Y.Test.Case({
            name: "Color Convertion Tests",

            'test conversion': function() {
                Assert.areEqual('#ffffff', Y.Color.convert('fff', 'hex'), 'Hex to Hex');

                Assert.areEqual('rgb(255, 2, 5)', Y.Color.convert('rgb(255, 2, 5)', 'rgb'), 'RGB to RGB');

                Assert.areEqual('rgba(255, 2, 5, 1)', Y.Color.convert('rgba(255, 2, 5, 1)', 'rgba'), 'RGBa to RGBa');

                Assert.areEqual('rgba(255, 2, 5, 1)', Y.Color.convert('rgb(255, 2, 5)', 'rgba'), 'RGB to RGBa');

                Assert.areEqual('rgb(0, 0, 0)', Y.Color.convert('000', 'rgb'), 'Hex to RGB');

                Assert.areEqual('rgba(0, 0, 0, 1)', Y.Color.convert('000', 'rgba'), 'Hex to RGBa');

                Assert.areEqual('#ff0000', Y.Color.convert('rgb(255, 0, 0)', 'hex'), 'RGB to Hex');

                Assert.areEqual('#0000ff', Y.Color.convert('rgba(0, 0, 255, 1)', 'hex'), 'RGBa to Hex');

                Assert.areEqual('#00ff00', Y.Color.convert('lime', 'hex'), 'Keyword to Hex');

                Assert.areEqual('rgb(0, 255, 0)', Y.Color.convert('lime', 'rgb'), 'Keyword to RGB');

                Assert.areEqual('rgba(0, 255, 0, 1)', Y.Color.convert('lime', 'rgba'), 'Keyword to RGBa');
            },

            'test original Y.DOM color conversons': function() {
                var rgb = 'rgb(97, 11, 11)', // #610b0b
                    rgba = 'rgba(97, 11, 11, 1)',
                    hex = Y.Color.toHex(rgb);

                Assert.areEqual("#610b0b", hex, '1. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRGB(hex), '1. toRGB(' + hex + ')');
                Assert.areEqual(rgba, Y.Color.toRGBA(hex), '1. toRGBA(' + hex + ')');

            },

            'test fromArray conversions': function() {
                Assert.areEqual('0, 0, 0', Y.Color.fromArray([0,0,0]), 'template undefined');

                Assert.areEqual('rgba(255, 255, 255, 1)', Y.Color.fromArray([255,255,255], Y.Color.STR_RGBA), 'template rgba with three values');

                Assert.areEqual('rgba(255, 255, 255, 0)', Y.Color.fromArray([255,255,255,0], Y.Color.STR_RGBA), 'template rgba with four values');
            },

            'test direct toArray conversions': function() {
                Assert.areEqual(['f','f','f'].join(', '), Y.Color.toArray('fff').join(', '), 'toArray with hex3');

                Assert.areEqual(['ff','00','00'].join(', '), Y.Color.toArray('#ff0000').join(', '), 'toArray with hex');

                Assert.areEqual(['0','255','0', '1'].join(', '), Y.Color.toArray('rgb(0, 255, 0)').join(', '), 'toArray with rgb');

                Assert.areEqual(['0','255','0', '1'].join(', '), Y.Color.toArray('rgba(0, 255, 0, 1)').join(', '), 'toArray with rgb');
            },

            'test toHex and back with toRgb': function() {
                var rgb = 'rgb(97, 11, 11)', // #610b0b
                    hex = Y.Color.toHex(rgb);

                Assert.areEqual("#610b0b", hex, '1. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '1. toRgb(' + hex + ')');

                rgb = 'rgb(255, 255, 255)';
                hex = Y.Color.toHex(rgb);

                Assert.areEqual("#ffffff", hex, '2. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '2. toRgb(' + hex + ')');

                rgb = 'rgb(255, 255, 255)';
                hex = '#fff';
                hex = Y.Color.toHex(hex);

                Assert.areEqual("#ffffff", hex, '3. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '3. toRgb(' + hex + ')');

                rgb = 'rgb(255, 255, 255)';
                hex = 'fff';
                hex = Y.Color.toHex(hex);

                Assert.areEqual("#ffffff", hex, '4. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '4. toRgb(' + hex + ')');

                rgb = 'rgb(0, 0, 0)';
                hex = '000';
                hex = Y.Color.toHex(hex);

                Assert.areEqual("#000000", hex, '5. toHex(' + rgb + ')');
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '5. toRgb(' + hex + ')');

                rgb = "rgb(97, 56, 11)" ;
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#61380b", "6. should be #61380B");
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '6. toRgb(' + hex + ')');

                rgb = "rgb(11, 97, 11)" ; // 0B610B
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#0b610b", "7. shoudl be #0B610B");
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '7. toRgb(' + hex + ')');

                rgb = "rgb(56, 11, 97)" ; //380B61
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#380b61", "8. shoudl be #380B61");
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '8. toRgb(' + hex + ')');

                rgb = "rgb(97, 11, 56)" ; //610B38
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#610b38", "9. shoudl be #610B38");
                Assert.areEqual(rgb, Y.Color.toRgb(hex), '9. toRgb(' + hex + ')');
            }

    });

    var suite = new Y.Test.Suite("Color");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

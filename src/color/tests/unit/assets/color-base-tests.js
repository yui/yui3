YUI.add('color-tests', function(Y) {

    var Assert = Y.Assert,
        testBasic = new Y.Test.Case({
            name: "Color Convertion Tests",

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

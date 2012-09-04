YUI.add('color-tests', function(Y) {

    var Assert = Y.Assert,
        testBasic = new Y.Test.Case({
            name: "Color Convertion Tests",

            testToHex: function() {
                var rgb = 'rgb(97, 11, 11)',
                    hex = Y.Color.toHex(rgb);

                Assert.areEqual("#610b0b", hex, 'toHex(' + rgb + ')');

                rgb = 'rgb(255, 255, 255)';
                hex = Y.Color.toHex(rgb);

                Assert.areEqual("#ffffff", hex, 'toHex(' + rgb + ')');

                rgb = { type: 'rgb', value: [255, 255, 255], css: true };
                hex = Y.Color.toHex(rgb);

                Assert.areEqual("#ffffff", hex, 'toHex(' + rgb + ')');

                rgb = '#fff';
                hex = Y.Color.toHex(rgb);

                Assert.areEqual("#ffffff", hex, 'toHex(' + rgb + ')');

                rgb = 'fff';
                hex = Y.Color.toRGB(rgb);

                Assert.areEqual("rgb(255, 255, 255)", hex, 'toHex(' + rgb + ')');

                rgb = '000';
                hex = Y.Color.toHex(rgb);

                Assert.areEqual("#000000", hex, 'toHex(' + rgb + ')');

                rgb = "rgb(97, 56, 11)" ;
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#61380b", " shoudl be #61380B");

                rgb = "rgb(11, 97, 11)" ; // 0B610B
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#0b610b", " shoudl be #0B610B");

                rgb = "rgb(56, 11, 97)" ; //380B61
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#380b61", " shoudl be #380B61");

                rgb = "rgb(97, 11, 56)" ; //610B38
                hex = Y.Color.toHex(rgb);
                Assert.areSame(hex, "#610b38", " shoudl be #610B38");
            }


    });

    var suite = new Y.Test.Suite("Color");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

YUI.add('color-hsl-tests', function(Y) {

    var areSame = Y.Assert.areSame,
        testBasic = new Y.Test.Case({
            name: "Color Convertion Tests",

            'convert hex to hsl': function() {
                var c = Y.Color.toHsl('#ff00ff');

                areSame('hsl(300, 100%, 50%)', c);
            },

            'convert hex to hsla': function() {
                var c = Y.Color.toHsla('#ff00ff');

                areSame('hsla(300, 100%, 50%, 1)', c);
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
                var c = Y.Color.toHsla('rgba(255, 0, 255, 0.5)');

                areSame('hsla(300, 100%, 50%, 0.5)', c);
            },

            'convert hsl to hex': function() {
                var c = Y.Color.toHex('hsl(0, 100%, 50%)');

                areSame('#ff0000', c);
            },

            'convert hsla to hex': function() {
                var c = Y.Color.toHex('hsla(0, 100%, 50%)');

                areSame('#ff0000', c);
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
                var c = Y.Color.toRgba('hsl(240, 100%, 50%)');

                areSame('rgba(0, 0, 255, 1)', c);
            },

            'convert hsla to rgba': function() {
                var c = Y.Color.toRgba('hsla(240, 100%, 50%, 0.4)');

                areSame('rgba(0, 0, 255, 0.4)', c);
            },

        });

    var suite = new Y.Test.Suite("Color");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

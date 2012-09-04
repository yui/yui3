YUI.add('color-tests', function(Y) {

    var testBasic = new Y.Test.Case({
        name: "Color Convertion Tests",

        'convert using auto for discovery': function() {
            var c = Y.Color.convert({
                type: 'auto',
                value: 'blue',
                to: 'rgb'
            });

            Y.Assert.areSame('0,0,255', c.join(','));
        },

        'backwards compat test: convert hex to rgb': function() {
            var c = Y.Color.toRGB('ff0');

            Y.Assert.areSame('rgb(255, 255, 0)', c);
        },

        'backwards compat test: convert rgb to hex': function() {
            var c = Y.Color.toHex('rgb(255,255,0)');

            Y.Assert.areSame('#ffff00', c);
        },

        'convert hex to hex': function() {
            var c = Y.Color.toHex({
                value: '#520'
            });

            Y.Assert.areSame('552200', c.join(''));
        },

        'convert hex to hexcss': function() {
            var c = Y.Color.toHex({
                value: '#ff00ff',
                css: true
            });

            Y.Assert.areSame('#ff00ff', c);
        },

        'convert hex to rgb': function() {
            var c = Y.Color.toRGB({
                value: '#ff00ff'
            });

            Y.Assert.areSame('255,0,255', c.join(','));
        },

        'convert hex to rgbcss': function() {
            var c = Y.Color.toRGB({
                value: '#ff00ff',
                css: true
            });

            Y.Assert.areSame('rgb(255, 0, 255)', c);
        },

        'convert hex to rgba': function() {
            var c = Y.Color.toRGBA({
                value: '#ff00ff'
            });

            Y.Assert.areSame('255,0,255,1', c.join(','));
        },

        'convert hex to rgbacss': function() {
            var c = Y.Color.toRGBA({
                value: '#ff00ff',
                css: true
            });

            Y.Assert.areSame('rgba(255, 0, 255, 1)', c);
        },

        'convert hex to hsl': function() {
            var c = Y.Color.toHSL({
                value: '#ff00ff'
            });

            Y.Assert.areSame('300,100,50', c.join(','));
        },

        'convert hex to hslcss': function() {
            var c = Y.Color.toHSL({
                value: '#ff00ff',
                css: true
            });

            Y.Assert.areSame('hsl(300, 100%, 50%)', c);
        },

        'convert hex to hsla': function() {
            var c = Y.Color.toHSLA({
                value: '#ff00ff'
            });

            Y.Assert.areSame('300,100,50,1', c.join(','));
        },

        'convert hex to hslcssa': function() {
            var c = Y.Color.toHSLA({
                value: '#ff00ff',
                css: true
            });

            Y.Assert.areSame('hsla(300, 100%, 50%, 1)', c);
        },

        'convert rgba to rgbacss - opacity check': function() {
            var c = Y.Color.convert({
                type: 'rgba',
                value: [255, 255, 255, 0],
                to: 'rgba',
                css: true
            });

            Y.Assert.areSame('rgba(255, 255, 255, 0)', c);
        },

        'convert rgba to hex': function() {
            var c = Y.Color.convert({
                type: 'rgba',
                value: [255, 255, 255, 0.3],
                to: 'hex',
                css: true
            });

            Y.Assert.areSame('#ffffff', c);
        },

        'convert hsl to rgba': function() {
            var c = Y.Color.convert({
                type: 'hsl',
                value: [180, 100, 50],
                to: 'rgba',
                css: true
            });

            Y.Assert.areSame('rgba(0, 255, 255, 1)', c);
        },

        'convert hsl to hex': function() {
            var c = Y.Color.convert({
                type: 'hsl',
                value: 'hsl(180, 100%, 50%)',
                to: 'hex',
                css: true
            });

            Y.Assert.areSame('#00ffff', c);
        },

        'convert hsla to hsl': function() {
            var c = Y.Color.convert({
                type: 'hsla',
                value: [120, 100, 50, 1],
                to: 'hsl',
                css: true
            });

            Y.Assert.areSame('hsl(120, 100%, 50%)', c);
        },

        'convert hsla to hex': function() {
            var c = Y.Color.convert({
                type: 'hsla',
                value: [120, 100, 50, 0.5],
                to: 'hex',
                css: true
            });

            Y.Assert.areSame('#00ff00', c);
        }

    });

    var suite = new Y.Test.Suite("Color");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

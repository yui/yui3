YUI.add('color-tests', function(Y) {

    var colors = {
            'white':  { type: 'hsl', value: [   0,   0,100], to: 'hex', css: true },
            'black':  { type: 'hsl', value: [   0,   0,  0], to: 'hsl', css: true },
            'red':    { type: 'hsl', value: [   0, 100, 50], to: 'hsl', css: true },
            'orange': { type: 'hsl', value: [  30, 100, 50], to: 'hsl', css: true },
            'yellow': { type: 'hsl', value: [  60, 100, 50], to: 'hsl', css: true },
            'green':  { type: 'hsl', value: [ 120, 100, 50], to: 'hsl', css: true },
            'blue':   { type: 'hsl', value: [ 240, 100, 50], to: 'hsl', css: true },
            'purple': { type: 'hsl', value: [ 300, 100, 50], to: 'hsl', css: true }
        },

        colorsString = {},

        testBasic = new Y.Test.Case({
            name: "Color Convertion Tests",

            'log original color values': function() {
                Y.Object.each(colors, function(v, k) {
                    colorsString[k] = v.value.join(',');
                });
            },

            'complementary of "blue"': function() {
                var c = Y.Color.getComplementary(colors.blue);

                Y.Assert.areSame(2, c.length);
            },

            'complementary of "orange"': function() {
                var c = Y.Color.getComplementary(colors.orange);

                Y.Assert.areSame(2, c.length);
            },

            'split complementary of "blue"': function() {
                var c = Y.Color.getSplit(colors.blue);

                Y.Assert.areSame(3, c.length, 'length is greater than 1');
            },

            'analogous of "red"': function() {
                var c = Y.Color.getAnalogous(colors.red);

                Y.Assert.areSame(5, c.length, 'length is greater than 1');
            },

            'triad of "orange"': function() {
                var c = Y.Color.getTriad(colors.orange);

                Y.Assert.areSame(3, c.length, 'length is greater than 1');
            },

            'tetrad of "purple"': function() {
                var c = Y.Color.getTetrad(colors.purple);

                Y.Assert.areSame(4, c.length, 'length is greater than 1');
            },

            'square of "purple"': function() {
                var c = Y.Color.getSquare(colors.purple);

                Y.Assert.areSame(4, c.length, 'length is greater than 1');
            },

            'monochrome of "green"': function() {
                var c = Y.mix({ count: 5 }, colors.green);
                c = Y.Color.getMonochrome(c);

                Y.Assert.areSame(5, c.length, 'length is greater than 1');
            },

            'similar of "purple"': function() {
                var c = Y.mix({ count: 5 }, colors.purple);
                c = Y.Color.getSimilar(c);

                Y.Assert.areSame(6, c.length, 'length is greater than 1');
            },

            'hue offset to +10 of "blue"': function() {
                var c = Y.Color.getOffset(Y.mix({ to: 'hex' }, colors.blue), {h: 10});

                Y.Assert.areSame('#2a00ff', c, 'length is greater than 1');
            },

            'saturation offset to -10 of "orange"': function() {
                var c = Y.Color.getOffset(Y.mix({ to: 'hex' }, colors.orange), {s: -10});

                Y.Assert.areSame('#f2800d', c, 'length is greater than 1');
            },

            'luminance offset to -10 of "purple"': function() {
                var c = Y.Color.getOffset(Y.mix({ to: 'hex' }, colors.purple), {l: -10});

                Y.Assert.areSame('#cc00cc', c, 'length is greater than 1');
            },

            'brightness of "yellow"': function() {
                var b = Y.Color.getBrightness(colors.yellow);

                Y.Assert.areSame(0.97, Math.round(b*100)/100, 'length is greater than 1');
            },

            'similar brightness of "yellow" matching "blue"': function() {
                var c = Y.Color.getSimilarBrightness(Y.mix({ to: 'hex' }, colors.yellow), colors.blue);

                Y.Assert.areSame('#474700', c, 'length is greater than 1');
            },

            'log color values': function() {
                Y.Object.each(colors, function(v, k) {
                    Y.Assert.areSame(v.value.join(','), colorsString[k], k + ' is not the same');
                });
            }


        });

    var suite = new Y.Test.Suite("Color");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

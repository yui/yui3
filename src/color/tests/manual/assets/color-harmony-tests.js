YUI.add('color-harmony-tests', function(Y) {

    function addOutput (title, input, colors) {
        var output = Y.one('#output dl');
        output.append('<dt>' + title + '</dt>');

        var dd = '<dd>';
        dd += 'test: <span class="color" style="background: ' + input + ';"></span>';
        dd += '</dd><dd>result: ';

        colors = Y.Array(colors);
        Y.Array.each(colors, function(color) {
            dd += color + ' <span class="color" style="background: ' + color + ';"></span>';
        });
        dd += '</dd>';
        output.append(dd);
    }

    var testBasic = new Y.Test.Case({
            name: "Color Convertion Tests",

            'complementary of "blue"': function() {
                var c = Y.Color.getComplementary('blue');

                Y.Assert.areSame(2, c.length);
                addOutput('complementary of "blue"', "blue", c);
            },

            'complementary of "#ff7700"': function() {
                var c = Y.Color.getComplementary('#ff7700');

                Y.Assert.areSame(2, c.length);
                addOutput('complementary of "#ff7700"', "#ff7700", c);
            },

            'split complementary of "blue"': function() {
                var c = Y.Color.getSplit('blue');

                Y.Assert.areSame(3, c.length, 'length is greater than 1');
                addOutput('split complementary of "blue"', "blue", c);
            },

            'split complementary of "blue" with 45 degree offset': function() {
                var c = Y.Color.getSplit('blue', 45);

                Y.Assert.areSame(3, c.length, 'length is greater than 1');
                addOutput('split complementary of "blue" with 45 degree offset', "blue", c);
            },

            'analogous of "red"': function() {
                var c = Y.Color.getAnalogous('red');

                Y.Assert.areSame(5, c.length, 'length is greater than 1');
                addOutput('analogous of "red"', 'red', c);
            },

            'triad of "#ff7700"': function() {
                var c = Y.Color.getTriad('#ff7700');

                Y.Assert.areSame(3, c.length, 'length is greater than 1');
                addOutput('triad of "#ff7700"', '#ff7700', c);
            },

            'tetrad of "#ff00ff"': function() {
                var c = Y.Color.getTetrad('#ff00ff');

                Y.Assert.areSame(4, c.length, 'length is greater than 1');
                addOutput('tetrad of "#ff00ff"', '#ff00ff', c);
            },

            'square of "#ff00ff"': function() {
                var c = Y.Color.getSquare('#ff00ff');

                Y.Assert.areSame(4, c.length, 'length is greater than 1');
                addOutput('square of "#ff00ff"', '#ff00ff', c);
            },

            'monochrome of "#ff7700"': function() {
                var c = Y.Color.getMonochrome('#ff7700', 5);

                Y.Assert.areSame(5, c.length, 'length is greater than 1');
                addOutput('monochrome of "#ff7700"', '#ff7700', c);
            },

            'similar of "#ff00ff"': function() {
                var c = Y.Color.getSimilar('#ff00ff', 180, 35);

                //Y.Assert.areSame(6, c.length, 'length is greater than 1');
                addOutput('similar of "#ff00ff"', '#ff00ff', c);
            },

            'hue offset to +10 of "blue"': function() {
                var c = Y.Color.getOffset('blue', {h: 10});

                Y.Assert.areSame('#2a00ff', c, 'length is greater than 1');
                addOutput('hue offset to +10 of "blue"', 'blue', c);
            },

            'saturation offset to -10 of "#ff7700"': function() {
                var c = Y.Color.getOffset('#ff7700', {s: -10});

                Y.Assert.areSame('#f2780d', c, 'length is greater than 1');
                addOutput('saturation offset to -10 of "#ff7700"', '#ff7700', c);
            },

            'luminance offset to -10 of "#ff00ff"': function() {
                var c = Y.Color.getOffset('#ff00ff', {l: -10});

                Y.Assert.areSame('#cc00cc', c, 'length is greater than 1');
                addOutput('luminance offset to -10 of "#ff00ff"', '#ff00ff', c);
            },

            'brightness of "yellow"': function() {
                var c = Y.Color.getSimilarBrightness('yellow', 'blue', 'rgb');

                Y.Assert.areSame('rgb(71, 71, 0)', c, 'incorrect color matching');
            },

            'similar brightness of "yellow" matching "blue"': function() {
                var c = Y.Color.getSimilarBrightness('yellow', 'blue');

                Y.Assert.areSame('#474700', c, 'length is greater than 1');
                addOutput('similar brightness of "yellow" matching "blue"', 'yellow', c);
            }


        });

    var suite = new Y.Test.Suite("Color");
    suite.add(testBasic);

    Y.Test.Runner.add(suite);

});

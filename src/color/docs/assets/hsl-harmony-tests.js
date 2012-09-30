YUI.add('hsl-harmony-tests', function(Y) {

    var Assert = Y.Assert,

        hDial = Y.one('#hue-dial .yui3-dial'),

        sSlider = Y.one('#sat-slider .yui3-slider-rail'),
        lSlider = Y.one('#lum-slider .yui3-slider-rail'),

        complementary = Y.one('#h-complementary'),
        split = Y.one('#h-split-complementary'),
        analogous = Y.one('#h-analogous'),
        triad = Y.one('#h-triad'),
        square = Y.one('#h-square'),
        tetrad = Y.one('#h-tetrad'),
        mono = Y.one('#h-monochromatic'),
        similar = Y.one('#h-similar'),

        COMPLEMENTARY_COUNT = 2,
        SPLIT_COUNT = 3,
        ANALOGOUS_COUNT = 5,
        TRIAD_COUNT = 3,
        SQUARE_COUNT = 4,
        TETRAD_COUNT = 4,
        MONO_COUNT = 5,
        SIMILAR_COUNT = 6;

        suite = new Y.Test.Suite('hsl-harmony-tests');

    function sliderXAtVal(slider, sliderMax, val) {
        var width = slider.get('region').width,
            percent = val / sliderMax;

        return width * percent;
    }

    suite.add(new Y.Test.Case({
        name: 'hsl-harmony',
        'is rendered': function() {
            var el = Y.one('#demo');

            Assert.isNotNull(el, '#demo not on page.');

            Assert.isNotNull(hDial, '#r-slider not on page.');
            Assert.isNotNull(sSlider, '#g-slider not on page.');
            Assert.isNotNull(lSlider, '#b-slider not on page.');

            Assert.isNotNull(complementary, '#h-complementary not on page.'),
            Assert.isNotNull(split, '#h-split-complementary not on page.'),
            Assert.isNotNull(analogous, '#h-analogous not on page.'),
            Assert.isNotNull(triad, '#h-triad not on page.'),
            Assert.isNotNull(square, '#h-square not on page.'),
            Assert.isNotNull(tetrad, '#h-tetrad not on page.'),
            Assert.isNotNull(mono, '#h-monochromatic not on page.'),
            Assert.isNotNull(similar, '#h-similar not on page.');
        },

        'set hue and test outputs': function() {
            var test = this,
                hRing = hDial.one('.yui3-dial-ring'),
                hRingReg = hRing.get('region'),
                hClickX = hRingReg.left + 15,
                hClickY = hRingReg.top + (hRingReg.height / 2);

            test.wait(function() {
                hRing.simulate('mousedown', {
                    clientX: hClickX,
                    clientY: hClickY
                });
                hRing.simulate('mouseup');

                sSlider.simulate('mousedown', {
                    clientX: sSlider.getX() + sliderXAtVal(sSlider, 100, 50),
                    clientY: sSlider.getY() + 10
                });
                sSlider.simulate('mouseup');

                lSlider.simulate('mousedown', {
                    clientX: lSlider.getX() + sliderXAtVal(lSlider, 100, 75),
                    clientY: lSlider.getY() + 10
                });

                lSlider.simulate('mouseup');

                Assert.areSame(COMPLEMENTARY_COUNT, complementary.all('.swatch').size(), '#complementary does not have correct number of swatches.');
                Assert.areSame(SPLIT_COUNT, split.all('.swatch').size(), '#split does not have correct number of swatches.');
                Assert.areSame(ANALOGOUS_COUNT, analogous.all('.swatch').size(), '#analogous does not have correct number of swatches.');
                Assert.areSame(TRIAD_COUNT, triad.all('.swatch').size(), '#triad does not have correct number of swatches.');
                Assert.areSame(SQUARE_COUNT, square.all('.swatch').size(), '#square does not have correct number of swatches.');
                Assert.areSame(TETRAD_COUNT, tetrad.all('.swatch').size(), '#tetrad does not have correct number of swatches.');
                Assert.areSame(MONO_COUNT, mono.all('.swatch').size(), '#mono does not have correct number of swatches.');
                Assert.areSame(SIMILAR_COUNT, similar.all('.swatch').size(), '#similar does not have correct number of swatches.');
            }, 500);
        },

        'check for tooltip hide and show': function() {
            var swatch = complementary.one('.swatch');

            swatch.simulate('click');

            Assert.isNotNull(swatch.one('.tooltip'), 'No tooltip found.');

            swatch.simulate('click');

            Assert.isNull(swatch.one('.tooltip'), 'Tooltip is found.');
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'event', 'node-event-simulate', 'color' ] });

YUI.add('rgb-slider-tests', function(Y) {

    var Assert = Y.Assert,

        rSlider = Y.one('#r-slider .yui3-slider-rail'),
        gSlider = Y.one('#g-slider .yui3-slider-rail'),
        bSlider = Y.one('#b-slider .yui3-slider-rail'),

        rVal = Y.one('#r-val'),
        gVal = Y.one('#g-val'),
        bVal = Y.one('#b-val'),

        hexStr = Y.one('#hex'),
        rgbStr = Y.one('#rgb'),
        hslStr = Y.one('#hsl'),

        suite = new Y.Test.Suite('rgb-slider-tests');

    function sliderXAtVal(slider, sliderMax, val) {
        var width = slider.get('region').width,
            percent = val / sliderMax;

        return width * percent;
    }

    suite.add(new Y.Test.Case({
        name: 'rgb-slider',
        'is rendered': function() {
            var el = Y.one('#demo');

            Assert.isNotNull(el, '#demo not on page.');

            Assert.isNotNull(rSlider, '#r-slider not on page.');
            Assert.isNotNull(gSlider, '#g-slider not on page.');
            Assert.isNotNull(bSlider, '#b-slider not on page.');

            Assert.isNotNull(rVal, '#r-val not on page.');
            Assert.isNotNull(gVal, '#g-val not on page.');
            Assert.isNotNull(bVal, '#b-val not on page.');

            Assert.isNotNull(hexStr, '#hex not on page.');
            Assert.isNotNull(rgbStr, '#rgb not on page.');
            Assert.isNotNull(hslStr, '#hsl not on page.');
        },

        'set slider values to 0,0,0': function() {
            var test = this;
            test.wait(function() {
                var rv = 0,
                    gv = 0,
                    bv = 0;

                rSlider.simulate('mousedown', {
                    clientX: rSlider.getX() + sliderXAtVal(rSlider, 255, rv),
                    clientY: rSlider.getY() + 10
                });

                gSlider.simulate('mousedown', {
                    clientX: gSlider.getX() + sliderXAtVal(gSlider, 255, gv),
                    clientY: gSlider.getY() + 10
                });

                bSlider.simulate('mousedown', {
                    clientX: bSlider.getX() + sliderXAtVal(bSlider, 255, bv),
                    clientY: bSlider.getY() + 10
                });

                bSlider.simulate('mouseup');


                Assert.areSame(rv.toString(), rVal.get('text'), 'rVal is not ' + rv + '.');
                Assert.areSame(gv.toString(), gVal.get('text'), 'gVal is not ' + gv + '.');
                Assert.areSame(bv.toString(), bVal.get('text'), 'bVal is not ' + bv + '.');

                Assert.areSame('#000000', hexStr.get('text'), 'hexStr is not #000000.');
                Assert.areSame('rgb(0, 0, 0)', rgbStr.get('text'), 'rgbStr is not rgb(0, 0, 0)');
                Assert.areSame('hsl(0, 0%, 0%)', hslStr.get('text'), 'hexStr is not hsl(0, 0%, 0%)');
            }, 500);
        },

        'set slider values to 128, 128, 128': function() {
            var test = this;
            test.wait(function() {
                var rv = 128,
                    gv = 128,
                    bv = 128;


                rSlider.simulate('mousedown', {
                    clientX: rSlider.getX() + 1 + sliderXAtVal(rSlider, 255, rv),
                    clientY: rSlider.getY() + 10
                });

                gSlider.simulate('mousedown', {
                    clientX: gSlider.getX() + 1 + sliderXAtVal(gSlider, 255, gv),
                    clientY: gSlider.getY() + 10
                });

                bSlider.simulate('mousedown', {
                    clientX: bSlider.getX() + 1 + sliderXAtVal(bSlider, 255, bv),
                    clientY: bSlider.getY() + 10
                });
                bSlider.simulate('mouseup');


                Assert.areSame(rv.toString(), rVal.get('text'), 'rVal is not ' + rv + '.');
                Assert.areSame(gv.toString(), gVal.get('text'), 'gVal is not ' + gv + '.');
                Assert.areSame(bv.toString(), bVal.get('text'), 'bVal is not ' + bv + '.');

                Assert.areSame('#808080', hexStr.get('text'), 'hexStr is not #808080.');
                Assert.areSame('rgb(128, 128, 128)', rgbStr.get('text'), 'rgbStr is not rgb(128, 128, 128)');
                Assert.areSame('hsl(0, 0%, 50%)', hslStr.get('text'), 'hexStr is not hsl(0, 0%, 50%)');
            }, 1000);
        },

        'set slider values to 255, 255, 255': function() {
            var test = this;
            test.wait(function() {
                var rv = 255,
                    gv = 255,
                    bv = 255;

                rSlider.simulate('mousedown', {
                    clientX: rSlider.getX() + sliderXAtVal(rSlider, 255, rv),
                    clientY: rSlider.getY() + 10
                });

                gSlider.simulate('mousedown', {
                    clientX: gSlider.getX() + sliderXAtVal(gSlider, 255, gv),
                    clientY: gSlider.getY() + 10
                });

                bSlider.simulate('mousedown', {
                    clientX: bSlider.getX() + sliderXAtVal(bSlider, 255, bv),
                    clientY: bSlider.getY() + 10
                });
                bSlider.simulate('mouseup');

                Assert.areSame(rv.toString(), rVal.get('text'), 'rVal is not ' + rv + '.');
                Assert.areSame(gv.toString(), gVal.get('text'), 'gVal is not ' + gv + '.');
                Assert.areSame(bv.toString(), bVal.get('text'), 'bVal is not ' + bv + '.');

                Assert.areSame('#FFFFFF', hexStr.get('text'), 'hexStr is not #FFFFFF.');
                Assert.areSame('rgb(255, 255, 255)', rgbStr.get('text'), 'rgbStr is not rgb(255, 255, 255)');
                Assert.areSame('hsl(0, 0%, 100%)', hslStr.get('text'), 'hexStr is not hsl(0, 0%, 100%)');
            }, 1500);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'event', 'node-event-simulate' ] });

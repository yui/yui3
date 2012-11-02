YUI.add('hsl-picker-tests', function(Y) {

    var Assert = Y.Assert,

        hDial = Y.one('#hue-dial .yui3-dial'),

        sSlider = Y.one('#sat-slider .yui3-slider-rail'),
        lSlider = Y.one('#lum-slider .yui3-slider-rail'),

        hVal = Y.one('#hue-dial .yui3-dial-value-string'),
        sVal = Y.one('#sat-slider strong span'),
        lVal = Y.one('#lum-slider strong span'),

        hexVal = Y.one('#hex-output'),
        rgbVal = Y.one('#rgb-output'),
        hslVal = Y.one('#hsl-output'),

        suite = new Y.Test.Suite('rgb-picker-tests');

    function sliderXAtVal(slider, sliderMax, val) {
        var width = slider.get('region').width,
            percent = val / sliderMax;

        return width * percent;
    }

    suite.add(new Y.Test.Case({
        name: 'rgb-picker',
        'is rendered': function() {
            var el = Y.one('#demo');

            Assert.isNotNull(el, '#demo not on page.');

            Assert.isNotNull(hDial, '#r-slider not on page.');
            Assert.isNotNull(sSlider, '#g-slider not on page.');
            Assert.isNotNull(lSlider, '#b-slider not on page.');

            Assert.isNotNull(hVal, '#r-val not on page.');
            Assert.isNotNull(sVal, '#g-val not on page.');
            Assert.isNotNull(lVal, '#b-val not on page.');

            Assert.isNotNull(hexVal, '#hex not on page.');
            Assert.isNotNull(rgbVal, '#rgb not on page.');
            Assert.isNotNull(hslVal, '#hsl not on page.');
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
                    clientX: lSlider.getX() + sliderXAtVal(lSlider, 100, 100),
                    clientY: lSlider.getY() + 10
                });

                lSlider.simulate('mouseup');

                var hsl = Y.Color.fromArray([hVal.get('text'), sVal.get('text').replace('%',''), lVal.get('text').replace('%', '')], Y.Color.TYPES.HSL);

                Y.Assert.areSame(Y.Color.toHex(hsl), hexVal.get('value'), 'hexVal is not correct');
                Y.Assert.areSame(Y.Color.toRGB(hsl), rgbVal.get('value'), 'rgbVal is not correct');
                Y.Assert.areSame(hsl, hslVal.get('value'), 'hslVal is not correct');
            }, 500);
        },

        'set hex and check values': function() {
            hexVal.simulate('mousedown');
            hexVal.set('value', '#ff00ff');

            this.wait(function() {
                var hsl = Y.Color.fromArray([hVal.get('text'), sVal.get('text').replace('%',''), lVal.get('text').replace('%', '')], Y.Color.TYPES.HSL);

                Y.Assert.areSame(Y.Color.toHex(hsl), hexVal.get('value'), 'hexVal is not correct');
                Y.Assert.areSame(Y.Color.toRGB(hsl), rgbVal.get('value'), 'rgbVal is not correct');
                Y.Assert.areSame(hsl, hslVal.get('value'), 'hslVal is not correct');
            }, 500);
        },

        'set rgb and check values': function() {
            rgbVal.simulate('mousedown');
            rgbVal.set('value', 'rgb(50, 50, 50)');

            this.wait(function() {
                var hsl = Y.Color.fromArray([hVal.get('text'), sVal.get('text').replace('%',''), lVal.get('text').replace('%', '')], Y.Color.TYPES.HSL);

                Y.Assert.areSame(Y.Color.toHex(hsl), hexVal.get('value'), 'hexVal is not correct');
                Y.Assert.areSame(Y.Color.toRGB(hsl), rgbVal.get('value'), 'rgbVal is not correct');
                Y.Assert.areSame(hsl, hslVal.get('value'), 'hslVal is not correct');
            }, 500);
        },

        'set hsl and check values': function() {
            var hsl = 'hsl(200, 75%, 50%)';

            hslVal.simulate('mousedown');
            hslVal.set('value', 'hsl(200, 75%, 50%)');

            this.wait(function() {
                var hsl = Y.Color.fromArray([hVal.get('text'), sVal.get('text').replace('%',''), lVal.get('text').replace('%', '')], Y.Color.TYPES.HSL);

                Y.Assert.areSame(Y.Color.toHex(hsl), hexVal.get('value'), 'hexVal is not correct');
                Y.Assert.areSame(Y.Color.toRGB(hsl), rgbVal.get('value'), 'rgbVal is not correct');
                Y.Assert.areSame(hsl, hslVal.get('value'), 'hslVal is not correct');
            }, 500);
        }


    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'event', 'node-event-simulate', 'color' ] });

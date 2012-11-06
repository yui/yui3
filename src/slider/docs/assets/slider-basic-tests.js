YUI.add('slider-basic-tests', function(Y){

    // copied this from event-key-test.js to add tests for changing value by keyboard
    Y.Node.prototype.key = function (code, mods, type) {
        var simulate = Y.Event.simulate,
            el       = this._node,
            config   = Y.merge(mods || {}, { keyCode: code, charCode: code });

        if (typeof code === "string") {
            code = code.charCodeAt(0);
        }

        if (type) {
            simulate(el, type, config);
        } else {
            simulate(el, 'keydown', config);
            simulate(el, 'keyup', config);
            simulate(el, 'keypress', config);
        }
    };
    // END   copied this from event-key-test.js to add tests for changing value by keyboard


    var suite = new Y.Test.Suite('slider-basic examples test');

    suite.add(new Y.Test.Case({
        name: 'Slider Tests',

        'should have nodes available': function() {
            var demo = Y.one('#demo'),
                horzInput = demo.one('#horiz_value'),
                vertInput = demo.one('#vert_value'),
                horzSlider,
                vertSlider;

            Y.Assert.isNotNull(horzInput);
            Y.Assert.isNotNull(vertInput);

            this.wait(function(){
                horzSlider = demo.one('.horiz_slider .yui3-slider');
                vertSlider = demo.one('.vert_slider .yui3-slider');

                Y.Assert.isNotNull(horzSlider);
                Y.Assert.isNotNull(vertSlider);
            }, 100);
        },

        'should update horizontal slider when value is changed': function() {
            var input = Y.one('#horiz_value'),
                slider = Y.one('#demo .horiz_slider .yui3-slider'),
                thumb = slider.one('.yui3-slider-thumb'),
                testValue = '33';

            /* DOES NOT START WITH ARIA VALUES :(
            this.wait(function() {
                Y.Assert.areEqual(input.get('value'), thumb.get('aria-valuenow'), 'Slider is not at value of input.');
            }, 200);
            */

            input.set('value', testValue);
            input.key(13);

            this.wait(function() {
                Y.Assert.areEqual(testValue, thumb.get('aria-valuenow'), 'Thumb does not have the correct value.');

                testValue = '66';

                input.set('value', testValue);
                input.key(13);

                this.wait(function() {
                    Y.Assert.areEqual(testValue, thumb.get('aria-valuenow'), 'Thumb does not have the correct value.');
                }, 200);
            }, 200);
        },

        'should update vertical slider when value is changed': function() {
            var input = Y.one('#vert_value'),
                slider = Y.one('#demo .vert_slider .yui3-slider'),
                thumb = slider.one('.yui3-slider-thumb'),
                testValue = '-33';

            /* DOES NOT START WITH ARIA VALUES :(
            this.wait(function() {
            this.wait(function() {
                Y.Assert.areEqual(input.get('value'), thumb.get('aria-valuenow'), 'Slider is not at value of input.');
            }, 200);
            */


            input.set('value', testValue);
            input.key(13);

            this.wait(function() {
                Y.Assert.areEqual(testValue, thumb.get('aria-valuenow'), 'Thumb does not have the correct value.');

                testValue = '66';

                input.set('value', testValue);
                input.key(13);

                this.wait(function() {
                    Y.Assert.areEqual(testValue, thumb.get('aria-valuenow'), 'Thumb does not have the correct value.');
                }, 200);
            }, 200);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {requires: ['slider','test', 'node-event-simulate']});
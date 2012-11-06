YUI.add('slider-from-markup-tests', function(Y){ 

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


	var suite = new Y.Test.Suite('slider-from-markup examples test');

	suite.add(new Y.Test.Case({

		name: 'slider-from-markup',

		'should have supporting markup': function() {
			var demo = Y.one('#demo'),
				input = demo.one('#volume'),
				slider = demo.one('#volume_slider'),
				mute = demo.one('#mute');

			Y.Assert.isNotNull(input, 'Input node is not available.');
			Y.Assert.isNotNull(slider, 'Slider widget is not availble');
			Y.Assert.isNotNull(mute, 'Mute checkbox is not available');

			// check to see if the volume slider has been PE'd
			this.wait(function(){
				Y.Assert.isNotNull(slider.one('.yui3-slider'), 'Slider node has not been enhanced.');
			}, 200);
		},

		'volume button should open and close slider': function() {
			var button = Y.one('#volume_icon'),
				slider = Y.one('#volume_slider'),
				controls = Y.one('#volume_control'),
				visible = slider.getComputedStyle('display') !== 'none';

			button.simulate('click');

			Y.Assert.areSame(!visible, slider.getComputedStyle('display') !== 'none', 'Slider visibility has not changed');

			button.simulate('click');

			Y.Assert.areSame(visible, slider.getComputedStyle('display') !== 'none', 'Slider visibility has not changed.');

		},

		'input should adjust volume slider': function() {
            var input = Y.one('#volume'),
                slider = Y.one('#volume_slider .yui3-slider'),
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
                }, 800);
            }, 600);
		},

		'setting the mute checkbox should disable the input and slider': function() {
			var test = this,
				volume = Y.one('#volume'),
				slider = Y.one('#volume_slider .yui3-slider'),
				mute = Y.one('#mute');

			mute.set('checked', null);

			Y.Assert.isFalse(volume.get('disabled'), 'Volume is disabled.');
			Y.Assert.isFalse(slider.hasClass('yui3-slider-disabled'), 'Slider is disabled.');

			mute.simulate('click');

			test.wait(function() {

				Y.Assert.isTrue(volume.get('disabled'), 'Volume is enabled.');
				Y.Assert.isTrue(slider.hasClass('yui3-slider-disabled'), 'Slider is enabled.');

				mute.simulate('click');

				Y.Assert.isFalse(volume.get('disabled'), 'Volume is disabled.');
				Y.Assert.isFalse(slider.hasClass('yui3-slider-disabled'), 'Slider is disabled.');
			}, 200);

		}
	}));

	Y.Test.Runner.add(suite);

}, '', {requires: ['slider', 'test', 'node-event-simulate']});
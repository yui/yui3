YUI.add('slider-skin-tests', function(Y){

	var suite = new Y.Test.Suite('slider-skin example tests');

	suite.add(new Y.Test.Case({

		name: 'Slider Skin Tests', 

		'should have four light and dark modules': function() {
			var light = Y.one('.light'),
				dark = Y.one('.dark');

			Y.Assert.isNotNull(light.one('.yui3-skin-sam'), 'No light sam skin.');
			Y.Assert.isNotNull(light.one('.yui3-skin-capsule'), 'No light capsule skin.');
			Y.Assert.isNotNull(light.one('.yui3-skin-round'), 'No light round skin.');
			Y.Assert.isNotNull(light.one('.yui3-skin-audio-light'), 'No light audio skin.');

			Y.Assert.isNotNull(dark.one('.yui3-skin-sam-dark'), 'No dark sam skin.');
			Y.Assert.isNotNull(dark.one('.yui3-skin-capsule-dark'), 'No dark capsule skin.');
			Y.Assert.isNotNull(dark.one('.yui3-skin-round-dark'), 'No dark round skin.');
			Y.Assert.isNotNull(dark.one('.yui3-skin-audio'), 'No dark audio skin.');
		},

		'should have 8 slider modules on the page': function() {
			var demo = Y.one('#demo'),
				sliders = demo.all('.yui3-slider');

			this.wait(function() {
				Y.Assert.areSame(8, sliders.size(), 'There are ' + sliders.size() + ' sliders on the page.');
			}, 200);
		}

	}));

	Y.Test.Runner.add(suite);

}, '', {requires: ['slider', 'test', 'node-event-simulate']});
YUI.add('stylesheet-theme-tests', function(Y) {

    var suite = new Y.Test.Suite('stylesheet-theme example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test if overlay is showing': function() {
            var overlay = Y.one('.yui3-overlay');
            Assert.isNotNull(overlay, ' - Failed to initiate the panel');
        },
        'test clicking to change value of font-size slider': function() {
            var overlay = Y.one('.yui3-overlay'),
                slider = overlay.one('.yui3-slider-rail'),
                fontSize = Y.one('body').getStyle('fontSize');
            slider.simulate("mousedown", { clientX: 5, clientY: 10 });
            slider.simulate("mouseup", { clientX: 5, clientY: 10 });
            Assert.areNotEqual(fontSize, Y.one('body').getStyle('fontSize'), ' - Failed to move to correct XY');
        },
        'test changing color of heads': function() {
            var overlay = Y.one('.yui3-overlay'),
                h1 = Y.one('h1'),
                h1Color,
                colorInput = Y.one('#heading_color');
            colorInput.set('value', '#f00');
            colorInput.simulate('keyup');

            h1Color = h1.getComputedStyle('color').replace(/\s/g, "");

            Assert.areEqual('rgb(255,0,0)', h1Color, ' - Failed change color of h1');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

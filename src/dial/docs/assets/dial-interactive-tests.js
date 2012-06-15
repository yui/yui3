YUI.add('dial-interactive-tests', function(Y) {

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

    var suite = new Y.Test.Suite('dial-interactive example test suite'),
        Assert = Y.Assert,
        output = Y.one('.yui3-dial .yui3-dial-value-string'),
        input = Y.one('.yui3-dial .yui3-dial-ring');

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'example has 2 initial images': function() {
            var imgs = Y.all('.example img');
            Assert.areEqual(2, imgs.size(), 'Failed to render all images');
        },

        'example dial initial value check': function() {
            Assert.areEqual('0.00', output.getContent(), 'Failed to initialize dial to zero');
        },

        'dial keyboard major increment changes value and scene': function() {
            input.key(33); // up
            Assert.areEqual('10.00', output.getContent(), 'Key "pageup" failed to increment value by major value');
            Assert.areEqual('-5490px', Y.one('#scene').getStyle('top'), 'Failed to move scene when 1 major keyboard increment');
        },

        'dial keyboard minor increment': function() {
            input.key(37); // left
            input.key(37); // left
            Assert.areEqual('-5510px', Y.one('#scene').getStyle('top'), '2 key arrow lefts failed to move scene 2 minor keyboard increments');
        },

        'scene goes to Hubble when Hubble link is clicked.': function() {
            Y.one('.example #a-hubble').simulate("click");
            Assert.areEqual('559.00', output.getContent(), 'Clicking "Hubble" link failed to set value correctly');
            Assert.areEqual('0px', Y.one('#scene').getStyle('top'), 'Clicking "Hubble" link failed to move scene to hubble');
        },

        'dial keyboard home goes to min value': function() {
            input.key(36); // home
            Assert.areEqual('-35.00', output.getContent(), 'Home key failed to set dial to min');
            Assert.areEqual('-5940px', Y.one('#scene').getStyle('top'), 'Failed to move scene to near earths mantle');
        },

        'dial keyboard end goes to max (Hubble) value': function() {
            input.key(35); // end
            Assert.areEqual('559.00', output.getContent(), 'End key failed to set dial to min');
            Assert.areEqual('0px', Y.one('#scene').getStyle('top'), 'Failed to move scene to show Hubble');
        },

        'scene goes to altitude zero when center button is clicked.': function() {
            Y.one('.yui3-dial .yui3-dial-center-button').simulate("mousedown");
            Assert.areEqual('0.00', output.getContent(), 'Failed to move scene to altitude zero on center button click');
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'dial', 'node-event-simulate' ] });


/*,

*/
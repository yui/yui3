YUI.add('duck-tests', function(Y) {

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

    var suite = new Y.Test.Suite('duck example test suite'),
        Assert = Y.Assert,
        output = Y.one('.yui3-dial .yui3-dial-value-string'),
        input = Y.one('.yui3-dial .yui3-dial-ring');

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'example dial initial value check': function() {
            Assert.areEqual('13000', output.getContent(), 'Failed to initialize dial value');
        },

        'dial keyboard major increment changes value and sprite position': function() {
            input.key(33); // up
            Assert.areEqual('13002', output.getContent(), 'Key "pageup" failed to increment value by major value');
            Assert.areEqual('-600px 0px', Y.one('#duck').getStyle('backgroundPosition'), 'Failed to move duck sprite to right spot');
        },

        'dial keyboard left arrow equal minor decrement': function() {
            input.key(37); // left
            Assert.areEqual('13001', output.getContent(), '1 key arrow left failed decrement value by 1 minorStep');
            Assert.areEqual('-300px 0px', Y.one('#duck').getStyle('backgroundPosition'), 'Failed to move duck sprite to right spot');
        },

        'dial keyboard home goes to min value': function() {
            input.key(36); // home
            Assert.areEqual('0', output.getContent(), 'key Home failed set value to min');
            Assert.areEqual('0px 0px', Y.one('#duck').getStyle('backgroundPosition'), 'Failed to move duck sprite to min spot');
        },

        'dial keyboard end goes to max value': function() {
            input.key(35); // end
            Assert.areEqual('26000', output.getContent(), 'key End failed to set dial to min');
            Assert.areEqual('0px 0px', Y.one('#duck').getStyle('backgroundPosition'), 'Failed to move duck sprite to max spot');
        },

        'duck sprite goes to original spot when center button is clicked.': function() {
            Y.one('.yui3-dial .yui3-dial-center-button').simulate("mousedown");
            Assert.areEqual('13000', output.getContent(), 'Failed to move duck sprite to original spot on center button click');
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'dial', 'node-event-simulate' ] });


/*,

*/
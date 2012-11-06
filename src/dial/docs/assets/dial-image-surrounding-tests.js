YUI.add('dial-image-surrounding-tests', function(Y) {

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

    var suite = new Y.Test.Suite('dial-image-surrounding example test suite'),
        Assert = Y.Assert,
        output = Y.one('.yui3-dial .yui3-dial-value-string'),
        input = Y.one('.yui3-dial .yui3-dial-ring');

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'example has 1 initial images': function() {
            var imgs = Y.all('.example img');
            Assert.areEqual(1, imgs.size(), 'Failed to render all images');
        },

        'example dial initial value check': function() {
            Assert.areEqual('0', output.getContent(), 'Failed to initialize dial to correct value');
        },

        'dial keyboard major increment changes value': function() {
            input.key(33); // up
            Assert.areEqual('10', output.getContent(), 'Key "Page up" failed to increment by major value');
        },

        'dial keyboard minor increment': function() {
            input.key(37); // left
            input.key(37); // left
            Assert.areEqual('8', output.getContent(), 'Key "Left" failed to decrement by minor value');
        },

        'dial keyboard home goes to min value': function() {
            input.key(36); // home
            Assert.areEqual('-90', output.getContent(), 'Home key failed to set dial to min');
        },

        'dial keyboard end goes to max value': function() {
            input.key(35); // end
            Assert.areEqual('90', output.getContent(), 'End key failed to set dial to max');
        },

        'dial returns to initial value when center button is clicked.': function() {
            Y.one('.yui3-dial .yui3-dial-center-button').simulate("mousedown");
            Assert.areEqual('0', output.getContent(), 'Failed to move scene to altitude zero on center button click');
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'dial', 'node-event-simulate' ] });


/*,

*/
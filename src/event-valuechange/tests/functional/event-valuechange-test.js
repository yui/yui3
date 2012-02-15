YUI.add('event-valuechange-test', function (Y) {

var Assert = Y.Assert,

    ignoreFocus = Y.UA.ie && Y.UA.ie < 10,
    suite       = new Y.Test.Suite('Y.ValueChange');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Everything',

    _should: {
        ignore: {
            // IE doesn't simulate focus/blur events properly, so these tests
            // fail. Have to rely on manual testing.
            'valuechange should stop polling on blur': ignoreFocus,
            'valuechange should start polling on focus': ignoreFocus,
            'valuechange should not report stale changes that occurred while a node was not focused': ignoreFocus
        }
    },

    setUp: function () {
        this.textArea  = Y.Node.create('<textarea class="vc"></textarea>');
        this.textInput = Y.Node.create('<input class="vc" type="text">');

        Y.one(Y.config.doc.body).append(this.textArea).append(this.textInput);
    },

    tearDown: function () {
        this.textArea.remove().destroy(true);
        this.textInput.remove().destroy(true);

        delete this.textArea;
        delete this.textInput;
    },

    'valuechange event should start polling on mousedown and fire an event when the value changes': function () {
        var fired;

        this.textInput.once('valuechange', function (e) {
            fired = true;

            Assert.areSame('', e.prevVal);
            Assert.areSame('foo', e.newVal);
        });

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.wait(function () {
            Assert.isTrue(fired);
        }, 60);
    },

    'valuechange should support textareas as well': function () {
        var fired;

        this.textArea.once('valuechange', function (e) {
            fired = true;

            Assert.areSame('', e.prevVal);
            Assert.areSame('foo', e.newVal);
        });

        this.textArea.simulate('mousedown');
        this.textArea.set('value', 'foo');

        this.wait(function () {
            Assert.isTrue(fired);
        }, 60);
    },

    'valuechange should start polling on keydown': function () {
        var fired;

        this.textInput.once('valuechange', function (e) {
            fired = true;
        });

        this.textInput.simulate('keydown');
        this.textInput.set('value', 'foo');

        this.wait(function () {
            Assert.isTrue(fired);
        }, 60);
    },

    'valuechange should stop polling on blur': function () {
        var fired;

        this.textInput.on('valuechange', function (e) {
            fired = true;
        });

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.wait(function () {
            Assert.isTrue(fired);
            fired = false;

            this.textInput.simulate('blur');
            this.textInput.set('value', 'bar');

            this.wait(function () {
                Assert.isFalse(fired);
            }, 60);
        }, 60);
    },

    'valuechange should start polling on focus': function () {
        var fired;

        this.textInput.once('valuechange', function (e) {
            fired = true;
        });

        this.textInput.simulate('focus');
        this.textInput.set('value', 'foo');

        this.wait(function () {
            Assert.isTrue(fired);
        }, 60);
    },

    'valuechange should not report stale changes that occurred while a node was not focused': function () {
        var fired = false;

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.textInput.on('valuechange', function (e) {
            fired = true;
        });

        this.textInput.simulate('blur');
        this.textInput.set('value', 'bar');
        this.textInput.simulate('focus');
        this.textInput.simulate('mousedown');

        this.wait(function () {
            Assert.isFalse(fired);
        }, 60);
    },

    'valuechange should start polling on keyup for IME keystrokes': function () {
        var fired = false;

        this.textInput.on('valuechange', function (e) {
            fired = true;
        });

        this.textInput.simulate('keyup', {keyCode: 123}); // should not trigger IME behavior
        this.textInput.set('value', 'foo');

        this.wait(function () {
            Assert.isFalse(fired);

            this.textInput.simulate('blur'); // stop polling
            this.textInput.simulate('keyup', {keyCode: 197});
            this.textInput.set('value', 'bar');

            this.wait(function () {
                Assert.isTrue(fired);

                fired = false;

                this.textInput.simulate('blur');
                this.textInput.simulate('keyup', {keyCode: 229});
                this.textInput.set('value', 'baz');

                this.wait(function () {
                    Assert.isTrue(fired);
                }, 100);
            }, 100);
        }, 100);
    },

    'valuechange should stop polling after timeout': function () {
        var oldTimeout = Y.ValueChange.TIMEOUT,
            fired;

        this.textInput.on('valuechange', function (e) {
            fired = true;
        });

        Y.ValueChange.TIMEOUT = 70;

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.wait(function () {
            Assert.isTrue(fired);
            fired = false;

            this.wait(function () {
                this.textInput.set('value', 'bar');

                this.wait(function () {
                    Assert.isFalse(fired);
                    Y.ValueChange.TIMEOUT = oldTimeout;
                }, 60);
            }, 71);
        }, 60);
    },

    'valueChange should be an alias for valuechange for backcompat': function () {
        var fired;

        this.textInput.on('valueChange', function () {
            fired = true;
        });

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'monkeys');

        this.wait(function () {
            Assert.isTrue(fired, 'valueChange event should have fired');
        }, 60);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires:['event-valuechange', 'node-base', 'node-event-simulate', 'test']});

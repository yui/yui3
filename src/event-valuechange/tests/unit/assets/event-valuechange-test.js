YUI.add('event-valuechange-test', function (Y) {

var Assert = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    suite = new Y.Test.Suite('Event: ValueChange'),

    // Ignoring these tests for now, until we can look into simulating focusin/focusout.
    //
    // event-focus and event-blur rely on focusin/focusout for all IE
    // versions - so simulating focus doesn't invoke the event-focus or
    // event-blur listeners.

    simulateFocusNotSupported = Y.UA.ie,

    setUpInputFieldTests = function() {
        try {
            window.focus();
        } catch(e) {
            // Ignore. Just trying to help with tests
            // which require the window to be focused
            // in IE8. Won't help with FF window focus(),
            // which I believe needs perms. to bring-to-front.
        }

        this.textArea  = Y.Node.create('<textarea></textarea>');
        this.textInput = Y.Node.create('<input type="text">');

        Y.one('#test').append(this.textArea).append(this.textInput);
    },

    tearDownInputFieldTests = function() {

        // Just to avoid any test-to-test bleedthrough.

        // The next time the _poll is called, it'll do the same thing,
        // and return early, but want to avoid that hanging around,
        // and bleeding into the next test.

        Y.ValueChange._stopPolling(this.textArea);
        Y.ValueChange._stopPolling(this.textInput);

        this.textArea.remove().destroy(true);
        this.textInput.remove().destroy(true);
    };

suite.add(new Y.Test.Case({
    name: 'Basic',

    _should: {
        ignore: {
            'valuechange should start polling on focus': simulateFocusNotSupported
        }
    },

    setUp: setUpInputFieldTests,

    tearDown: tearDownInputFieldTests,

    'valuechange event should start polling on mousedown and fire an event when the value changes': function () {
        var test = this;

        this.textInput.once('valuechange', function (e) {
            test.resume(function () {
                Assert.areSame('', e.prevVal, 'prevVal should be ""');
                Assert.areSame('foo', e.newVal, 'newVal should be "foo"');
                Assert.areSame(test.textInput, e.currentTarget, 'currentTarget should be the input node');
                Assert.areSame(test.textInput, e.target, 'target should be the input node');
            });
        });

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.wait();
    },

    'valuechange should support textareas as well': function () {
        var test = this;

        this.textArea.once('valuechange', function (e) {
            test.resume(function () {
                Assert.areSame('', e.prevVal, 'prevVal should be ""');
                Assert.areSame('foo', e.newVal, 'newVal should be "foo"');
                Assert.areSame(test.textArea, e.currentTarget, 'currentTarget should be the textarea node');
                Assert.areSame(test.textArea, e.target, 'target should be the textarea node');
            });
        });

        this.textArea.simulate('mousedown');
        this.textArea.set('value', 'foo');

        this.wait();
    },

    'valuechange should start polling on keydown': function () {
        var test = this;

        this.textInput.once('valuechange', function (e) {
            test.resume(function() {
                Assert.pass();
            });
        });

        this.textInput.simulate('keydown');
        this.textInput.set('value', 'foo');

        this.wait();
    },

    'valuechange should start polling on keyup for IME keystrokes': function () {
        var called = 0,
            test = this;

        this.textInput.on('valuechange', function (e) {

            called++;

            if (called === 1) {
                test.resume(function() {

                    Assert.areEqual("", e.prevVal);
                    Assert.areEqual("bar", e.newVal);

                    this.textInput.simulate('blur');
                    this.textInput.simulate('keyup', {keyCode: 229});
                    this.textInput.set('value', 'baz');

                    this.wait();
                });
            } else if (called === 2) {
                test.resume(function() {
                    Assert.areEqual("bar", e.prevVal);
                    Assert.areEqual("baz", e.newVal);
                });
            } else {
                Assert.fail("Called an unexpected number of times");
            }
        });

        this.textInput.simulate('keyup', {keyCode: 123}); // should not trigger IME behavior
        this.textInput.set('value', 'foo');

        this.textInput.simulate('blur'); // stop polling
        this.textInput.simulate('keyup', {keyCode: 197});
        this.textInput.set('value', 'bar');

        this.wait();
    },

    'valueChange should be an alias for valuechange for backcompat': function () {
        var test = this;

        this.textInput.on('valueChange', function () {
            test.resume();
        });

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'monkeys');

        this.wait();
    },

    'valuechange should start polling on focus': function () {
        var test = this;

        this.textInput.once('valuechange', function (e) {
            test.resume(function() {
                Assert.pass();
            });
        });

        this.textInput.simulate('focus');
        this.textInput.set('value', 'foo');

        this.wait();
    },

    'valuechange should start polling on focus - with focus()': function () {
        var test = this;

        this.textInput.once('valuechange', function (e) {
            test.resume(function() {
                Assert.pass();
            });
        });

        this.textInput.focus();
        this.textInput.set('value', 'foo');

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    // Tests which require arbitrary timeouts, since they depend on the absence of an event

    name: 'Stop Polling',

    _should: {
        ignore: {
            'valuechange should stop polling on blur': simulateFocusNotSupported,
            'valuechange should not report stale changes that occurred while a node was not focused': simulateFocusNotSupported
        }
    },

    setUp: setUpInputFieldTests,

    tearDown: tearDownInputFieldTests,

    // Make sure we're well beyond the polling interval, providing a bit
    // more room on browsers we're having flakiness issues with under CI
    WAIT_FOR_POLL : Y.ValueChange.POLL_INTERVAL + ((Y.UA.ie) ? 500 : 150),

    'valuechange should stop polling on blur': function () {

        var test = this,
            called = 0;

        this.textInput.on('valuechange', function (e) {

            called++;

            test.resume(function() {

                test.textInput.simulate('blur');
                test.textInput.set('value', 'bar');

                test.wait(function () {
                    Y.Assert.areEqual(1, called, "valuechange listener should only have been called once");
                }, test.WAIT_FOR_POLL);

            });
        });

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.wait();
    },

    'valuechange should stop polling on blur - with blur()': function () {
        var test = this,
            called = 0;

        this.textInput.on('valuechange', function (e) {
            called++;

            test.resume(function() {

                test.textInput.blur();
                test.textInput.set('value', 'bar');

                test.wait(function () {
                    Y.Assert.areEqual(1, called, "valuechange listener should only have been called once");
                }, test.WAIT_FOR_POLL);
            });
        });

        this.textInput.focus(); // must focus in order to blur
        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.wait();
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
        }, this.WAIT_FOR_POLL);
    },

    'valuechange should not report stale changes that occurred while a node was not focused - with focus() and blur()': function () {

        var fired = false;

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.textInput.on('valuechange', function (e) {
            fired = true;
        });

        this.textInput.blur();
        this.textInput.set('value', 'bar');
        this.textInput.focus();
        this.textInput.simulate('mousedown');

        this.wait(function () {
            Assert.isFalse(fired);
        }, this.WAIT_FOR_POLL);
    },

    'valuechange should stop polling after timeout': function () {
        var oldTimeout = Y.ValueChange.TIMEOUT,
            test = this,
            called = 0,
            fired;

        this.textInput.on('valuechange', function (e) {

            called++;

            test.resume(function() {

                Y.ValueChange.TIMEOUT = 100;

                // Make sure we're well beyond the timeout interval.
                this.wait(function () {

                    this.textInput.set('value', 'bar');

                    // Make sure we're well beyond the polling interval
                    this.wait(function() {

                        Y.Assert.areEqual(1, called, "valuechange listener should only have been called once");
                        Y.ValueChange.TIMEOUT = oldTimeout;

                    }, test.WAIT_FOR_POLL);

                }, 500);
            });

        });

        this.textInput.simulate('mousedown');
        this.textInput.set('value', 'foo');

        this.wait();
    }
}));

suite.add(new Y.Test.Case({
    name: 'Delegation',

    setUp: function () {
        this.container = Y.one('#test')
            .append('<input type="text" id="vc-delegate-a" class="odd">')
            .append('<input type="text" id="vc-delegate-b" class="even">')
            .append('<input type="text" id="vc-delegate-c" class="odd">')
            .append('<textarea id="vc-delegate-d" class="even"></textarea>')
            .append('<textarea id="vc-delegate-e" class="odd"></textarea>')
            .append('<textarea id="vc-delegate-f" class="even"></textarea>');

        this.a = Y.one('#vc-delegate-a');
        this.b = Y.one('#vc-delegate-b');
        this.c = Y.one('#vc-delegate-c');
        this.d = Y.one('#vc-delegate-d');
        this.e = Y.one('#vc-delegate-e');
        this.f = Y.one('#vc-delegate-f');
    },

    tearDown: function () {
        Y.ValueChange._stopPolling(this.container);
        this.container.purge().empty();
    },

    'delegation should be supported on input nodes': function () {
        var test = this;

        this.container.delegate('valuechange', function (e) {
            test.resume(function () {
                Assert.areSame('', e.prevVal, 'prevVal should be ""');
                Assert.areSame('foo', e.newVal, 'newVal should be "foo"');
                Assert.areSame('input', e.currentTarget.get('nodeName').toLowerCase(), 'currentTarget should be the input node');
                Assert.areSame('input', e.target.get('nodeName').toLowerCase(), 'target should be the input node');
            });
        }, '.odd');

        this.a.simulate('mousedown');
        this.a.set('value', 'foo');

        this.wait();
    },

    'delegation should be supported on textareas': function () {
        var test = this;

        this.container.delegate('valuechange', function (e) {
            test.resume(function () {
                Assert.areSame('', e.prevVal, 'prevVal should be ""');
                Assert.areSame('foo', e.newVal, 'newVal should be "foo"');
                Assert.areSame('textarea', e.currentTarget.get('nodeName').toLowerCase(), 'currentTarget should be the textarea node');
                Assert.areSame('textarea', e.target.get('nodeName').toLowerCase(), 'target should be the textarea node');
            });
        }, '.even');

        this.f.simulate('mousedown');
        this.f.set('value', 'foo');

        this.wait();
    },

    'delegate filters should work properly': function () {
        var test = this;

        this.container.delegate('valuechange', function (e) {
            test.resume(function() {
                Assert.pass();
            });
        }, '.even');

        this.container.delegate('valuechange', function (e) {
            test.resume(function () {
                Assert.fail('.odd handler should not be called');
            });
        }, '.odd');

        this.b.simulate('mousedown');
        this.b.set('value', 'foo');

        this.wait();
    },

    'multiple delegated handlers should be supported': function () {
        var calls = [],
            test  = this;

        this.container.delegate('valuechange', function (e) {
            test.resume(function() {
                calls.push('one');
                test.wait();
            });
        }, '.odd');

        this.container.delegate('valuechange', function (e) {
            test.resume(function () {
                Assert.fail('.even handler should not be called');
            });
        }, '.even');

        this.container.delegate('valuechange', function (e) {
            test.resume(function() {
                calls.push('two');
                test.wait();
            });
        }, '.odd, .even');

        this.container.delegate('valuechange', function (e) {
            test.resume(function() {
                calls.push('three');

                ArrayAssert.itemsAreSame(['one', 'two', 'three'], calls, 'delegated handlers should all be called in the correct order');
            });
        }, 'input');

        this.c.simulate('mousedown');
        this.c.set('value', 'foo');

        test.wait();
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {requires:['event-valuechange', 'node-base', 'node-event-simulate', 'test']});

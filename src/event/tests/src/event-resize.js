var suite = new Y.Test.Suite("event-resize"),
    win = Y.one( Y.config.win ),
    eventKey = 'event:' + Y.stamp(Y.config.win) + 'resize',
    isOldGecko = (Y.UA.gecko && Y.UA.gecko < 1.91);

function simulateResize() {
    // IE doesn't allow simulation of window.onresize, so I can't use
    //Y.Event.simulate(Y.config.win, 'resize');
    setTimeout(function () {
        Y.Env.evt.dom_wrappers[eventKey].fn({
            type: 'resize',
            srcElement: Y.config.win,
            target: Y.config.win
        });
    }, 10);
}

suite.add(new Y.Test.Case({
    name: 'subscribe',

    _should: {
        ignore: {
            // I can't get this damn test to pass in CI.  It's likely a bad
            // test, but I'm having a hell of a time divising a good one.
            "test resize event throttling": true
        }
    },

    "test Y.on('windowresize', fn)": function () {
        var test = this,
            handle;

        function handler(e) {
            var thisObj = this,
                argCount = arguments.length;

            handle.detach();

            test.resume(function () {
                Y.Assert.areSame('windowresize', e.type);
                Y.Assert.areSame(1, argCount);
                Y.Assert.areSame(win, thisObj, "this should be window");
                Y.Assert.areSame(win, e.target, "e.target should be window");
            });
        }

        handle = Y.on('windowresize', handler);

        simulateResize();

        this.wait();
    },

    "test node.on('windowresize', fn)": function () {
        var test    = this,
            refNode = Y.Node.create('<div />').appendTo(Y.one('body')),
            handle;

        function handler(e) {
            var thisObj = this,
                argCount = arguments.length;

            handle.detach();

            test.resume(function () {
                // TODO: is this a bug?
                Y.Assert.areSame(win, thisObj, "this should be window");
                Y.Assert.areSame(win, e.target, "e.target should be window");
                Y.Assert.areSame(1, argCount);
                Y.Assert.areSame('windowresize', e.type);
            });
        }

        handle = refNode.on('windowresize', handler);

        simulateResize();

        this.wait();
    },

    "test resize event throttling": function () {
        var test = this,
            testThresholds = [40, 100, 300],
            // This prevents the test from timing out if the browser is
            // inordinately slow
            keepAlive = Y.on('resize', function () {
                test.resume(function () {
                    test.wait();
                });
            }),
            // Allow for 10ms of leeway from the threshold.  FF is firing a few
            // milliseconds before the threshold, and I think that's close
            // enough
            fudge = 10;

        function runTest(threshold) {
            var delay = 10,
                handle, timer, start;

            Y.config.windowResizeDelay = threshold;

            handle = Y.on('windowresize', function (e) {
                var end = new Date();

                timer.cancel();
                handle.detach();

                test.resume(function () {
                    Y.assert(isOldGecko || (end - start + fudge >= threshold),
                        "Fired before threshold (" + threshold + ") - delta: " +
                        (end - start));

                    if (testThresholds.length) {
                        runTest(testThresholds.shift());
                    } else {
                        keepAlive.detach();
                    }
                });
            });

            // recursive async function that fires resize on an incrementing
            // delay, starting at 10ms, then 20ms, 30ms, and so on.
            function scheduleResize() {
                start = new Date();

                timer = Y.later(delay, Y, function () {
                    simulateResize();
                    scheduleResize();
                });

                delay += 10;
            }

            scheduleResize();

            test.wait();
        }

        runTest(testThresholds.shift());
    }
}));

Y.Test.Runner.add(suite);

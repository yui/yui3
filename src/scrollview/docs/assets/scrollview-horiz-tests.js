YUI.add('scrollview-horiz-tests', function(Y) {

    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 5000,
        suite = new Y.Test.Suite('scrollview-horiz test suite');

    suite.add(new Y.Test.Case({

        name : 'ScrollView Horiz Example Tests',

        setUp : function () {
            this.container = Y.one('#scrollview');
            this.content = Y.one('#scrollview-content');
        },

        tearDown : function () { },

        "Move right on X should move the content right": function () {

            var Test = this,
                distance = 1000;

            Y.later(3000, this, function () {
                Test.resume(function () {
                    var transform = getTransform(this.content);

                    if (Math.abs(transform.x) >= 50) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail();
                    }
                    Y.Assert.areEqual(0, transform.y);
                });
            });

            this.container.simulateGesture('move', {
                path: {
                    xdist: -(distance)
                },
                duration: SLOW_DURATION
            });

            Test.wait(WAIT);
        },

        "Move left on X should snap back": function () {

            var Test = this,
                distance = 6000;

            Y.later(3000, this, function () {
                var transform = getTransform(this.content);
                Test.resume(function () {
                    Y.Assert.areEqual(0, transform.x);
                    Y.Assert.areEqual(0, transform.y);
                });
            });

            this.container.simulateGesture('move', {
                path: {
                    xdist: distance
                },
                duration: SLOW_DURATION
            });

            Test.wait(WAIT);
        },

        "Flick x should provide the correct reaction": function () {

            var Test = this,
                distance = 5000;

            Y.later(3000, this, function () {
                Test.resume(function () {
                    var transform = getTransform(this.content);
                    if (Math.abs(transform.x) >= 50) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail();
                    }
                    Y.Assert.areEqual(0, transform.y);
                });
            });

            this.container.simulateGesture('flick', {
                distance: -15000,
                axis: 'x',
                duration: SLOW_DURATION
            });
            Test.wait(WAIT);
        },

        "Move gesture while flicking should stop flick": function () {
            var Test = this,
                stop1, stop2, transform;

            // flick example from the center of the node, move 50 pixels down for 50ms)
            this.container.simulateGesture('flick', {
                axis: 'x',
                distance: 200
            });

            Y.later(200, this, function () {
                transform = getTransform(this.content);
                stop1 = transform.x;
                this.container.simulateGesture('move', {
                    path: {
                        xdist: 100
                    },
                    duration: SLOW_DURATION
                }, function () {
                    Test.resume(function () {
                        transform = getTransform(this.content);
                        stop2 = transform.x;

                        // 50 is a generous threshold to limit false-positives. It's typically <10, ideally 0.
                        if (Math.abs(stop1 - stop2) < 50) {
                            Y.Assert.pass();
                        }
                        else {
                            Y.Assert.fail("Stop offset differences were too large");
                        }
                    });
                });
            });

            Test.wait(WAIT);
        }
    }));

    function getTransform(node) {
        var transform = {x: null, y: null},
            matrix;

        if (Y.Transition.useNative) {
            matrix = node.getStyle('transform').replace('matrix(', '').replace(')', '').split(',');
            transform.x = matrix[4].trim();
            transform.y = matrix[5].trim();
        }
        else {
            transform.x = node.getStyle('left').replace('px', '');
            transform.y = node.getStyle('top').replace('px', '');
        }

        return transform;
    }

    Y.Test.Runner.add(suite);

}, '', {requires:['event-touch', 'node', 'node-event-simulate', 'transition']});

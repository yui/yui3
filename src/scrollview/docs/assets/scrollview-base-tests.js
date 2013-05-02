YUI.add('scrollview-base-tests', function(Y) {
    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 5000,
        suite = new Y.Test.Suite('scrollview-base functional test suite');

    suite.add(new Y.Test.Case({
        name: "Movement",

        setUp : function () {
            this.container = Y.one('#scrollview');
            this.content = Y.one('#scrollview-content');
        },
        tearDown : function () {
            // this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Move down on Y should move the content at least that distance": function () {

            var Test = this,
                distance = 500;

            Y.later(2000, this, function () {
                Test.resume(function () {
                    var transform = getTransform(this.content);

                    // distance*0.9 to give it a little wiggle room
                    if (Math.abs(transform.y) >= (distance*0.9)) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail("Y offset not large enough");
                    }
                });
            });

            this.container.simulateGesture('move', {
                path: {
                    ydist: -(distance)
                },
                duration: SLOW_DURATION
            });

            Test.wait(WAIT);
        },

        "Move up on Y should bounce back": function () {

            var Test = this,
                distance = 1000;

            Y.later(3000, this, function () {
                var transform = getTransform(this.content);
                Test.resume(function () {
                    Y.Assert.areEqual(0, transform.y);
                });
            });

            this.container.simulateGesture('move', {
                path: {
                    ydist: distance
                },
                duration: SLOW_DURATION
            });

            Test.wait(WAIT);
        }

        /*
            Not possible until mousewheel simulation is available in the library

        "mousewheel down should move the SV down": function () {
            var Test = this,
                scrollview = Y.myScrollview;

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(10, scrollview.get('scrollY'));
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });

            Y.later(100, null, function () {
                simulateMousewheel(Y.one("#container li"), true);
            });

            Test.wait(WAIT);
        }

        */
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

}, '' ,{requires:['event-touch', 'node', 'node-event-simulate', 'transition']});

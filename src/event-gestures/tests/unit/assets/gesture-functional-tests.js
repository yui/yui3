YUI.add('gesture-functional-tests', function(Y) {
    
    var suite = new Y.Test.Suite('gesture functional test suite'),
        SWIPE_DURATION = 0,
        SWIPE_WAIT_DURATION = 100,
        box = Y.one('#box'),
        Assert = Y.Assert;


    suite.add(new Y.Test.Case({

        name : 'Gestures Functional Tests',

        simulateSwipeRight : function(node, distance, duration, cb) {
            var test = this;

            node.simulateGesture("move", {
                path : {
                    xdist: distance
                },
                duration: duration
            }, function() {
                test.resume(cb);
            });

            test.wait();
        },

        simulateFlickX: function(node, distance, duration, cb) {
            var test = this;

            node.simulateGesture("flick", {
                path : {
                    xdist: distance
                },
                duration: duration
            }, function() {
                test.resume(cb);
            });

            test.wait();
        },

        simulateSwipeLeft : function(node, distance, duration, cb) {
            var test = this;
            
            node.simulateGesture("move", {
                path : {
                    xdist: -distance
                },
                duration: duration
            }, function() {
                test.resume(cb);
            });

            test.wait();
        },

        simulateTap : function(node, cb) {
            var test = this;
            
            node.simulateGesture("tap", function() {
                test.resume(cb);
            });

            test.wait();
        },

        setUp: function () {

        },

        tearDown: function () {
            box.setStyle('background', 'red');
        },

        'test: flick': function () {
            var fired = false,
                test = this;
            box.on('flick', function () {
                fired = true;
                box.setStyle('background', 'blue');
            });
            
            test.simulateFlickX(box, 250, SWIPE_DURATION, function () {
                Assert.isTrue(fired);
            });
        },

        'test: move': function () {
            var fired = false,
                test = this;

            box.on('gesturemovestart', function () {
                box.set('text', 'On GestureMoveStart');
                box.setStyle('background', 'yellow');
            });

            box.on('gesturemove', function () {
                box.set('text', 'On GestureMove');
                box.setStyle('background', 'orange');
            });


            box.on('gesturemoveend', function () {
                fired = true;
                box.setStyle('background', 'green');
            });
            
            test.simulateSwipeLeft(box, 250, SWIPE_DURATION, function () {
                Assert.isTrue(fired);
            });
        },

        'test: move delegate': function () {
            var fired = false,
                test = this,
                body = Y.one('body');

            body.delegate('gesturemovestart', function () {
                box.set('text', 'On GestureMoveStart');
                box.setStyle('background', 'yellow');
            }, '#box');

            body.delegate('gesturemove', function () {
                box.set('text', 'On GestureMove');
                box.setStyle('background', 'orange');
            }, '#box');


            body.delegate('gesturemoveend', function () {
                fired = true;
                box.set('text', 'On GestureMoveEnd');
                box.setStyle('background', 'green');
            }, '#box');
            
            test.simulateSwipeLeft(box, 250, SWIPE_DURATION, function () {
                Assert.isTrue(fired);
            });

        },

        'test: move detach': function () {
            var fired = false,
                test = this;

            box.on('gesturemovestart', function () {
                box.set('text', 'On GestureMoveStart');
                box.setStyle('background', 'yellow');
            });

            box.on('gesturemove', function () {
                box.set('text', 'On GestureMove');
                box.setStyle('background', 'orange');
            }, '#box');


            box.on('gesturemoveend', function () {
                fired = true;
                box.set('text', 'On GestureMoveEnd');
                box.setStyle('background', 'green');
            });

            box.detach();
            
            test.simulateSwipeLeft(box, 250, SWIPE_DURATION, function () {
                Assert.isFalse(fired);
            });

        },

        _should: {
            /* 
                TODO: Gesture simulate issue in IE10 (scrollview has the same issue, need to debug.) Unit tests work.

                TODO: Is there a good way to simulate functional tests in PhantomJS?
            */
            ignore: {
                'test: flick'         : (Y.UA.ie === 10 || Y.UA.phantomjs),
                'test: move'          : (Y.UA.ie === 10 || Y.UA.phantomjs),
                'test: move detach'   : (Y.UA.ie === 10 || Y.UA.phantomjs),
                'test: move delegate' : (Y.UA.ie === 10 || Y.UA.phantomjs)
            }
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:['event-move', 'event-flick', 'test', 'node', 'node-event-simulate']});

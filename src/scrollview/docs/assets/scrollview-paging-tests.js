YUI.add('scrollview-paging-tests', function(Y) {

    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 5000,
        suite = new Y.Test.Suite('scrollview-paging test suite');

    suite.add(new Y.Test.Case({

        name : 'ScrollView Paging Example Tests',

        setUp : function () {
            this.li = Y.one('#scrollview-content li');
            this.container = Y.one('#scrollview');
            this.content = Y.one('#scrollview-content');
        },

        tearDown : function () { },

        'Clicking next should advance the page' : function () {
            var Test = this,
                container = this.container,
                content = this.content,
                expected = -328;

            Y.one('#scrollview-next').simulate('click');

            Y.later(1000, this, function () {
                Test.resume(function () {
                    var transform = getTransform(content);

                    if (transform.x == expected) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail("X offset should be " + expected + ", but got " + transform.x);
                    }
                });
            }, 3000);

            Test.wait();
        },

        'Clicking prev should advance the page' : function () {
            var Test = this,
                container = this.container,
                content = this.content,
                expected = 0;

            Y.one('#scrollview-prev').simulate('click');

            Y.later(1000, this, function () {
                Test.resume(function () {
                    var transform = getTransform(content);

                    if (transform.x == expected) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail("X offset should be " + expected + ", but got " + transform.x);
                    }
                });
            }, 3000);

            Test.wait();
        }

        /* This should be possible to test, but simulating a flick doesn't scroll the widget. Issue in gestureSimulate or paginator-plugin? */
        /*'Flick should snap scrollview to page #2' : function () {
            var Test = this,
                container = this.container,
                content = this.content,
                expected = -656;

            container.simulateGesture('flick', {
                distance: -1000,
                axis: 'x'
            });

            Test.wait(function () {
                var transform = getTransform(content);

                if (transform.x == expected) {
                    Y.Assert.pass();
                }
                else {
                    Y.Assert.fail();
                }
            }, 3000);
        }*/
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

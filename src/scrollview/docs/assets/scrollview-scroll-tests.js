YUI.add('scrollview-scroll-tests', function(Y) {

    var suite = new Y.Test.Suite('scrollview test suite');

    suite.add(new Y.Test.Case({

        name : 'ScrollView Example Tests',

        'Flick on <a> should offset scrollview to the bottom and suppress click' : function () {
            var Test = this;

            Y.one('#scrollview-content li a').simulateGesture('flick', {
                distance: -1500,
                axis: 'y'
            });

            Test.wait(function () {
                var transform = getTransform(Y.one('#scrollview-content'));

                if (transform.y < -1000) {
                    Y.Assert.pass();
                }
                else {
                    Y.Assert.fail("Expected Y offset to be < -1000. Instead got " + transform.y);
                }
            }, 3000);
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

}, '', {requires:['transition', 'node-event-simulate']});

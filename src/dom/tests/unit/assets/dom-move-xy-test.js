YUI.add('dom-move-xy-test', function(Y) {
    Y.DOM._testXY = function() {
        var Assert = Y.Assert,
            ArrayAssert = Y.ArrayAssert,

            tests = {name: 'Y.DOM.xy'},
            sel = '.node',
            nodes = Y.Selector.query(sel);

        function testXY(expected, actual) {
            var x = actual[0],
                pass = false;

            // Expected is in pixels from offsetTop/Left, actual may be subpixels.
            // Browsers don't agree on which way to round, so its
            // considered a match if rounding up or down yields a match.
            if ((Math.floor(actual[0]) === expected[0] || Math.ceil(actual[0]) === expected[0]) &&
                (Math.floor(actual[1]) === expected[1] || Math.ceil(actual[1]) === expected[1])) {
                pass = true;
            }

            return pass;
        }

        Y.each(nodes, function(n) {
            var xy = [0, 0],
                actual,
                id = n.id;

            Y.DOM.setXY(n, xy, true);

            actual = Y.DOM.getXY(n);

            tests['should move ' + id + ' to page coords'] = function() {
                Assert.isTrue(testXY(xy, actual));
                Assert.isTrue(testXY(xy, actual));
            };
        });

        Y.Test.Runner.add(new Y.Test.Case(tests));
    };
}, '@VERSION@' ,{requires:['dom-screen', 'test']});

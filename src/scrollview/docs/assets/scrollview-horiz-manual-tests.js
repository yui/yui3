YUI.add('scrollview-horiz-manual-tests', function(Y) {
    
    var suite = new Y.Test.Suite('scrollview-horiz manual test suite');

    suite.add(new Y.Test.Case({

        name : 'Manual Tests',

        'More complex swipe gestures should behave correctly' : function () {
        	Y.Assert.fail();
        }

    }));

    Y.Test.Runner.add(suite);

});
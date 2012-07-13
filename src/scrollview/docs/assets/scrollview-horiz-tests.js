YUI.add('scrollview-horiz-tests', function(Y) {
    
    var suite = new Y.Test.Suite('scrollview-horiz test suite');

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'test should pass' : function () {
        	Y.Assert.pass();
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:[]});
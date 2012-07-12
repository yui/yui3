YUI.add('scrollview-paging-tests', function(Y) {
    
    var suite = new Y.Test.Suite('scrollview-paging test suite');

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'test should pass' : function () {
        	Y.Assert.pass();
        }

    }));

    Y.Test.Runner.add(suite);

}, '', {requires:[]});
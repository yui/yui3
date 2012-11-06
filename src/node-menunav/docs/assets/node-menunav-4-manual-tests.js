var moduleName = 'node-menunav-4';
YUI.add(moduleName+'-manual-tests', function(Y) {
    
    var suite = new Y.Test.Suite(moduleName+' test suite');

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'this test should eventually do something' : function () {
            Y.Assert.fail();
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {requires:[]});

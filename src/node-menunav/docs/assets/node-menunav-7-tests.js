var moduleName = 'node-menunav-7';
YUI.add(moduleName+'-tests', function(Y) {
    
    var suite = new Y.Test.Suite(moduleName+' test suite');

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        'this test should eventually do something' : function () {
            Y.Assert.pass();
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {requires:[]});

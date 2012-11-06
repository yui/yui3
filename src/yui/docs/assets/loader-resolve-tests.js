YUI.add('loader-resolve-tests', function(Y) {

    var suite = new Y.Test.Suite('loader-resolve example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'no dynamic content to test': function() {
            Y.Assert.isTrue(true, 'this should never fail');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' ] });

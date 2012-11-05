YUI.add('yui-ua-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-ua example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check example output': function() {
            var html = Y.one('#demo').get('innerHTML');
            Assert.isTrue((html.indexOf(navigator.userAgent) > -1), 'Failed to render example');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' ] });

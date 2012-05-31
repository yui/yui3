YUI.add('yui-loader-ext-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-loader-ext example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'external module loaded': function() {
            var test = this;
            
            test.wait(function() {
                var node = Y.one('#marker');
                Assert.areEqual(node.get('innerHTML'), 'External Module was loaded.', 'Failed to load external module');
            }, 3000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' ] });

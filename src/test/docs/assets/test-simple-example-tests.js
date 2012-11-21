YUI.add('test-simple-example-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('test-simple-example');

    suite.add(new Y.Test.Case({
        name: 'test-simple-example',
        'test console rendered': function() {
            var el = Y.one('#testLogger');

            Assert.isNotNull(el.one('.yui3-testconsole'), 'Console wrapper failed to load');
        },
        'console has entries': function() {
            var entries = Y.all('#testLogger .yui3-console-entry');

            Assert.isTrue((entries.size() >= 3), 'Should be at least 3 entries in the console');
        }
    }));

    Y.Test.Runner.add(suite);

});

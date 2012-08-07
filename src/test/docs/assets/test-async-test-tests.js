YUI.add('test-async-test-tests', function(Y) {

    
    setTimeout(function() {

        var Assert = Y.Assert,
            suite = new Y.Test.Suite('test-async-test');

        suite.add(new Y.Test.Case({
            name: 'test-async-test',
            'test console rendered': function() {
                var el = Y.one('#testLogger');

                Assert.isNotNull(el.one('.yui3-testconsole'), 'Console wrapper failed to load');
            },
            'console has entries': function() {
                var entries = Y.all('#testLogger .yui3-console-entry');
                Assert.isTrue((entries.size() > 0), 'Should be at least 1 entry in the console');
            },
            'did async test pass': function() {
                var item = Y.one('#testLogger .yui3-testconsole-entry-pass .yui3-console-entry-content');
                Assert.areEqual(item.get('innerHTML'), 'testWait: passed.', 'Failed to pass testWait test');
            }
        }));

        Y.Test.Runner.add(suite);
        Y.Test.Runner.run();

    }, 9000);

});

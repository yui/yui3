YUI.add('test-array-tests-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('test-array-tests');

    suite.add(new Y.Test.Case({
        name: 'test-array-tests',
        'test console rendered': function() {
            var el = Y.one('#testLogger');

            Assert.isNotNull(el.one('.yui3-testconsole'), 'Console wrapper failed to load');
        },
        'console has passed entries': function() {
            var entries = Y.all('#testLogger .yui3-testconsole-entry-pass'); //Looking for passed

            Assert.isTrue((entries.size() > 5), 'Should be at least 5 entries in the console');
        },
        'console has no failed entries': function() {
            var entries = Y.all('#testLogger .yui3-testconsole-entry-fail'); //Looking for failed

            Assert.areEqual(0, (entries.size()), 'Should be 0 failed entries in the console');
        }
    }));

    Y.Test.Runner.add(suite);

});

YUI.add('test-advanced-test-options-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('test-advanced-test-options');



    suite.add(new Y.Test.Case({
        name: 'test-advanced-test-options',
        'test console rendered': function() {
            var el = Y.one('#testLogger');

            Assert.isNotNull(el.one('.yui3-testconsole'), 'Console wrapper failed to load');
        },
        'console has entries': function() {
            var entries = Y.all('#testLogger .yui3-console-entry');

            Assert.isTrue((entries.size() > 0), 'Should be at least 1 entries in the console');
        },
        'console has a failed test result': function() {
            var f = Y.one('#testLogger .yui3-testconsole-entry-fail');
            Assert.isNotNull(f);
        },
        'Failed result reports correctly': function() {
            var f = Y.one('#testLogger .yui3-testconsole-entry-fail');
            Assert.isTrue((f.get('innerHTML').indexOf('m a specific error message, but a wrong on') > -1));
        }
    }));


    Y.Test.Runner.add(suite);

    var tcase = Y.Test.Runner.masterSuite.items[0];

    //delete tcase._should.error.testStringError2;
    tcase._should.fail.testObjectError2 = true;
    tcase._should.fail.testObjectError3 = true;

    var fix = function() {
        Assert.isTrue(false, 'faked');
    };

    delete tcase.testStringError2;
    tcase.testObjectError2 = fix;
    tcase.testObjectError3 = fix;
});

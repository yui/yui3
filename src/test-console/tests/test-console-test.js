/*
Warnings! These tests aren't actually all expected to pass, and this test suite
should *not* be added to the CI tests. These tests are used to manually exercise
the TestConsole widget.
*/

YUI.add('test-console-test', function (Y) {

var Assert = Y.Assert,
    suite;

suite = new Y.Test.Suite('Test Console');

suite.add(new Y.Test.Case({
    name: 'General',

    'this test should fail': function () {
        Assert.areSame('foo bar baz', 'moo mar maz');
    },

    'this test should fail with an unexpected error': function () {
        throw new Error('OMG!');
    },

    'this test should pass': function () {
        Assert.areEqual(true, true);
    },

    'this test should also pass': function () {
        Assert.areEqual('monkeys', 'monkeys');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['test-console']
});

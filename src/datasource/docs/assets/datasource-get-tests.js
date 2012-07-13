YUI.add('datasource-get-tests', function(Y) {

    var suite = new Y.Test.Suite('datasource-get example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'test json': function() {
            Y.one('.example #demo_json').simulate('click');
            var interval = 10,
                timeout = 10000,
                output = Y.one('.example #demo_output_json'),
                condition = function() {
                    // Return a truthy/falsey result.
                    return (output.getHTML().indexOf('results') > -1);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                var outputStr = output.getHTML();
                Assert.isTrue((outputStr.indexOf('  "results": [') > -1), ' - Failed to find expected output... "results": [');
                Assert.isTrue((outputStr.indexOf('"name":') > -1), ' - Failed to find expected output... "name":');
                Assert.isTrue((outputStr.indexOf('"meta": {') > -1), ' - Failed to find expected output... "meta": {');
            },
            failure = function() {
                Y.Assert.fail("Never succeeded in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);

        },







}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

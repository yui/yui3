YUI.add('datasource-caching-tests', function(Y) {

    var suite = new Y.Test.Suite('datasource-caching example test suite'),
        Assert = Y.Assert;

    var clickFormSubmit = function(form) {

        // In non-IE browsers, clicking the submit will peform the default action,
        // of submitting the form. In IE, we need to do both
        form.one("input[type=submit]").simulate("click");

        if (Y.UA.ie && Y.UA.ie < 9) {
            form.simulate("submit");
        }
    }

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'test retrieve data with caching': function() {
            Y.one('.example #demo_input_query').set('value', 'davglass');
            clickFormSubmit(Y.one('#demo'));
            var interval = 10,
                timeout = 10000,
                output = Y.one('.example #demo_output_response'),
                condition = function() {
                    // Return a truthy/falsey result.
                    return (output.getHTML().indexOf('Retrieved from') > -1);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                var outputStr = output.getHTML();
//                alert(outputStr);
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
        'test clearing cache': function() {
            Y.one('#demo_cache_clear').simulate('click');
            Assert.isTrue((Y.one('.example #demo_output_response').getHTML().indexOf('Cache cleared.') > -1), ' - Failed to clear cache');

        }

}));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

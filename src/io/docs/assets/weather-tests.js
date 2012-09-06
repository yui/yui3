YUI.add('weather-tests', function(Y) {

    var suite = new Y.Test.Suite('weather example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test Get Weather RSS': function() {
            Y.one('#getWeather').simulate('click');
            var interval = 10,
                timeout = 60000,
                output = Y.one('.example #weatherModule'),
                condition = function() {
                    // Return a truthy/falsey result.
                    return (output.getHTML().indexOf('Current Conditions') > -1);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                var outputStr = output.getHTML();
                Assert.isTrue((outputStr.indexOf('Yahoo! Weather for Sunnyvale, CA') > -1), ' - Failed to find "Yahoo! Weather for Sunnyvale, CA"');
                Assert.areEqual(1, Y.one('.example #weatherModule').all('img').size(), ' - Failed to find weather icon image')
                Assert.isTrue((outputStr.indexOf('Full Forecast at Yahoo! Weather') > -1), ' - Failed to find "Full Forecast at Yahoo! Weather"');
            },
            failure = function() {
                Y.Assert.fail("Never succeeded in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);

        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

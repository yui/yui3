YUI.add('xdr-tests', function(Y) {

    var suite = new Y.Test.Suite('io xdr example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test Load RSS news feed from Yahoo! Pipes': function() {
            Y.one('#pipes').simulate('click');
            var interval = 10,
                timeout = 10000,
                output = Y.one('.example #output ul'),
                condition = function() {
                    // Return a truthy/falsey result.
                    return (output.all('li').size() > 1);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                Y.Assert.isTrue((output.getHTML().indexOf('http://us.rd.yahoo.com/sports/rss/sc/SIG') > -1), ' - Failed to find common part of URL "http://us.rd.yahoo.com/sports/rss/sc/SIG"');
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

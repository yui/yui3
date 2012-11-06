YUI.add('ac-jsonp-tests', function(Y) {

    var suite = new Y.Test.Suite('ac-jsonp example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test is rendered' : function() {
            Assert.isNotNull(Y.one('#demo'));
            Assert.isNotNull(Y.one('.example #demo #ac-input'));
            Assert.isNotNull(Y.one('.example #demo .yui3-aclist-list'));
        },

        'test type "css" into ac list' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                list = Y.one('.example #demo .yui3-aclist-list'),
                inputStr = "css";
            input.focus();
            input.set('value', inputStr);

            var interval = 10,
                timeout = 10000,
                condition = function() {
                    // Return a truthy/falsey result.
                    return (list.all('li').size() > 0);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                Assert.isTrue((list.all('li').size() > 0), ' - Failed to find more than 0 results for ' + inputStr);
            },
            failure = function() {
                Y.Assert.fail("#waitForMe never showed up in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);
        }

    }))

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

YUI.add('ac-local-tests', function(Y) {

    var suite = new Y.Test.Suite('ac-local example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test is rendered' : function() {
            Assert.isNotNull(Y.one('#demo'));
            Assert.isNotNull(Y.one('.example #demo #ac-input'));
            Assert.isNotNull(Y.one('.example #demo .yui3-aclist-list'));
        },

        'test type "ca" into ac list' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                list = Y.one('.example #demo .yui3-aclist-list'),
                inputStr = "ca";
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
                Assert.areEqual(3, list.all('li').size(), 'failed to filter of ' + inputStr + ' with 3 results');
                Assert.areEqual(inputStr.toLowerCase(), list.one('.yui3-highlight').getHTML().toLowerCase(), 'failed to hightlight ' + inputStr + ' on first result');
            },
            failure = function() {
                Y.Assert.fail("#waitForMe never showed up in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);
        },
        'test type selecting 3rd item from ac list' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                list = Y.one('.example #demo .yui3-aclist-list'),
                interval = 10,
                timeout = 10000;

                var listItems = list.all('li');

                listItems.item(2).simulate('click');
                Assert.areEqual('South Carolina', input.get('value'), ' - Failed to put selected item text in input')

        }

    }))

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

YUI.add('ac-datasource-tests', function(Y) {

    var suite = new Y.Test.Suite('ac-datasource example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test is rendered' : function() {
            Assert.isNotNull(Y.one('#demo'));
            Assert.isNotNull(Y.one('.example #demo #ac-input'));
            Assert.isNotNull(Y.one('.example #demo .yui3-aclist-list'));
        },

        'test type "flanders" into ac list' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                list = Y.one('.example #demo .yui3-aclist-list'),
                inputStr = "flanders";
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
                Assert.isTrue(list.all('li').size() > 0, ' - Failed to find more than 0 results for ' + inputStr);
                Assert.areEqual(inputStr.toLowerCase(), list.one('.yui3-highlight').getHTML().toLowerCase(), 'failed to hightlight ' + inputStr + ' on first result');
            },
            failure = function() {
                Y.Assert.fail("#waitForMe never showed up in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);
        },
        'test type selecting 5th item from ac list' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                list = Y.one('.example #demo .yui3-aclist-list'),
                interval = 10,
                timeout = 10000;

                var listItems = list.all('li');

                listItems.item(4).simulate('click');
                Assert.areEqual('Flanders, Louisiana, United States', input.get('value'), ' - Failed to find selected item text in input')

        }

    }))

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

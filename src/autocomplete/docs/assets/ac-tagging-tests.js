YUI.add('ac-tagging-tests', function(Y) {

    var suite = new Y.Test.Suite('ac-tagging example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test is rendered' : function() {
            Assert.isNotNull(Y.one('#demo'));
            Assert.isNotNull(Y.one('.example #demo #ac-input'));
            Assert.isNotNull(Y.one('.example #demo .yui3-aclist-list'));
        },

        'test type "ja" into ac list' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                list = Y.one('.example #demo .yui3-aclist-list'),
                inputStr = "ja";
            input.focus();
            input.set('value', inputStr);

            var interval = 10,
                timeout = 10000,
                condition = function() {
                    // Return a truthy/falsey result.
                    return (list.one('li').getHTML().indexOf('yui3-highlight') > -1);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                Assert.isTrue((list.all('li').size() === 2), ' - Failed to find 2 results for ' + inputStr);
                Assert.areEqual(inputStr.toLowerCase(), list.one('.yui3-highlight').getHTML().toLowerCase(), 'failed to hightlight ' + inputStr + ' on first result');
            },
            failure = function() {
                Y.Assert.fail("#waitForMe never showed up in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);
        },
        'test type selecting 1st item from ac list' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                list = Y.one('.example #demo .yui3-aclist-list'),
                interval = 10,
                timeout = 10000;
                condition = function() {
                    // Return a truthy/falsey result.
                    return (list.one('li') !== null);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                var listItems = list.all('li');

                listItems.item(1).simulate('click');
                Assert.areEqual('javascript, ', input.get('value'), ' - Failed to find selected item text in input')
            },
            failure = function() {
                Y.Assert.fail("#waitForMe never showed up in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);
        },

        'test type appending "ht" onto "javascript, " into ac list' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                list = Y.one('.example #demo .yui3-aclist-list'),
                inputStr = "javascript, ht";
            input.focus();
            input.set('value', inputStr);

            var interval = 10,
                timeout = 10000,
                condition = function() {
                    // Return a truthy/falsey result.
                    return (list.one('li').getHTML().indexOf('yui3-highlight') > -1);
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                var listItems = list.all('li');
                listItems.item(0).simulate('click');
                Assert.areEqual('javascript, html, ', input.get('value'), ' - Failed to find selected item text in input')
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

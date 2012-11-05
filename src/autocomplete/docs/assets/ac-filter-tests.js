YUI.add('ac-filter-tests', function(Y) {

    var suite = new Y.Test.Suite('ac-filter example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test is rendered' : function() {
            Assert.isNotNull(Y.one('#demo'));
        },
        'test type "ap" into ac input' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                photos = Y.one('.example #demo #photos'),
                inputStr = "ap";
            input.focus();
            input.set('value', inputStr);

            var interval = 200,
                timeout = 10000,
                condition = function() {
                    // Return a truthy/falsey result.
                    return (photos.all('.hidden').size() === 8);   // 11 total pies, 8 hidden, 3 showing
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                Assert.areEqual(8, photos.all('.hidden').size(), ' - Failed to find exactly 8 filtered (hidden) photos');
            },
            failure = function() {
                Y.Assert.fail("#waitForMe never showed up in " + timeout + "ms");
            };

            // failure is optional. Will default to "wait() without resume()" error
            this.poll(condition, interval, timeout, success, failure);
        },
        'test type "apple" into ac input' : function() {
            var input =  Y.one('.example #demo #ac-input'),
                photos = Y.one('.example #demo #photos'),
                inputStr = "apple";
            input.focus();
            input.set('value', inputStr);

            var interval = 10,
                timeout = 10000,
                condition = function() {
                    // Return a truthy/falsey result.
                    return (photos.all('.hidden').size() === 9);   // 11 total pies, 9 hidden, 2 showing
                    // For example:
                    // return Y.one("#waitForMe") !== null
                },
            success = function() {
                Assert.areEqual(9, photos.all('.hidden').size(), ' - Failed to find exactly 9 filtered (hidden) photos');
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

YUI.add('normalize-basic-tests', function(Y) {

    var suite = new Y.Test.Suite('normalize-basic test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check cursor pointer': function() {
            var propertyStr = 'cursor',
                val = 'pointer',
                selector = 'input[type="button"]',
                property = Y.one(selector).getComputedStyle(propertyStr);
            property = property.replace(/\s/g, ""); //remove spaces from string
            Assert.areEqual(val, property, ' - Failed to set ' + selector + ' to ' + propertyStr + ' to ' + val);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

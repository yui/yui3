YUI.add('cssbase-basic-tests', function(Y) {

    var suite = new Y.Test.Suite('cssbase-basic example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check table-border-color is #000': function() {
            var propertyStr = 'borderTopStyle',
                val = 'solid',
                selector = 'td',
                property = Y.one(selector).getComputedStyle(propertyStr);
            property = property.replace(/\s/g, ""); //remove spaces from string
            Assert.areEqual(val, property, ' - Failed to set ' + selector + ' to ' + propertyStr + ' to ' + val);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

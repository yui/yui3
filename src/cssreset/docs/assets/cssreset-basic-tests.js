YUI.add('cssreset-basic-tests', function(Y) {

    var suite = new Y.Test.Suite('cssreset-basic example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check background-color is #ffffff': function() {
            Assert.areEqual('rgb(255, 255, 255)', Y.one('html').getComputedStyle('backgroundColor'), ' - Failed to set background-color to "rgb(255, 255, 255)" on html');

        },
        'check table border-collapse is "collapse"': function() {
            Assert.areEqual('collapse', Y.one('table').getComputedStyle('borderCollapse'), ' - Failed to set table border-collapse is "collapse"');

        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

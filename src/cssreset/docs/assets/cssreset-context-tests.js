YUI.add('cssreset-context-tests', function(Y) {

    var suite = new Y.Test.Suite('cssreset-context example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test difference between H1 in and out of context': function() {
            var hOut = parseInt(Y.one('h1').getStyle('fontSize'), 10),
                hIn = parseInt(Y.one('.yui3-cssreset h1').getStyle('fontSize'), 10);
            Assert.isTrue((hOut !== hIn), ' - Failed to set H1 in context smaller than H1 out of context');

        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

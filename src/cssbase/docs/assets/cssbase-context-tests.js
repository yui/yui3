YUI.add('cssbase-context-tests', function(Y) {

    var suite = new Y.Test.Suite('cssbase-context example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test difference between H1 in and out of context': function() {
            var hOut = Y.one('h1').getStyle('fontWeight'),
                hIn = Y.one('.yui3-cssbase h1').getStyle('fontWeight');
            Assert.isTrue((hOut !== hIn), ' - Failed to set H1 in context diff font-weight than H1 out of context');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

YUI.add('cssfonts-basic-tests', function(Y) {

    var suite = new Y.Test.Suite('cssfonts-basic example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'check font family': function() {
            var page = Y.one('#page'),
                h = page.one('ul li'),
                family = h.getComputedStyle('fontFamily').replace(/\s/g, "");

            Assert.areEqual('arial,helvetica,clean,sans-serif', family, ' - Failed to set correct font-family for ' + h.getHTML());
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

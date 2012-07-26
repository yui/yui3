YUI.add('cssfonts-context-tests', function(Y) {

    var suite = new Y.Test.Suite('cssfonts-context example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check font-family in pre, code, kbd, samp, tt': function() {
            var page = Y.one('.yui3-cssfonts'),
                h = page.all('pre, code, kbd, samp, tt'),
                i = 0,
                family;

            for (i = 0; i < h.size(); i+=1) {
                family = h.item(i).getComputedStyle('fontFamily');
                Assert.areEqual('monospace', family, ' - Failed to set correct font-family for ' + h.item(i).getHTML());
            }
        },
        'check font family': function() {
            var page = Y.one('.yui3-cssfonts'),
                h = page.one('ul li'),
                family = h.getComputedStyle('fontFamily').replace(/\s/g, "");

            Assert.areEqual('arial,helvetica,clean,sans-serif', family, ' - Failed to set correct font-family for ' + h.getHTML());
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

YUI.add('cssgrids-fluid-tests', function(Y) {

    var suite = new Y.Test.Suite('cssgrids-fluid example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has stylesheet': function() {
            var group = Y.one('.yui3-g'),
                navWidth = group.one('#nav').get('offsetWidth'),
                mainWidth = group.one('#main').get('offsetWidth'),
                extraWidth = group.one('#extra').get('offsetWidth'),
                viewPortWidth = Y.one('body').get('viewportRegion').right,
                expectedMainWidth = viewPortWidth - (navWidth + extraWidth);
            Assert.areEqual(expectedMainWidth, mainWidth, ' - Failed to set main column to viewport - (nav + extra)');
        },
        'test width of grid columns diff, and border color': function() {
            var group = Y.one('.yui3-g'),
                u1 = group.one('#nav'),
                borderColor = u1.one('.content').getComputedStyle('borderTopColor').replace(/\s/g, "");

            Assert.areEqual('rgb(204,204,204)', borderColor, ' - Failed to show border color as gray');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

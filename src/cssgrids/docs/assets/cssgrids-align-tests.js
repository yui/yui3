YUI.add('cssgrids-align-tests', function(Y) {

    var suite = new Y.Test.Suite('cssgrids-align example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has stylesheet': function() {
            var group = Y.one('.thumb-captions'),
                units = group.all('.yui3-u-1-3'),
                u1 = units.item(0),
                u2 = units.item(1),
                u1Left = u1.getX(),
                u2Left = u2.getX();
            Assert.areNotEqual(u1Left, u2Left, ' - Failed finding thumb caption divs inline');
            Assert.areEqual('bottom', units.item(2).getStyle('verticalAlign'), ' - Failed to bottom align thumb captions (pictures)');
            Assert.areEqual('center', Y.one('#more .yui3-g').getStyle('textAlign'), ' - Failed to horizontally center units that take less than 100% of width');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

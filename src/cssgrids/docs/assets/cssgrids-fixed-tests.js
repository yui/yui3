YUI.add('cssgrids-fixed-tests', function(Y) {

    var suite = new Y.Test.Suite('cssgrids-fixed example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has stylesheet': function() {
            var group = Y.one('.yui3-g'),
                units = group.all('.yui3-u-2-5'),
                u1 = units.item(0),
                u2 = units.item(1),
                u1Left = u1.getX(),
                u2Left = u2.getX();
            Assert.areNotEqual(u1Left, u2Left, ' - Failed finding yui3-u-2-5 divs inline');
        },
        'test width of grid columns diff, and border color': function() {
            var group = Y.one('.yui3-g'),
                u1 = group.one('.yui3-u-1-5'),
                u2 = group.one('.yui3-u-2-5'),
                borderColor = u1.one('.content').getComputedStyle('borderTopColor').replace(/\s/g, "");

            Assert.areNotEqual(u1.getStyle('width'), u2.getStyle('width'), ' - Failed finding 1st and 2nd column diff widths');
            Assert.areEqual('rgb(204,204,204)', borderColor, ' - Failed to show border color as gray');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

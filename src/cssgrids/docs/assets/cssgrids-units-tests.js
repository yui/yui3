YUI.add('cssgrids-units-tests', function(Y) {

    var suite = new Y.Test.Suite('cssgrids-units example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has stylesheet': function() {
            var group = Y.one('.yui3-g'),
                units = group.all('.yui3-u-1-2'),
                u1 = units.item(0),
                u2 = units.item(1),
                u1Left = u1.getX(),
                u2Left = u2.getX();
            Assert.areNotEqual(u1Left, u2Left, ' - Failed finding yui3-u-1-2 divs inline');
        },
        'test clicking on a row shows a panel': function() {
            var group4 = Y.all('.yui3-g').item(4);
            Assert.areEqual('hidden', Y.one('.yui3-panel').getStyle('visibility'), ' - Failed to find panel initially hidden');
            group4.simulate('click');
            Assert.areEqual('visible', Y.one('.yui3-panel').getStyle('visibility'), ' - Failed to find panel initially hidden');
            Assert.isTrue((group4.hasClass('yui3-selected')), ' - Failed to select the clicked on row');
        },
        'test contents of panel body': function() {
            var snip = Y.one('.yui3-panel textarea').get('value');
            Assert.isTrue((snip.indexOf('1/3') > -1), ' - Failed to find "1/3" in snippet');
            Assert.isTrue((snip.indexOf('yui3-u-1-3') > -1), ' - Failed to find "yui3-u-1-3" in snippet');
            Assert.isTrue((snip.indexOf('2/3') > -1), ' - Failed to find "2/3" in snippet');
            Assert.isTrue((snip.indexOf('yui3-u-2-3') > -1), ' - Failed to find "yui3-u-2-3" in snippet');
        },
        'test clicking on OK button closes panel': function() {
            Y.one('.yui3-panel .yui3-widget-ft button').simulate('click');
            Assert.areEqual('hidden', Y.one('.yui3-panel').getStyle('visibility'), ' - Failed to hide panel');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

YUI.add('cssfonts-size-tests', function(Y) {

    var suite = new Y.Test.Suite('cssfonts-size example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'check font size compare': function() {
            var page = Y.one('#page'),
                h = page.all('p'),
                small = parseInt(h.item(6).getStyle('fontSize'), 10),
                larger = parseInt(h.item(12).getStyle('fontSize'), 10);
            Assert.isTrue((small < larger), ' - Failed to see 100% is smaller than 123.1% in font-size');
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

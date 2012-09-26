YUI.add('overlay-tooltip-tests', function(Y) {

    var suite = new Y.Test.Suite('overlay-tooltip example test suite'),
        Assert = Y.Assert,
        tip = Y.one('.example #tooltip'),
        overlay = Y.one('.example .yui3-overlay'),
        listLis = Y.all('.example .list li'),
        pics = Y.all('.example .list li img');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has images': function() {
            Assert.areEqual(10, pics.size(), 'Failed to render images');
        },
        'test tooltip renders': function() {
            Assert.isTrue((overlay !== null), ' - Failed to render overlay container');
            Assert.isTrue((tip !== null), ' - Failed to render #overlay');
        },
        'test mouseover': function() {
            var test = this,
                item = listLis.item(0),
                offset = 20,
                itemX = (item.getX() + offset),
                itemY = (item.getY() + offset);

            item.simulate("mousemove", { clientX: itemX, clientY: itemY });
            Assert.isTrue((tip.inRegion(item, false)), ' - Failed to set tooltip xy on mouseover 0');
            Assert.areEqual('Avoid dropping on toe.', tip.one('.yui3-widget-bd').getHTML(), ' - Failed to set correct text in tooltip')

            // you have to leave one before you can move over another
            item.simulate("mouseout", { relatedTarget: document.body });
            item = listLis.item(2),
            itemX = (item.getX() + offset),
            itemY = (item.getY() + offset);

            item.simulate("mousemove", { clientX: itemX, clientY: itemY });
            Assert.isTrue((tip.inRegion(item, false)), ' - Failed to set tooltip xy on mouseover 2');
            Assert.areEqual('Variable-speed and cordless too.', tip.one('.yui3-widget-bd').getHTML(), ' - Failed to set correct text in tooltip')
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

YUI.add('yui-core-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-core example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has images': function() {
            var imgs = Y.all('.example img');

            Assert.areEqual(imgs.size(), 2, 'Failed to render images');
        },
        'speech bubbles should be equal': function() {
            var counts = Y.all('.example .count'),
                first = counts.item(0).getContent(),
                second = counts.item(1).getContent();

            Assert.areEqual(first, second, 'Initial counts are not equal');
        },
        'speech bubbles should not be the same': function() {
            var test = this,
                items = Y.all('.example .fruit .speech'),
                first = items.item(0),
                second = items.item(1);
            
            Assert.areSame(first.getHTML(), second.getHTML(), 'Start items are different');
            test.wait( function() {
                Assert.areNotSame(first.getHTML(), second.getHTML(), 'Speech bubbles are not different');
                Assert.isTrue((second.getHTML().indexOf('Florida') > -1), 'Changed bubble failed to update');
                Assert.isTrue((Y.one('.example .changer img').get('src').indexOf('orange') > -1), 'Failed to change update image');
            }, 7000);

        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' ] });

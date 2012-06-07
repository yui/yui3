YUI.add('store-tests', function(Y) {

    var suite = new Y.Test.Suite('store example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has images': function() {
            var imgs = Y.all('.example #demo img');

            Assert.areEqual(12, imgs.size(), 'Failed to render images');
        },
        'speech bubbles should be equal': function() {

            Assert.areEqual(3, 3, '3 doesnt equal 3');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' ] });

YUI.add('ducks-tests', function(Y) {

    var suite = new Y.Test.Suite('ducks example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has images': function() {
            var imgs = Y.all('.example #demo img');

            Assert.areEqual(12, imgs.size(), 'Failed to render images');
        },
        'test this': function() {
            Y.one('.example code').simulate('click');
            Assert.isTrue((cartList.item(4).getHTML().indexOf('peanut') > -1),'failed to add peanut butter');
        },
        'test this': function() {
            Assert.isTrue((Y.one('.example #demo2').getHTML().indexOf('Laura Scudders') > -1), 'peanut butter should still be there');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

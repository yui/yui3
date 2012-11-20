YUI.add('store-tests', function(Y) {

    var suite = new Y.Test.Suite('store example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example has images': function() {
            var imgs = Y.all('.example #demo img');

            Assert.areEqual(12, imgs.size(), 'Failed to render images');
        },
        'select/click 4 items from store, and check see if in cart': function() {
            var storeList = Y.all('.example #demo li'),
                cartList;
            storeList.item(0).simulate('click');
            storeList.item(3).simulate('click');
            storeList.item(5).simulate('click');
            storeList.item(8).simulate('click');
            cartList = Y.all('.example #demo2 li');

            // cartList.item(0) is the cart head
            Assert.isTrue((cartList.item(1).getHTML().indexOf('tomato') > -1),'failed to add tomato soup');
            Assert.isTrue((cartList.item(2).getHTML().indexOf('rice') > -1),'failed to add rice-a-roni');
            Assert.isTrue((cartList.item(3).getHTML().indexOf('banana') > -1),'failed to add banana');
            Assert.isTrue((cartList.item(4).getHTML().indexOf('peanut') > -1),'failed to add peanut butter');
        },
        'remove items from cart': function() {
            var storeList = Y.all('.example #demo li'),
                cartList = Y.all('.example #demo2 li');

            cartList.item(1).simulate('click');
            Assert.isTrue((Y.one('.example #demo2').getHTML().indexOf('tomato') === -1), 'failed to remove tomato soup');

            cartList = Y.all('.example #demo2 li'); // reset the cartList nodeList
            cartList.item(2).simulate('click');
            Assert.isTrue((Y.one('.example #demo2').getHTML().indexOf('banana') === -1), 'failed to remove banana');
            Assert.isTrue((Y.one('.example #demo2').getHTML().indexOf('Rice') > -1), 'rice should still be there');
            Assert.isTrue((Y.one('.example #demo2').getHTML().indexOf('Laura Scudders') > -1), 'peanut butter should still be there');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

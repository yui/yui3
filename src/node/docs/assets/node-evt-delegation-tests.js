YUI.add('node-evt-delegation-tests', function(Y) {

    var suite = new Y.Test.Suite('node-evt-delegation example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test clicking on an item in the list': function() {
            var myList = Y.all('.example #demo li');
            myList.item(1).simulate('click');
            Assert.isTrue((myList.item(1).getHTML().indexOf('Thanks for the click!') > -1),'&#8226; failed to setHTML of clicked item');
            Assert.isTrue((myList.item(2).getHTML().indexOf('me') > -1),'&#8226; HTML of unclicked failed to change to clickme too please');
            Assert.areEqual('5px', Y.one('.example #demo').getComputedStyle('borderTopWidth'),'&#8226; failed to set border width of container');
            Assert.areEqual('rgb(255, 161, 0)', Y.one('.example #demo').getComputedStyle('borderTopColor'),'&#8226; failed to set border color of container');
            myList.item(3).simulate('click');
            Assert.isTrue((myList.item(3).getHTML().indexOf('Thanks for the click!') > -1),'&#8226; failed to setHTML of clicked item');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

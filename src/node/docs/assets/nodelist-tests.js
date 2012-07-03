YUI.add('nodelist-tests', function(Y) {

    var suite = new Y.Test.Suite('nodelist example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'click a box, check the contents': function() {
            var boxes = Y.all('.example .box-row li');
            boxes.item(2).simulate('click');

            Assert.areEqual('ouch!', boxes.item(2).getHTML(), 'Failed to change text when clicked');
            Assert.areEqual('rgb(196, 218, 237)', boxes.item(2).getComputedStyle('backgroundColor'), 'Failed to change background color when clicked')/
            Assert.areEqual('neener', boxes.item(0).getHTML(), 'Failed to change text of unclicked boxes when another one was clicked');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

YUI.add('basic-example-tests', function(Y) {

    var suite = new Y.Test.Suite('basic-example example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test clicking the hello world box': function() {
            var hello = Y.one('#demo #container');
            hello.simulate('click');
            Assert.isTrue((hello.hasClass('hello')), ' - Failed to add hello class');
        },
        'test clicking the second <a>': function() {
            Y.one('#secondA').simulate('click');
            Assert.isTrue((Y.one('.message').getStyle('visibility') === 'visible'), ' - Failed to display message');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

YUI.add('yui-extend-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-extend example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check button click': function() {
            var button = Y.one('#demo_btn'),
                before = Y.one('#demo').get('innerHTML');

            button.simulate('click');

            Assert.areNotEqual(Y.one('#demo').get('innerHTML'), before, 'Button click failed to execute example');
        },
        'check example output': function() {
            var out = Y.one('#demo').get('innerHTML');

            Assert.isTrue((out.indexOf('chicken IS an instance of Object') > -1), 'Failed to read output');
            Assert.isTrue((out.indexOf('chicken IS an instance of Bird') > -1), 'Failed to read output');
            Assert.isTrue((out.indexOf('chicken IS an instance of Chicken') > -1), 'Failed to read output');
            Assert.isTrue((out.indexOf('chicken CAN NOT fly') > -1), 'Failed to read output');
            Assert.isTrue((out.indexOf("chicken's name is Little") > -1), 'Failed to read output');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

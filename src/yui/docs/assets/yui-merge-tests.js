YUI.add('yui-merge-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-merge example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check merge button click': function() {
            var button = Y.one('#demo_btn1'),
                before = Y.one('#demo_result').get('innerHTML');

            button.simulate('click');

            Assert.areNotEqual(Y.one('#demo_result').get('innerHTML'), before, 'Button click failed to execute example');
        },
        'check merge example output': function() {
            var html = Y.one('#demo_result').get('innerHTML');
            Assert.areEqual(html, '{foo =&gt; FOO, bar =&gt; bar, baz =&gt; BAZ}', 'Failed to render merge example');
        },
        'check copy button click': function() {
            var button = Y.one('#demo_btn2'),
                before = Y.one('#demo_result').get('innerHTML');

            button.simulate('click');

            Assert.areNotEqual(Y.one('#demo_result').get('innerHTML'), before, 'Button click failed to execute example');
        },
        'check copy example output': function() {
            var html = Y.one('#demo_result').get('innerHTML');
            Assert.isTrue((html.indexOf('"copy" should NOT be equal to the "original" (false expected): false') > -1), 'Failed to copy (false)');
            Assert.isTrue((html.indexOf('copy.obj.addedToCopy should be equal to original.obj.addedToCopy (true expected): true') > -1), 'Failed to copy (true)');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });

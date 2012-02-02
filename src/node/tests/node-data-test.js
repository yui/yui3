YUI.add('node-data-test', function(Y) {
    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Node data',

        'should return undefined when no data set': function() {
            var node = Y.Node.create('<div/>'); 
            Y.Assert.isUndefined(node.getData('foo'));
        },

        'should return set value': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData('foo', 'foo');
            Y.Assert.areEqual('foo', node.getData('foo'));
        },

        'should initialize from HTML attribute': function() {
            var node = Y.Node.create('<div data-foo="foo"/>'); 
            Y.Assert.areEqual('foo', node.getData('foo'));
        },

        'should prefer setData value to HTML attribute': function() {
            var node = Y.Node.create('<div data-foo="foo"/>'); 
            node.setData('foo', 'foo2');
            Y.Assert.areEqual('foo2', node.getData('foo'));
        },

        'should return all set values': function() {
            var node = Y.Node.create('<div />'),
                data;
                
            node.setData({
                foo: 'foo',
                bar: 'bar',
                baz: 'baz'
            });

            data = node.getData();
            Y.Assert.areEqual('foo', data.foo);
            Y.Assert.areEqual('bar', data.bar);
            Y.Assert.areEqual('baz', data.baz);
        },

        'should return all html data': function() {
            var node = Y.Node.create('<div data-foo="foo" data-bar="bar" data-baz="baz"/>'),
                data = node.getData();
                
            Y.Assert.areEqual('foo', data.foo);
            Y.Assert.areEqual('bar', data.bar);
            Y.Assert.areEqual('baz', data.baz);
        },

        'should prefer setData values to HTML attributes': function() {
            var node = Y.Node.create('<div data-foo="foo" data-bar="bar" data-baz="baz"/>'); 
            node.setData({
                foo: 'foo2',
                bar: 'bar2',
            });

            Y.Assert.areEqual('foo2', node.getData('foo'));
            Y.Assert.areEqual('bar2', node.getData('bar'));
            Y.Assert.areEqual('baz', node.getData('baz'));
        }
    }));

}, '@VERSION@' ,{requires:['node-base', 'test-console']});

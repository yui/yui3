YUI.add('node-data-test', function(Y) {
    var suite = new Y.Test.Suite('Node: Data');
    suite.add(new Y.Test.Case({
        name: 'Node data',

        'should return empty object when no data set': function() {
            var node = Y.Node.create('<div/>'),
                data = node.getData();

            Y.Assert.isUndefined(Y.Object.keys(data)[0]);
        },

        'should return undefined when no data field set': function() {
            var node = Y.Node.create('<div/>'); 
            Y.Assert.isUndefined(node.getData('foo'));
        },

        'should set data value to string': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData('foo');
            Y.Assert.areEqual('foo', node.getData());
        },

        'should set data value to number': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData(10);
            Y.Assert.areEqual(10, node.getData());
        },

        'should set data value to zero': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData(0);
            Y.Assert.areEqual(0, node.getData());
        },

        'should set data value to undefined': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData(undefined);
            Y.Assert.isUndefined(node.getData());
        },

        'should set data value to null': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData(null);
            Y.Assert.isNull(node.getData());
        },

        'should set field value to string': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData('foo', 'foo');
            Y.Assert.areEqual('foo', node.getData('foo'));
        },

        'should set field name to number': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData(1, 'foo');
            Y.Assert.areEqual('foo', node.getData(1));
        },

        'should set field name to zero': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData(0, 'foo');
            Y.Assert.areEqual('foo', node.getData(0));
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
                bar: 'bar2'
            });

            Y.Assert.areEqual('foo2', node.getData('foo'));
            Y.Assert.areEqual('bar2', node.getData('bar'));
            Y.Assert.areEqual('baz', node.getData('baz'));
        },

        'should setData on all nodes': function() {
            var nodes = Y.Node.create('<div><em></em><span></span></div>').get('children');
            nodes.setData('foo', 'foo');
            Y.Assert.areEqual('foo', nodes.item(0).getData('foo'));
            Y.Assert.areEqual('foo', nodes.item(1).getData('foo'));
        },

        'should return all html data from all nodes': function() {
            var nodes = Y.Node.create(
                    '<div><em data-foo="foo" data-bar="bar" data-baz="baz"></em>' +
                    '<span data-foo="foo" data-bar="bar" data-baz="baz"></span></div>'
                ).get('children'),

                data = nodes.getData();

            Y.Assert.areEqual('foo', data[0].foo);
            Y.Assert.areEqual('bar', data[0].bar);
            Y.Assert.areEqual('baz', data[0].baz);

            Y.Assert.areEqual('foo', data[1].foo);
            Y.Assert.areEqual('bar', data[1].bar);
            Y.Assert.areEqual('baz', data[1].baz);
        },

        'should prefer setData values to HTML attributes on all nodes': function() {
            var nodes = Y.Node.create(
                    '<div><em data-foo="foo" data-bar="bar" data-baz="baz"></em>' +
                    '<span data-foo="foo" data-bar="bar" data-baz="baz"></span></div>'
                ).get('children');

            nodes.setData({
                foo: 'foo2',
                bar: 'bar2'
            });

            Y.Assert.areEqual('foo2', nodes.item(0).getData('foo'));
            Y.Assert.areEqual('bar2', nodes.item(0).getData('bar'));
            Y.Assert.areEqual('baz', nodes.item(0).getData('baz'));

            Y.Assert.areEqual('foo2', nodes.item(1).getData('foo'));
            Y.Assert.areEqual('bar2', nodes.item(1).getData('bar'));
            Y.Assert.areEqual('baz', nodes.item(1).getData('baz'));
        },

        'should clear field data': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData('foo', 'foo');
            node.clearData('foo');
            Y.Assert.isUndefined(node.getData('foo'));
        },

        'should clear number field data': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData(1, 'foo');
            node.clearData(1);
            Y.Assert.isUndefined(node.getData(1));
        },

        'should clear number zero field data': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData(0, 'foo');
            node.clearData(0);
            Y.Assert.isUndefined(node.getData(0));
        },

        'should clear data for given field from all nodes': function() {
            var nodes = Y.Node.create(
                    '<div><em></em><span></span></div>'
                ).get('children');

            nodes.setData({
                foo: 'foo',
                bar: 'bar'
            });

            nodes.clearData('foo');
            Y.Assert.isUndefined(nodes.item(0).getData('foo'));
            Y.Assert.areEqual('bar', nodes.item(0).getData('bar'));
            Y.Assert.isUndefined(nodes.item(1).getData('foo'));
            Y.Assert.areEqual('bar', nodes.item(1).getData('bar'));
        },

        'should clear field data from all nodes and revert to HTML attributes': function() {
            var nodes = Y.Node.create(
                    '<div><em data-foo="foo" data-bar="bar" data-baz="baz"></em>' +
                    '<span data-foo="foo" data-bar="bar" data-baz="baz"></span></div>'
                ).get('children');

            nodes.setData({
                foo: 'foo2',
                bar: 'bar2'
            });

            nodes.clearData();
            Y.Assert.areEqual('foo', nodes.item(0).getData('foo'));
            Y.Assert.areEqual('bar', nodes.item(0).getData('bar'));
            Y.Assert.areEqual('foo', nodes.item(1).getData('foo'));
            Y.Assert.areEqual('bar', nodes.item(1).getData('bar'));
        },

        'should clear all data': function() {
            var node = Y.Node.create('<div/>'); 
            node.setData('foo', 'foo');
            node.setData('bar', 'bar');
            node.clearData();
            Y.Assert.isUndefined(node.getData('foo'));
            Y.Assert.isUndefined(node.getData('bar'));
        },

        'should store data for document node': function() {
            var node = Y.one('doc');
            node.setData('foo', 'foo');
            Y.Assert.areEqual('foo', node.getData('foo'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['node-base', 'test-console']});

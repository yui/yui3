{
    title: 'Node Core',
    html: 'assets/node-core.html',
    yui: {
        use: ['node-core', 'node-base'] // base is needed for node.purge
    },
    global: {
        setup: function () {
            resetBody();
            var testNode = Y.one('#test-node'),
                bodyNode = Y.one('body'),
                testEmpty = Y.one('#test-empty'),
                testRemove = Y.one('#test-remove');
        }
    },
    tests: [
        {
            title: 'new Y.Node("#test-node")',
            fn: function () {
                var node = new Y.Node('#test-node');
            }
        },
        {
            title: 'new Y.Node("#test-node").destroy()',
            fn: function () {
                var node = new Y.Node('#test-node');
                node.destroy();
            }
        },
        {
            title: 'new Y.Node("#test-node").destroy(true)',
            fn: function () {
                var node = new Y.Node('#test-node');
                node.destroy(true);
            }
        },
        {
            title: 'node.get()',
            fn: function () {
                testNode.get('nodeName');
            }
        },
        {
            title: 'node.getAttrs()',
            fn: function () {
                testNode.getAttrs(['nodeName', 'nodeType']);
            }
        },
        {
            title: 'node.set()',
            fn: function () {
                testNode.set('id', 'foo');
            }
        },
        {
            title: 'node.setAttrs()',
            fn: function () {
                testNode.setAttrs({
                    title: 'foo',
                    id: 'bar'
                });
            }
        },
        {
            title: 'node.compareTo()',
            fn: function () {
                testNode.compareTo(testNode);
            }
        },
        {
            title: 'node.inDoc()',
            fn: function () {
                testNode.inDoc();
            }
        },
        {
            title: 'node.getById()',
            fn: function () {
                bodyNode.getById('log');
            }
        },
        {
            title: 'node.ancestor()',
            fn: function () {
                testNode.ancestor();
            }
        },
        {
            title: 'node.ancestor(body)',
            fn: function () {
                testNode.ancestor('body');
            }
        },
        {
            title: 'node.ancestors(html, body)',
            fn: function () {
                testNode.ancestors('html, body');
            }
        },
        {
            title: 'node.previous()',
            fn: function () {
                testNode.previous();
            }
        },
        {
            title: 'node.previous("div")',
            fn: function () {
                testNode.previous('div');
            }
        },
        {
            title: 'node.next()',
            fn: function () {
                testNode.next();
            }
        },
        {
            title: 'node.next("div")',
            fn: function () {
                testNode.next('div');
            }
        },
        {
            title: 'node.siblings()',
            fn: function () {
                testNode.siblings();
            }
        },
        {
            title: 'node.siblings("div")',
            fn: function () {
                testNode.siblings('div');
            }
        },
        {
            title: 'node.one("div")',
            fn: function () {
                bodyNode.one('div');
            }
        },
        {
            title: 'node.all("div")',
            fn: function () {
                bodyNode.all('div');
            }
        },
        {
            title: 'node.test("div")',
            fn: function () {
                testNode.test('div');
            }
        },
        {
            title: 'node.remove()',
            fn: function () {
                testRemove.remove();
            }
        },
        {
            title: 'node.empty()',
            fn: function () {
                testEmpty.empty(true);
            }
        }
    ]
}
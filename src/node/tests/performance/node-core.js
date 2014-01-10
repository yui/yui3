var suite = new PerfSuite({
    name: 'Node Core',
    html: 'assets/node-core.html',
    yui: {
        use: ['node-core', 'node-base'] // base is needed for node.purge
    },
    global: {
        setup: function () {
            resetHTML();
            var testNode = Y.one('#test-node'),
                bodyNode = Y.one('body'),
                testEmpty = Y.one('#test-empty'),
                testRemove = Y.one('#test-remove');
        }
    },
    tests: [
        {
            name: 'new Y.Node("#test-node")',
            fn: function () {
                var node = new Y.Node('#test-node');
            }
        },
        {
            name: 'new Y.Node("#test-node").destroy()',
            fn: function () {
                var node = new Y.Node('#test-node');
                node.destroy();
            }
        },
        {
            name: 'new Y.Node("#test-node").destroy(true)',
            fn: function () {
                var node = new Y.Node('#test-node');
                node.destroy(true);
            }
        },
        {
            name: 'node.get()',
            fn: function () {
                testNode.get('nodeName');
            }
        },
        {
            name: 'node.getAttrs()',
            fn: function () {
                testNode.getAttrs(['nodeName', 'nodeType']);
            }
        },
        {
            name: 'node.set()',
            fn: function () {
                testNode.set('id', 'foo');
            }
        },
        {
            name: 'node.setAttrs()',
            fn: function () {
                testNode.setAttrs({
                    name: 'foo',
                    id: 'bar'
                });
            }
        },
        {
            name: 'node.compareTo()',
            fn: function () {
                testNode.compareTo(testNode);
            }
        },
        {
            name: 'node.inDoc()',
            fn: function () {
                testNode.inDoc();
            }
        },
        {
            name: 'node.getById()',
            fn: function () {
                bodyNode.getById('log');
            }
        },
        {
            name: 'node.ancestor()',
            fn: function () {
                testNode.ancestor();
            }
        },
        {
            name: 'node.ancestor(body)',
            fn: function () {
                testNode.ancestor('body');
            }
        },
        {
            name: 'node.ancestors(html, body)',
            fn: function () {
                testNode.ancestors('html, body');
            }
        },
        {
            name: 'node.previous()',
            fn: function () {
                testNode.previous();
            }
        },
        {
            name: 'node.previous("div")',
            fn: function () {
                testNode.previous('div');
            }
        },
        {
            name: 'node.next()',
            fn: function () {
                testNode.next();
            }
        },
        {
            name: 'node.next("div")',
            fn: function () {
                testNode.next('div');
            }
        },
        {
            name: 'node.siblings()',
            fn: function () {
                testNode.siblings();
            }
        },
        {
            name: 'node.siblings("div")',
            fn: function () {
                testNode.siblings('div');
            }
        },
        {
            name: 'node.one("div")',
            fn: function () {
                bodyNode.one('div');
            }
        },
        {
            name: 'node.all("div")',
            fn: function () {
                bodyNode.all('div');
            }
        },
        {
            name: 'node.test("div")',
            fn: function () {
                testNode.test('div');
            }
        },
        {
            name: 'node.remove()',
            fn: function () {
                testRemove.remove();
            }
        },
        {
            name: 'node.empty()',
            fn: function () {
                testEmpty.empty(true);
            }
        }
    ]
});

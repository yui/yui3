var suite = new PerfSuite({
    name: 'Node Data',
    yui: {
        use: ['node-base']
    },
    html: '<div id="test-node"></div>',
    global: {
        setup: function () {
            resetHTML();
            var testNode = Y.one('#test-node');
        }
    },
    tests: [
        {
            name: 'node.setData("foo", "foo data")',
            fn: function () {
                testNode.setData('foo', 'foo data');
            }
        },
        {
            name: 'node.getData("foo")',
            fn: function () {
                testNode.getData('foo');
            }
        },
        {
            name: 'node.clearData("foo")',
            fn: function () {
                testNode.clearData('foo');
            }
        },
        {
            name: 'node.clearData()',
            fn: function () {
                testNode.clearData();
            }
        }
    ]
});

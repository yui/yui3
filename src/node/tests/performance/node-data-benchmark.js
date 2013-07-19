{
    title: 'Node Data',
    yui: {
        use: ['node-base']
    },
    html: '<div id="test-node"></div>',
    global: {
        setup: function () {
            resetBody();
            var testNode = Y.one('#test-node');
        }
    },
    tests: [
        {
            title: 'node.setData("foo", "foo data")',
            fn: function () {
                testNode.setData('foo', 'foo data');
            }
        },
        {
            title: 'node.getData("foo")',
            fn: function () {
                testNode.getData('foo');
            }
        },
        {
            title: 'node.clearData("foo")',
            fn: function () {
                testNode.clearData('foo');
            }
        },
        {
            title: 'node.clearData()',
            fn: function () {
                testNode.clearData();
            }
        }
    ]
}

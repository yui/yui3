{
    title: 'Node Attributes',
    html: 'assets/node-attrs.html',
    yui: {
        use: ['node-base']
    },
    global: {
        setup: function () {
            resetBody();
            var testNode = Y.one('#test-node'),
                testOptions = Y.one('#test-options select'),
                bodyNode = Y.one('body');
        }
    },
    tests: [
        {
            title: 'node.get("text")',
            fn: function () {
                testNode.get('text');
            }
        },
        {
            title: 'node.set("text", "new text")',
            fn: function () {
                testNode.set('text', 'new text');
            }
        },
        {
            title: 'node.get("children")',
            fn: function () {
                testNode.get('children');
            }
        },
        {
            title: 'node.get("options")',
            fn: function () {
                testOptions.get('options');
            }
        },
        {
            title: 'node.get("value")',
            fn: function () {
                testOptions.get('value');
            }
        },
        {
            title: 'node.set("value", "2")',
            fn: function () {
                testOptions.set('value', "2");
            }
        },
        {
            title: 'node.setAttribute("data-foo", "foo")',
            fn: function () {
                testNode.setAttribute('data-foo', 'foo');
            }
        },
        {
            title: 'node.getAttribute("data-foo")',
            fn: function () {
                testNode.getAttribute('data-foo');
            }
        }
    ]
}

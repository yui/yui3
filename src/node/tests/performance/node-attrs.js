var suite = new PerfSuite({
    name: 'Node Attributes',
    html: 'assets/node-attrs.html',
    yui: {
        use: ['node-base']
    },
    global: {
        setup: function () {
            resetHTML();
            var testNode = Y.one('#test-node'),
                testOptions = Y.one('#test-options select'),
                bodyNode = Y.one('body');
        }
    },
    tests: [
        {
            name: 'node.get("text")',
            fn: function () {
                testNode.get('text');
            }
        },
        {
            name: 'node.set("text", "new text")',
            fn: function () {
                testNode.set('text', 'new text');
            }
        },
        {
            name: 'node.get("children")',
            fn: function () {
                testNode.get('children');
            }
        },
        {
            name: 'node.get("options")',
            fn: function () {
                testOptions.get('options');
            }
        },
        {
            name: 'node.get("value")',
            fn: function () {
                testOptions.get('value');
            }
        },
        {
            name: 'node.set("value", "2")',
            fn: function () {
                testOptions.set('value', "2");
            }
        },
        {
            name: 'node.setAttribute("data-foo", "foo")',
            fn: function () {
                testNode.setAttribute('data-foo', 'foo');
            }
        },
        {
            name: 'node.getAttribute("data-foo")',
            fn: function () {
                testNode.getAttribute('data-foo');
            }
        }
    ]
});
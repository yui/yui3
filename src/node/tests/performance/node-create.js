var suite = new PerfSuite({
    name: 'Node Create',
    html: '<div id="test-before"></div><div id="test-node"></div><div id="test-append"></div>',
    yui: {
        use: ['node-core', 'node-base']
    },
    global: {
        setup: function () {
            resetHTML();
            var testNode = Y.one('#test-node'),
                testBefore = Y.one('#test-before'),
                testAppendTo = Y.one('#test-append'),
                bodyNode = Y.one('body');
        }
    },
    tests: [
        {
            name: 'Y.Node.create("<div/>")',
            fn: function () {
                var node = Y.Node.create('<div/>');
            }
        },

        {
            name: 'node.append()',
            fn: function () {
                bodyNode.append(testNode);
            }
        },
        {
            name: 'node.insert())',
            fn: function () {
                bodyNode.insert(testNode);
            }
        },
        {
            name: 'node.prepend()',
            fn: function () {
                bodyNode.prepend(testNode);
            }
        },
        {
            name: 'node.appendChild()',
            fn: function () {
                bodyNode.appendChild(testNode);
            }
        },
        {
            name: 'node.insertBefore())',
            fn: function () {
                bodyNode.insertBefore(testNode, testBefore);
            }
        },
        {
            name: 'node.appendTo())',
            fn: function () {
                testAppendTo.appendTo(bodyNode);
            }
        },
        {
            name: 'node.setHTML("<div/>"))',
            fn: function () {
                testNode.setHTML('<div/>');
            }
        },
        {
            name: 'node.getHTML())',
            fn: function () {
                testNode.getHTML();
            }
        }
    ]
});

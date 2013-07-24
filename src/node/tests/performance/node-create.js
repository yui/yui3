{
    title: 'Node Create',
    html: '<div id="test-before"></div><div id="test-node"></div><div id="test-append"></div>',
    yui: {
        use: ['node-core', 'node-base']
    },
    global: {
        setup: function () {
            resetBody();
            var testNode = Y.one('#test-node'),
                testBefore = Y.one('#test-before'),
                testAppendTo = Y.one('#test-append'),
                bodyNode = Y.one('body');
        }
    },
    tests: [
        {
            title: 'Y.Node.create("<div/>")',
            fn: function () {
                var node = Y.Node.create('<div/>');
            }
        },

        {
            title: 'node.append()',
            fn: function () {
                bodyNode.append(testNode);
            }
        },
        {
            title: 'node.insert())',
            fn: function () {
                bodyNode.insert(testNode);
            }
        },
        {
            title: 'node.prepend()',
            fn: function () {
                bodyNode.prepend(testNode);
            }
        },
        {
            title: 'node.appendChild()',
            fn: function () {
                bodyNode.appendChild(testNode);
            }
        },
        {
            title: 'node.insertBefore())',
            fn: function () {
                bodyNode.insertBefore(testNode, testBefore);
            }
        },
        {
            title: 'node.appendTo())',
            fn: function () {
                testAppendTo.appendTo(bodyNode);
            }
        },
        {
            title: 'node.setHTML("<div/>"))',
            fn: function () {
                testNode.setHTML('<div/>');
            }
        },
        {
            title: 'node.getHTML())',
            fn: function () {
                testNode.getHTML();
            }
        }
    ]
}
{
    title: 'Node Screen',
    yui: {
        use: ['node-screen']
    },
    html: '<div id="test-node"></div>',
    global: {
        setup: function () {
            resetBody();
            var testNode = Y.one('#test-node'),
                bodyNode = Y.one('body');
        }
    },
    tests: [
        {
            title: 'node.get("winWidth")',
            fn: function () {
                testNode.get('winWidth');
            }
        },
        {
            title: 'node.get("winHeight")',
            fn: function () {
                testNode.get('winHeight');
            }
        },
        {
            title: 'node.get("docWidth")',
            fn: function () {
                testNode.get('docWidth');
            }
        },
        {
            title: 'node.get("docHeight")',
            fn: function () {
                testNode.get('docHeight');
            }
        },
        {
            title: 'node.get("docScrollX")',
            fn: function () {
                testNode.get('docScrollX');
            }
        },
        {
            title: 'node.get("docScrollY")',
            fn: function () {
                testNode.get('docScrollY');
            }
        },
        {
            title: 'node.set("scrollLeft", 100)',
            fn: function () {
                testNode.set('scrollLeft', 100);
            }
        },
        {
            title: 'node.get("scrollLeft")',
            fn: function () {
                testNode.get('scrollLeft');
            }
        },
        {
            title: 'node.set("scrollTop", 100)',
            fn: function () {
                testNode.set('scrollTop', 100);
            }
        },
        {
            title: 'node.get("scrollTop")',
            fn: function () {
                testNode.get('scrollTop');
            }
        },
        {
            title: 'node.setXY([100, 200])',
            fn: function () {
                testNode.setXY([100, 200]);
            }
        },
        {
            title: 'node.getXY()',
            fn: function () {
                testNode.setXY();
            }
        },
        {
            title: 'node.get("region")',
            fn: function () {
                testNode.get('region');
            }
        },
        {
            title: 'node.get("viewportRegion")',
            fn: function () {
                testNode.get('viewportRegion');
            }
        },
        {
            title: 'node.inViewportRegion()',
            fn: function () {
                testNode.inViewportRegion();
            }
        },
        {
            title: 'node.intersect()',
            fn: function () {
                testNode.intersect(bodyNode);
            }
        },
        {
            title: 'node.inRegion()',
            fn: function () {
                testNode.inRegion(bodyNode);
            }
        }
    ]
}

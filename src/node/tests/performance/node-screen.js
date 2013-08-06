var suite = new PerfSuite({
    name: 'Node Screen',
    yui: {
        use: ['node-screen']
    },
    html: '<div id="test-node"></div>',
    global: {
        setup: function () {
            resetHTML();
            var testNode = Y.one('#test-node'),
                bodyNode = Y.one('body');
        }
    },
    tests: [
        {
            name: 'node.get("winWidth")',
            fn: function () {
                testNode.get('winWidth');
            }
        },
        {
            name: 'node.get("winHeight")',
            fn: function () {
                testNode.get('winHeight');
            }
        },
        {
            name: 'node.get("docWidth")',
            fn: function () {
                testNode.get('docWidth');
            }
        },
        {
            name: 'node.get("docHeight")',
            fn: function () {
                testNode.get('docHeight');
            }
        },
        {
            name: 'node.get("docScrollX")',
            fn: function () {
                testNode.get('docScrollX');
            }
        },
        {
            name: 'node.get("docScrollY")',
            fn: function () {
                testNode.get('docScrollY');
            }
        },
        {
            name: 'node.set("scrollLeft", 100)',
            fn: function () {
                testNode.set('scrollLeft', 100);
            }
        },
        {
            name: 'node.get("scrollLeft")',
            fn: function () {
                testNode.get('scrollLeft');
            }
        },
        {
            name: 'node.set("scrollTop", 100)',
            fn: function () {
                testNode.set('scrollTop', 100);
            }
        },
        {
            name: 'node.get("scrollTop")',
            fn: function () {
                testNode.get('scrollTop');
            }
        },
        {
            name: 'node.setXY([100, 200])',
            fn: function () {
                testNode.setXY([100, 200]);
            }
        },
        {
            name: 'node.getXY()',
            fn: function () {
                testNode.setXY();
            }
        },
        {
            name: 'node.get("region")',
            fn: function () {
                testNode.get('region');
            }
        },
        {
            name: 'node.get("viewportRegion")',
            fn: function () {
                testNode.get('viewportRegion');
            }
        },
        {
            name: 'node.inViewportRegion()',
            fn: function () {
                testNode.inViewportRegion();
            }
        },
        {
            name: 'node.intersect()',
            fn: function () {
                testNode.intersect(bodyNode);
            }
        },
        {
            name: 'node.inRegion()',
            fn: function () {
                testNode.inRegion(bodyNode);
            }
        }
    ]
});

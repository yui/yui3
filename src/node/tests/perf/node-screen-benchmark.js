YUI.add('node-screen-benchmark', function (Y) {
    var suite = Y.BenchmarkSuite = new Benchmark.Suite(),
        testNode = Y.one('#test-node'),
        bodyNode = Y.one('body');
        

    suite.add('node.get("winWidth")', function() { 
        testNode.get('winWidth');
    });

    suite.add('node.get("winHeight")', function() { 
        testNode.get('winHeight');
    });

    suite.add('node.get("docWidth")', function() { 
        testNode.get('docWidth');
    });

    suite.add('node.get("docHeight")', function() { 
        testNode.get('docHeight');
    });

    suite.add('node.get("docScrollX")', function() { 
        testNode.get('docScrollX');
    });

    suite.add('node.get("docScrollY")', function() { 
        testNode.get('docScrollY');
    });

    suite.add('node.set("scrollLeft", 100)', function() { 
        testNode.set('scrollLeft', 100);
    });

    suite.add('node.get("scrollLeft")', function() { 
        testNode.get('scrollLeft');
    });

    suite.add('node.set("scrollTop", 100)', function() { 
        testNode.set('scrollTop', 100);
    });

    suite.add('node.get("scrollTop")', function() { 
        testNode.get('scrollTop');
    });

    suite.add('node.setXY([100, 200])', function() { 
        testNode.setXY([100, 200]);
    });

    suite.add('node.getXY()', function() { 
        testNode.setXY();
    });

}, '@VERSION@', {requires: ['node-screen']});

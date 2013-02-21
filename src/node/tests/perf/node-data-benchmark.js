YUI.add('node-data-benchmark', function (Y) {
    var suite = Y.BenchmarkSuite = new Benchmark.Suite(),
        testNode = Y.one('#test-node');
        

    suite.add('node.setData("foo", "foo data")', function() { 
        testNode.setData('foo', 'foo data');
    });

    suite.add('node.getData("foo")', function() { 
        testNode.getData('foo');
    });

    suite.add('node.clearData("foo")', function() { 
        testNode.clearData('foo');
    });

    suite.add('node.clearData()', function() { 
        testNode.clearData();
    });

}, '@VERSION@', {requires: ['node-base']});

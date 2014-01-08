YUI.add('node-attrs-benchmark', function (Y) {
    var suite = Y.BenchmarkSuite = new Benchmark.Suite(),
        testNode = Y.one('#test-node'),
        testOptions = Y.one('#test-options select'),
        bodyNode = Y.one('body');
        

    suite.add('node.get("text")', function() { 
        testNode.get('text');
    });

    suite.add('node.set("text", "new text")', function() { 
        testNode.set('text', 'new text');
    });

    suite.add('node.get("children")', function() { 
        testNode.get('children');
    });

    suite.add('node.get("options")', function() { 
        testOptions.get('options');
    });

    suite.add('node.get("value")', function() { 
        testOptions.get('value');
    });

    suite.add('node.set("value", "2")', function() { 
        testOptions.set('value', "2");
    });

    suite.add('node.setAttribute("data-foo", "foo")', function() { 
        testNode.setAttribute('data-foo', 'foo');
    });

    suite.add('node.getAttribute("data-foo")', function() { 
        testNode.getAttribute('data-foo');
    });

}, '@VERSION@', {requires: ['node-base']});

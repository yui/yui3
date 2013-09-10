YUI.add('node-create-benchmark', function (Y) {
    var suite = Y.BenchmarkSuite = new Benchmark.Suite(),
        testNode = Y.one('#test-node'),
        testBefore = Y.one('#test-before'),
        testAppendTo = Y.one('#test-append'),
        bodyNode = Y.one('body');
        

    suite.add('Y.Node.create("<div/>")', function() { 
        var node = Y.Node.create('<div/>');
    });
    
    suite.add('node.append()', function() { 
        bodyNode.append(testNode);
    });

    suite.add('node.insert())', function() { 
        bodyNode.insert(testNode);
    });

    suite.add('node.prepend()', function() { 
        bodyNode.prepend(testNode);
    });

    suite.add('node.appendChild()', function() { 
        bodyNode.appendChild(testNode);
    });

    suite.add('node.insertBefore())', function() { 
        bodyNode.insertBefore(testNode, testBefore);
    });

    suite.add('node.appendTo())', function() { 
        testAppendTo.appendTo(bodyNode);
    });

    suite.add('node.setHTML("<div/>"))', function() { 
        testNode.setHTML('<div/>');
    });

    suite.add('node.getHTML())', function() { 
        testNode.getHTML();
    });


}, '@VERSION@', {requires: ['node-base']});

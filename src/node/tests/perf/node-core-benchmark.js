YUI.add('node-core-benchmark', function (Y) {
    var suite = Y.BenchmarkSuite = new Benchmark.Suite(),
        testNode = Y.one('#test-node'),
        bodyNode = Y.one('body'),
        testEmpty = Y.one('#test-empty'),
        testRemove = Y.one('#test-remove');
        

    suite.add('new Y.Node("#test-node")', function() { 
        var node = new Y.Node('#test-node');
    });

    suite.add('new Y.Node("#test-node").destroy()', function() { 
        var node = new Y.Node('#test-node');
        node.destroy();
    });
    
    suite.add('new Y.Node("#test-node").destroy(true)', function() { 
        var node = new Y.Node('#test-node');
        node.destroy(true);
    });
    
    suite.add('node.get()', function() { 
        testNode.get('nodeName');
    });
    
    suite.add('node.getAttrs()', function() { 
        testNode.getAttrs(['nodeName', 'nodeType']);
    });
    
    suite.add('node.set()', function() { 
        testNode.set('id', 'foo');
    });
    
    suite.add('node.setAttrs()', function() { 
        testNode.setAttrs({
            title: 'foo',
            id: 'bar'
        });
    });
    
    suite.add('node.compareTo()', function() { 
        testNode.compareTo(testNode);
    });
    
    suite.add('node.inDoc()', function() { 
        testNode.inDoc();
    });
    
    suite.add('node.getById()', function() { 
        bodyNode.getById('log');
    });
    
    suite.add('node.ancestor()', function() { 
        testNode.ancestor();
    });
    
    suite.add('node.ancestor(body)', function() { 
        testNode.ancestor('body');
    });
    
    suite.add('node.ancestors(html, body)', function() { 
        testNode.ancestors('html, body');
    });
    
    suite.add('node.previous()', function() { 
        testNode.previous();
    });

    suite.add('node.previous("div")', function() { 
        testNode.previous('div');
    });

    suite.add('node.next()', function() { 
        testNode.next();
    });

    suite.add('node.next("div")', function() { 
        testNode.next('div');
    });

    suite.add('node.siblings()', function() { 
        testNode.siblings();
    });

    suite.add('node.siblings("div")', function() { 
        testNode.siblings('div');
    });

    suite.add('node.one("div")', function() { 
        bodyNode.one('div');
    });

    suite.add('node.all("div")', function() { 
        bodyNode.all('div');
    });

    suite.add('node.test("div")', function() { 
        testNode.test('div');
    });

    suite.add('node.remove()', function() { 
        testRemove.remove();
    });

    suite.add('node.empty()', function() { 
        testEmpty.empty(true);
    });

    suite.add('node.invoke("getElementsByTagName", "div")', function() { 
        testNode.invoke('getElementsByTagName', 'div');
    });

}, '@VERSION@', {requires: ['node-core']});

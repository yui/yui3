YUI.add('tabview-benchmark', function (Y) {
    var suite = Y.BenchmarkSuite = new Benchmark.Suite();
        
    suite.add('new Y.TabView()', function() { 
        var tabview = new Y.TabView({
            children: [{
                label: 'foo',
                content: '<p>foo content</p>'
            }, {
                label: 'bar',
                content: '<p>bar content</p>'
            }, {
                label: 'baz',
                content: '<p>baz content</p>'
            }]
        });
    });

    suite.add('new Y.TabView().destroy', function() { 
        var tabview = new Y.TabView({
            children: [{
                label: 'foo',
                content: '<p>foo content</p>'
            }, {
                label: 'bar',
                content: '<p>bar content</p>'
            }, {
                label: 'baz',
                content: '<p>baz content</p>'
            }]
        }).destroy(true);
    });

}, '@VERSION@', {requires: ['tabview']});

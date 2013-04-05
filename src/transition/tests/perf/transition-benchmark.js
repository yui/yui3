YUI.add('transition-benchmark', function (Y) {
    var suite = Y.BenchmarkSuite = new Benchmark.Suite(),
        testNode = Y.one('#demo');

    suite.add('new Y.Transition()', function() { 
        new Y.Transition(demo, {
            width: 0,
            height: {
                value: 0,
                delay: 1
            },
            easing: 'ease-in',
            duration: 500,
            iterations: 10
        })
    });


}, '@VERSION@', {requires: ['transition']});

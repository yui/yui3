YUI.add('app-benchmark-model', function (Y, NAME) {

    var suite = Y.BenchmarkSuite = new Benchmark.Suite;
    
    // -- Y.Model ------------------------------------------------------------------
    suite.add('Y.Model: Instantiate a bare model', function () {
        var model = new Y.Model();
    });

    suite.add('Y.Model: Subclass and instantiate a bare model', function () {
        var MyModel = Y.Base.create('myModel', Y.Model, []),
            model   = new MyModel();
    });
    
}, '@VERSION@', {requires: ['app']});
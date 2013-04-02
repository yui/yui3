YUI.add('app-benchmark-view', function (Y, NAME) {

    var suite = Y.BenchmarkSuite = new Benchmark.Suite;

    // -- Y.View -------------------------------------------------------------------
    suite.add('Y.View: Instantiate a bare view', function () {
        var view = new Y.View();
    });

    suite.add('Y.View: Instantiate and subclass a bare view', function () {
        var MyView = Y.Base.create('myView', Y.View, []),
            view   = new MyView();
    });
    
}, '@VERSION@', {requires: ['app']});
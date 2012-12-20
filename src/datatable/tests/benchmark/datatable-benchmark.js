
YUI.add('datatable-benchmark', function (Y) {

    var suite = Y.BenchmarkSuite = new Benchmark.Suite();

    // -- Y.Datatable ------------------------------------------------------------------
    suite.add('Y.Datatable: Instantiate a bare datatable', function () {
        var dt = new Y.Datatable();
    });

    /**
    suite.add('Y.Model: Subclass and instantiate a bare model', function () {
        var MyModel = Y.Base.create('myModel', Y.Model, []),
            model   = new MyModel();
    });

    // -- Y.View -------------------------------------------------------------------
    suite.add('Y.View: Instantiate a bare view', function () {
        var view = new Y.View();
    });

    suite.add('Y.View: Instantiate and subclass a bare view', function () {
        var MyView = Y.Base.create('myView', Y.View, []),
            view   = new MyView();
    });
    //*/

}, '@VERSION@', {requires: ['datatable']});

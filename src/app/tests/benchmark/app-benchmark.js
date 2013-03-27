YUI.add('app-benchmark', function (Y, NAME) {

    var suite = Y.Benchmark.suite;
    
    // -- Y.Model ------------------------------------------------------------------
    suite.add({
        Y: Y,
        name: 'Y.Model: Instantiate a bare model', 
        fn: function () {
            var model = new Y.Model();
        }
    });

    suite.add({
        Y: Y,
        name: 'Y.Model: Subclass and instantiate a bare model', 
        fn: function () {
            var MyModel = Y.Base.create('myModel', Y.Model, []),
                model   = new MyModel();
        }
    });

    // -- Y.View -------------------------------------------------------------------
    suite.add({
        Y: Y,
        name: 'Y.View: Instantiate a bare view', 
        fn: function () {
            var view = new Y.View();
        }
    });

    suite.add({
        Y: Y,
        name: 'Y.View: Instantiate and subclass a bare view',
        fn: function () {
            var MyView = Y.Base.create('myView', Y.View, []),
                view   = new MyView();
        }
    });
    
}, '@VERSION@', {requires: ['app']});
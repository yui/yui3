YUI.add('app-benchmark-model', function (Y, NAME) {

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
    
}, '@VERSION@', {requires: ['app']});
var suite = new PerfSuite('Y.Model performance tests', {
    yui: {
        use: ['app']
    }
});

suite.add({
    'Y.Model: Instantiate a bare model': function () {
        var model = new Y.Model();
    },
    'Y.Model: Subclass and instantiate a bare model': function () {
        var MyModel = Y.Base.create('myModel', Y.Model, []),
            model   = new MyModel();
    }
});

var suite = new PerfSuite('Y.View performance tests', {
    yui: {
        use: ['app']
    }
});

suite.add({
    'Y.View: Instantiate a bare view': function () {
        var view = new Y.View();
    },
    'Y.View: Instantiate and subclass a bare view': function () {
        var MyView = Y.Base.create('myView', Y.View, []),
            view   = new MyView();
    }
});

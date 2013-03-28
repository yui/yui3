YUI.add('app-benchmark-view', function (Y, NAME) {

    var suite = Y.Benchmark.suite;

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
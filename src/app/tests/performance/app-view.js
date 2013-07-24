{
    title: 'Y.View performance tests',
    yui: {
        use: ['app']
    },
    tests: [
        {
            title: 'Y.View: Instantiate a bare view',
            fn: function () {
                var view = new Y.View();
            }
        },
        {
            title: 'Y.View: Instantiate and subclass a bare view',
            fn: function () {
                var MyView = Y.Base.create('myView', Y.View, []),
                    view   = new MyView();
            }
        }
    ]
}
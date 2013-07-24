{
    title: 'Y.Model performance tests',
    yui: {
        use: ['app']
    },
    tests: [
        {
            title: 'Y.Model: Instantiate a bare model',
            fn: function () {
                var model = new Y.Model();
            }
        },
        {
            title: 'Y.Model: Subclass and instantiate a bare model',
            fn: function () {
                var MyModel = Y.Base.create('myModel', Y.Model, []),
                    model   = new MyModel();
            }
        }
    ]
}

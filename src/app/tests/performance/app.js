module.exports = [
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
    },
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
];

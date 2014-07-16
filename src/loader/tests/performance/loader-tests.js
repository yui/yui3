var suite = new PerfSuite('Loader performance tests', {

    yui: {
        use: ['loader']
    },

    global: {
        setup: function () {
            var Y = YUI(),
                APP_META,
                name,
                i;

            APP_META = {
                groups: {
                    'kamen-rider': {
                        combine: true,
                        root: 'kamen/rider/'
                    }
                },
                require: [
                    'decade',
                    'w',
                    'ooo',
                    'fourze',
                    'wizard',
                    'gaim'
                ],
                modules: {}
            };

            for (i = 0; i < APP_META.require.length; i += 1) {
                name = APP_META.require[i];
                APP_META.modules[name] = {
                    name: name,
                    group: 'kamen-rider'
                };
            }
        }
    }

});

suite.add({
    'loader resolve core modules': function () {
        var require,
            loader;

        // A couple of the largest rollups. These result in 130 modules and 7
        // combo urls as of 2013-10-25.
        require = [
            'app',
            'charts',
            'datasource',
            'datatable'
        ];

        loader = new Y.Loader({
            combine: true,
            require: require
        });

        loader.resolve(true);
    },

    'loader resolve application modules': function () {
        var loader = new Y.Loader({
            combine: true,
            groups:  APP_META.groups,
            modules: APP_META.modules,
            require: APP_META.require
        });

        loader.resolve(true);
    },

    'caculate dependecies': function () {
        var loader = new Y.Loader({
            require: ['app', 'charts']
        });

        loader.calculate();
    },

    'loader constructor with global cache': function () {
        new Y.Loader({});
    },

    'loader constructor without cache': function () {
        YUI.Env._renderedMods = undefined;
        YUI.Env._conditions = undefined;
        new Y.Loader({});
    }

});

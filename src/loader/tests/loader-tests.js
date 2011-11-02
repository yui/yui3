YUI.add('loader-tests', function(Y) {
    
    var Assert = Y.Assert,
    testY = YUI();

    var testLoader = new Y.Test.Case({

        name: "Loader Tests",
        
        test_resolve_no_calc: function() {
            var loader = new testY.Loader({
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve();
            Assert.areEqual(0, out.js.length, 'JS files returned');
            Assert.areEqual(0, out.css.length, 'CSS files returned');
            
        },
        test_resolve_manual_calc: function() {
            var loader = new testY.Loader({
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            loader.calculate();
            var out = loader.resolve();
            Assert.isTrue((out.js.length > 0), 'NO JS files returned');
            Assert.isTrue((out.css.length > 0), 'NO CSS files returned');
        },
        test_resolve_auto_calc: function() {
            var loader = new testY.Loader({
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length > 0), 'NO JS files returned');
            Assert.isTrue((out.css.length > 0), 'NO CSS files returned');
        },
        test_resolve_combo: function() {
            var loader = new testY.Loader({
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length === 1), 'NO JS files returned');
            Assert.isTrue((out.css.length === 1), 'NO CSS files returned');
        },
        test_resolve_filter_debug: function() {
            var loader = new testY.Loader({
                filter: 'debug',
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length === 1), 'NO JS files returned');
            Assert.isTrue((out.css.length === 1), 'NO CSS files returned');
            Assert.isTrue((out.js[0].indexOf('-debug') > 0), 'Debug filter did not work');
        },
        test_resolve_filter_min: function() {
            var loader = new testY.Loader({
                filter: 'min',
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length === 1), 'NO JS files returned');
            Assert.isTrue((out.css.length === 1), 'NO CSS files returned');
            Assert.isTrue((out.js[0].indexOf('-min') > 0), 'Min filter did not work');
        },
        test_resolve_filter_raw: function() {
            var loader = new testY.Loader({
                filter: 'raw',
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length === 1), 'NO JS files returned');
            Assert.isTrue((out.css.length === 1), 'NO CSS files returned');
            Assert.isTrue((out.js[0].indexOf('-min') === -1), 'Raw filter did not work');
            Assert.isTrue((out.js[0].indexOf('-debug') === -1), 'Raw filter did not work');
        },
        test_resolve_combo_sep: function() {
            var loader = new testY.Loader({
                comboSep: '==!!==',
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length === 1), 'NO JS files returned');
            Assert.isTrue((out.css.length === 1), 'NO CSS files returned');
            Assert.isTrue((out.js[0].indexOf('&') === -1), 'comboSep did not work');
            Assert.isTrue((out.js[0].indexOf('==!!==') > 0), 'comboSep did not work');
        },
        test_resolve_filters: function() {
            var loader = new testY.Loader({
                filters: { 'node-base': 'debug' },
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length === 1), 'NO JS files returned');
            Assert.isTrue((out.css.length === 1), 'NO CSS files returned');
            Assert.isTrue((out.js[0].indexOf('node-base-debug.js') > 0), 'node-base-debug was not found');
            Assert.isTrue((out.js[0].indexOf('node-core-debug.js') === -1), 'node-core-debug was found');
        },
        test_group_filters: function() {
            var test = this;
        
        
            YUI({
                debug: true,
                filter: 'DEBUG',
                groups: {
                    local: {
                        filter: 'raw',
                        combine: false,
                        base: './assets/',
                        modules: {
                            foo: {
                                requires: [ 'node', 'widget' ]
                            }
                        }
                    }
                }
            }).use('foo', function(Y) {
                test.resume(function() {
                    Assert.isTrue(Y.Foo, 'Raw groups module did not load');
                });                
            });

            test.wait();

        },
	test_resolve_loadOptional: function() {
            var loader = new testY.Loader({
		combine: true,
		loadOptional: false,	
		loadOptionalCfg: { "autocomplete-sources": true, "controller": false},	
		require:['autocomplete-sources', "controller"]
            });
            var out = loader.resolve(true);

            Assert.isTrue((out.js.length === 1), 'NO JS files returned');
            Assert.isTrue((out.css.length === 1), 'NO CSS files returned');
            Assert.isTrue((out.js[0].indexOf('jsonp-min.js') > 0) 
			   && (out.js[0].indexOf('json-parse-min.js') > 0)
			   && (out.js[0].indexOf('io-base-min.js') > 0)
			   && (out.js[0].indexOf('yql-min.js') > 0)
			   && (out.js[0].indexOf('querystring-parse-min.js') === -1),
			 'loadoptionalCfg didn\'t work');
        }
    });

    Y.Test.Runner.add(testLoader);
});

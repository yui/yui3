YUI.add('config-test', function(Y) {

    
        var testCore = new Y.Test.Case({

            name: "Config tests",
            _should: {
                error: {
                    'test: YUI_config': (Y.UA.nodejs ? true : false)
                }
            },

            'test: YUI_config': function() {
                Y.Assert.isObject(YUI_config);
                Y.Assert.areEqual(YUI_config.gfilter, Y.config.filter);
                Y.Assert.isTrue(Y.config.gconfig);

                YUI().use('oop', function(Y2) {
                    Y.Assert.isUndefined(Y2.config.logExclude);
                    Y.Assert.isUndefined(Y2.config.filter);
                    Y.Assert.isTrue(Y2.config.gconfig);
                });
            },

            'test: local config': function() {
                Y.Assert.isObject(Y.config.logExclude);
            },
        
            test_config: function() {
                YUI().use('oop', function(Y2) {
                    Y.Assert.isUndefined(Y2.config.logExclude);
                    Y.Assert.isUndefined(Y2.config.filter);
                    Y.Assert.isTrue(Y2.config.globalConfig);
                });

                var o1 = { a: 1 };
                var o2 = { b: 1 };
                var o3 = { c: 1 };
                var o4 = { d: 1 };
                var o5 = { e: 1 };
                var o6 = { f: 1 };

                YUI(o1, o2, o3, o4, o5, o6).use('oop', function(Y2) {
                    Y.Assert.areEqual(1, Y2.config.f);
                    Y.Assert.isTrue(Y2.config.globalConfig);
                });
            }
        });

        Y.SeedTests.add(testCore);
    
});

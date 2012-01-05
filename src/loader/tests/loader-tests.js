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
            Assert.areSame(3, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
        },
        test_resolve_filter_debug: function() {
            var loader = new testY.Loader({
                filter: 'debug',
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.areSame(3, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
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
            Assert.areSame(3, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
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
            Assert.areSame(3, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
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
            Assert.areSame(3, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
            Assert.isTrue((out.js[0].indexOf('&') === -1), 'comboSep did not work');
            Assert.isTrue((out.js[0].indexOf('==!!==') > 0), 'comboSep did not work');
        },
        test_resolve_combo_sep_group: function() {
            var loader = new testY.Loader({
                comboSep: '==!!==',
                combine: true,
                ignoreRegistered: true,
                require: ['foo'],
                groups: {
                    extra: {
                        combine: true,
                        comboSep: '==;;==',
                        root: '',
                        base: '',
                        comboBase: 'http://secondhost.com/combo?',
                        modules: {
                            foo: {
                                requires: ['yql', 'bar']
                            },
                            bar: {
                                requires: ['dd']
                            }
                        }

                    }
                }
            });
            var out = loader.resolve(true);
            Assert.areSame(4, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(0, out.css.length, 'CSS Files returned more than expected');
            Assert.isTrue((out.js[0].indexOf('&') === -1), 'Main comboSep did not work');
            Assert.isTrue((out.js[0].indexOf('==!!==') > 0), 'Main comboSep did not work');
            Assert.isTrue((out.js[3].indexOf('&') === -1), 'Group comboSep did not work');
            Assert.isTrue((out.js[3].indexOf('==!!==') === -1), 'Group comboSep contains Main comboSep');
            Assert.isTrue((out.js[3].indexOf('==;;==') > 0), 'Group comboSep did not work');
        },
        test_resolve_maxurl_length: function() {
            var loader = new testY.Loader({
                maxURLLength: 1024,
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.areSame(3, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
        },
        test_resolve_maxurl_length_group: function() {
            var loader = new testY.Loader({
                combine: true,
                ignoreRegistered: true,
                require: ['foo'],
                groups: {
                    extra: {
                        combine: true,
                        maxURLLength: 45,
                        root: '',
                        base: '',
                        comboBase: 'http://secondhost.com/combo?',
                        modules: {
                            foo: {
                                requires: ['yql', 'bar']
                            },
                            bar: {
                                requires: ['dd']
                            }
                        }

                    }
                }
            });
            var out = loader.resolve(true);
            Assert.areSame(5, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(0, out.css.length, 'CSS Files returned more expected');
        },
        test_resolve_filters: function() {
            var loader = new testY.Loader({
                filters: { 'node-base': 'debug' },
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.areSame(3, out.js.length, 'JS Files returned more than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more than one');
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
        /* Commenting out until bug #2531436 get's completed.
        test_module_attrs: function() {
            var test = this;
        
            YUI({
                modules: {
                    'attrs-js': {
                        fullpath: './assets/attrs.js',
                        jsAttributes: {
                            id: 'attrs-js-test'
                        }
                    },
                    'attrs-css': {
                        fullpath: './assets/attrs.css',
                        type: 'css',
                        cssAttributes: {
                            id: 'attrs-css-test'
                        }
                    }
                }
            }).use('attrs-js', 'attrs-css', 'node', function(Y) {
                test.resume(function() {
                    Assert.isTrue(Y.davglass, 'Attrs JS did not load');
                    Assert.isNotNull(Y.one('#attrs-js-test'), 'attrs-js-test id was not found');
                    Assert.isNotNull(Y.one('#attrs-css-test'), 'attrs-css-test id was not found');
                });                
            });

            test.wait();
        },
        */
        test_iter: function() {
            var test = this;

            YUI({
                filter: 'debug',
                gallery: 'gallery-2010.08.04-19-46',
                '2in3': '4',
                'yui2': '2.9.0'
            }).use('node', 'base', 'gallery-port', 'yui2-yahoo', function(Y) {
                Assert.areEqual(Y.config.yui2, Y.YUI2.VERSION, 'Failed to load ' + Y.config.yui2);
                Assert.isFunction(Y.Base, 'Y.Base did not load');
                Assert.isUndefined(Y.LOADED, 'Callback executed twice.');
                Y.LOADED = true;
            });                                                                                                                                 
            
            YUI({
                filter: 'debug',
                gallery: 'gallery-2010.08.04-19-46',
                '2in3': '4',
                'yui2': '2.9.0'
            }).use('gallery-treeview', 'yui2-dom', function(Y) {
                test.resume(function() {
                    Assert.areEqual(Y.config.yui2, Y.YUI2.VERSION, 'Failed to load ' + Y.config.yui2);
                    Assert.isObject(Y.YUI2.util.Dom, 'YUI2 DOM did not load.');
                    Assert.isFunction(Y.apm.TreeView, 'Treeview gallery module did not load.');
                    Assert.isUndefined(Y.LOADED, 'Callback executed twice.');
                    Y.LOADED = true;
                });
            });                                                                                                                                 
            
            test.wait();
        },
        test_progress: function() {
            var test = this,
                proContext,
                counter = 0;

            YUI({
                '2in3': '4',
                'yui2': '2.9.0',
                onProgress: function(e) {
                    proContext = this;
                    if (e.name.indexOf('-ie') === -1) { //Weed out IE only modules
                        counter++;
                    }
                },
            }).use('gallery-bitly', 'yui2-editor', function(Y) {
                test.resume(function() {
                    Assert.areEqual(Y.config.yui2, Y.YUI2.VERSION, 'Failed to load ' + Y.config.yui2);
                    Assert.isTrue((counter > 2), 'Did not load enough files..');
                    Assert.areSame(proContext, Y, 'onProgress context does not match');
                    Assert.isUndefined(Y.LOADED, 'Callback executed twice.');
                    Assert.isObject(Y.YUI2.util.Dom, 'YUI2 DOM did not load.');
                    Assert.isFunction(Y.YUI2.widget.Editor, 'YUI2 Editor did not load.');
                    Assert.isFunction(Y.bitly, 'gallery-bitly did not load.');
                    Y.LOADED = true;
                });
            });

            test.wait();
        },
        test_condpattern: function() {
            var test = this;
            
            YUI({
                groups: {
                    testpatterns: {
                        patterns: {
                            modtest: {
                                test: function(mname) {
                                    return (mname === 'mod')
                                },
                                configFn: function(me) {
                                    me.fullpath = './assets/mod.js';
                                }
                            }
                        }
                    }
                }
            }).use('mod', function(Y) {
                test.resume(function() {
                    Assert.isTrue(Y.MOD, 'Pattern module failed to load');
                });
            });

            test.wait();
        },
        test_cond_with_test_function: function() {
            var test = this;
            
            YUI({
                modules: {
                    cond2: {
                        fullpath: './assets/cond2.js',
                        condition: {
                            trigger: 'jsonp',
                            test: function() {
                                return true;
                            }
                        }
                    }
                }
            }).use('jsonp', function(Y) {   
                test.resume(function() {
                    Assert.isTrue(Y.COND2, 'Conditional module failed to load with test function');
                });
            });

            test.wait();
        },
        test_cond_no_test_or_ua: function() {
            var test = this;
            
            YUI({
                modules: {
                    cond: {
                        fullpath: './assets/cond.js',
                        condition: {
                            trigger: 'yql'
                        }
                    }
                }
            }).use('yql', function(Y) {
                test.resume(function() {
                    Assert.isTrue(Y.COND, 'Conditional module failed to load with no test function or UA defined');
                });
            });

            test.wait();
        },
        test_css_stamp: function() {
            var test = this,
                links = document.getElementsByTagName('link').length + document.getElementsByTagName('style').length;

            YUI().use('cssgrids', 'dial', function(Y) {
                test.resume(function() {
                    var links2 = document.getElementsByTagName('link').length + document.getElementsByTagName('style').length;
                    Assert.areEqual(links, links2, 'A new link tag was injected into the page.');
                });
            });

            test.wait();

        },
        test_forcemap: function() {
            var test = this;

            var loader = new Y.Loader({
                ignoreRegistered: true,
                force   : ['yui-base'],
                require : ['json']
            });
            loader.calculate();

            Assert.areEqual(loader.sorted[0], 'yui-base', 'Forced yui-base was not included in loader.sorted');

        },
        test_global_mods: function() {
            var conf = {
                combine: false,
                require: ['widget-base'],
                ignoreRegistered: true // force loader to include modules already on the page
            },
            Loader1 = new Y.Loader(conf),
            Loader2 = new Y.Loader(conf),
            mods1 = Loader1.resolve(true),
            mods2 = Loader2.resolve(true);

            Assert.areEqual(mods1.css.length, mods2.css.length, 'CSS Modules are not equal in 2 loader instances');
            Assert.areEqual(1, mods1.css.length, 'CSS Mods #1 not equal 1');
            Assert.areEqual(1, mods2.css.length, 'CSS Mods #2 not equal 1');
        }
    });

    var suite = new Y.Test.Suite("Loader Automated Tests");
    suite.add(testLoader);
    Y.Test.Runner.add(suite);
    
});

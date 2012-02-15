YUI.add('loader-tests', function(Y) {
    
    var Assert = Y.Assert,
    testY = YUI();
    var ua = Y.UA;
    var jsFailure = !((ua.ie && ua.ie < 9) || (ua.opera && ua.opera < 11.6) || (ua.webkit && ua.webkit < 530.17));


    var testLoader = new Y.Test.Case({
        name: "Loader Tests",
        _should: {
            ignore: {
                'test_failure': !jsFailure,
                'test_timeout': !jsFailure
            }
        },       
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
            Assert.isTrue((out.js.length >=3), 'JS Files returned less than expected');
            Assert.isTrue((out.css.length >=1), 'CSS Files returned less than expected');
        },
        test_resolve_filter_debug: function() {
            var loader = new testY.Loader({
                filter: 'debug',
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length >= 3), 'JS Files returned more or less than expected');
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
            Assert.isTrue((out.js.length >=3), 'JS Files returned less than expected');
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
            Assert.isTrue((out.js.length >= 3), 'JS Files returned less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
            Assert.isTrue((out.js[0].indexOf('-min') === -1), 'Raw filter did not work');
            Assert.isTrue((out.js[0].indexOf('-debug') === -1), 'Raw filter did not work');
        },
        test_custom_filter: function() {
            var loader = new Y.Loader({
                filter: {
                    searchExp: 'JS&',
                    replaceStr: 'js+'
                },
                groups: {
                    mods: {
                        root: '',
                        base: '',
                        combine: true,
                        comboBase: 'http://test.com/?',
                        modules: {
                            'mods-actioninfos': {
                                path: 'actioninfos/actioninfos.JS'
                            },
                            'mods-test': {
                                path: 'test/test.JS',
                            }
                        }
                    }
                },
                require: ['mods-actioninfos', 'mods-test']
            });

            var out = loader.resolve(true);
            Assert.areEqual(1, out.js.length, 'Failed to combo request');
            Assert.areEqual('http://test.com/?actioninfos/actioninfos.js+test/test.JS', out.js[0], 'Failed to replace string in combo');
        },
        test_custom_filter_group: function() {
            var loader = new Y.Loader({
                groups: {
                    mods: {
                        filter: {
                            searchExp: 'JS&',
                            replaceStr: 'js+'
                        },
                        root: '',
                        base: '',
                        combine: true,
                        comboBase: 'http://test.com/?',
                        modules: {
                            'mods-actioninfos': {
                                path: 'actioninfos/actioninfos.JS'
                            },
                            'mods-test': {
                                path: 'test/test.JS',
                            }
                        }
                    }
                },
                require: ['mods-actioninfos', 'mods-test']
            });

            var out = loader.resolve(true);
            Assert.areEqual(1, out.js.length, 'Failed to combo request');
            Assert.areEqual('http://test.com/?actioninfos/actioninfos.js+test/test.JS', out.js[0], 'Failed to replace string in combo');
        },
        test_resolve_combo_sep: function() {
            var loader = new testY.Loader({
                comboSep: '==!!==',
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length >= 3), 'JS Files returned more or less than expected');
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
            Assert.isTrue((out.js.length >= 4), 'JS Files returned more or less than expected');
            Assert.areSame(0, out.css.length, 'CSS Files returned more than expected');
            Assert.isTrue((out.js[0].indexOf('&') === -1), 'Main comboSep did not work');
            Assert.isTrue((out.js[0].indexOf('==!!==') > 0), 'Main comboSep did not work');
            Assert.isTrue((out.js[out.js.length - 1].indexOf('&') === -1), 'Group comboSep did not work');
            Assert.isTrue((out.js[out.js.length - 1].indexOf('==!!==') === -1), 'Group comboSep contains Main comboSep');
            Assert.isTrue((out.js[out.js.length - 1].indexOf('==;;==') > 0), 'Group comboSep did not work');
        },
        test_resolve_maxurl_length: function() {
            var loader = new testY.Loader({
                maxURLLength: 1024,
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.isTrue((out.js.length >= 3), 'JS Files returned less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
        },
        test_resolve_maxurl_length_higher: function() {
            var loader = new testY.Loader({
                maxURLLength: 8024,
                combine: true,
                ignoreRegistered: true,
                require: ['node', 'dd', 'console']
            });
            var out = loader.resolve(true);
            Assert.areSame(1, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(1, out.css.length, 'CSS Files returned more or less than expected');
        },
        test_resolve_maxurl_length_too_low: function() {
            var loader = new testY.Loader({
                maxURLLength: 14,
                combine: true,
                ignoreRegistered: true,
                require: ['oop']
            });
            var out = loader.resolve(true);
            Assert.areSame(1, out.js.length, 'JS Files returned more or less than expected');
            Assert.areSame(0, out.css.length, 'CSS Files returned more or less than expected');
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
            Assert.isTrue((out.js.length >= 5), 'JS Files returned less than expected');
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
            Assert.isTrue((out.js.length >= 3), 'JS Files returned less than expected');
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
                                requires: [ 'oop' ]
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
        test_module_attrs: function() {
            var test = this;
        
            YUI({
                modules: {
                    'attrs-js': {
                        fullpath: './assets/attrs.js',
                        attributes: {
                            id: 'attrs-js-test'
                        }
                    },
                    'attrs-css': {
                        fullpath: './assets/attrs.css',
                        type: 'css',
                        attributes: {
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
        test_global_attrs: function() {
            var test = this;
        
            YUI({
                cssAttributes: {
                    'class': 'yui-css-module'
                },
                jsAttributes: {
                    'class': 'yui-js-module'
                },
                modules: {
                    'attrs2-js': {
                        fullpath: './assets/attrs.js'
                    },
                    'attrs2-css': {
                        fullpath: './assets/attrs.css'
                    }
                }
            }).use('attrs2-js', 'attrs2-css', 'node', function(Y) {
                test.resume(function() {
                    Assert.isNotNull(Y.one('.yui-js-module'), 'Failed to add classname to JS');
                    Assert.isNotNull(Y.one('.yui-css-module'), 'Failed to add classname to CSS');
                });                
            });

            test.wait();
        },
        test_iter: function() {
            var test = this;

            YUI({
                filter: 'debug',
                gallery: 'gallery-2010.08.04-19-46',
                '2in3': '4',
                'yui2': '2.9.0'
            }).use('base', 'gallery-port', 'yui2-yahoo', function(Y) {
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
                onSuccess: function(e) {
                    Assert.areEqual('success', e.msg, 'Failed to load files');
                    Assert.isTrue(e.success, 'Success handler failed');
                },
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
        test_failure: function() {
            var test = this,
                fMsg;

            YUI({
                onFailure: function(e) {
                    fMsg = e;
                },
                modules: {
                    'bogus-module': {
                        fullpath: './does/not/exist.js'
                    }
                }
            }).use('bogus-module', function(Y) {
                test.resume(function() {
                    var e = fMsg;
                    Assert.isFalse(e.success, 'Bogus module reported it was loaded');
                    Assert.areSame('Failed to load ./does/not/exist.js', e.msg, 'Failure event was not sent');
                });
            });

            test.wait();
            
        },
        test_timeout: function() {
            var test = this,
                fMsg;


            YUI({
                timeout: 1,
                onTimeout: function(e) {
                    Assert.isFalse(e.success, 'Bogus module reported it was loaded');
                    Assert.areSame('timeout', e.msg, 'Failure event was not sent');
                },
                modules: {
                    'bogus-module': {
                        fullpath: './does/not/exist.js'
                    }
                }
            }).use('bogus-module', function(Y) {
            });


            
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
        },
        test_skin_default: function() {
            var loader = new Y.Loader();

            Assert.areSame(loader.skin.defaultSkin, Y.Env.meta.skin.defaultSkin, 'Default skin was not set from default');
        },
        test_skin_string: function() {
            var loader = new Y.Loader({
                skin: 'night'
            });

            Assert.areSame(loader.skin.defaultSkin, 'night', 'Default skin was not set from string');
        },
        test_skin_object: function() {
            var loader = new Y.Loader({
                skin: {
                    defaultSkin: 'foobar'
                }
            });

            Assert.areSame(loader.skin.defaultSkin, 'foobar', 'Default skin was not set from object');
        },
        test_skin_overrides: function() {
            var loader = new Y.Loader({
                skin: {
                    overrides: {
                        slider: [
                            'sam',
                            'sam-dark',
                            'round',
                            'round-dark',
                            'capsule',
                            'capsule-dark',
                            'audio',
                            'audio-light'
                        ]
                    }
                },
                require: [ 'slider' ]
            });
            
            var out = loader.resolve(true);
            Assert.areSame(loader.skin.overrides.slider.length, out.css.length, 'Failed to load all override skins');
            
        },
        test_load_optional: function() {
            var loader = new Y.Loader({
                loadOptional: true,
                ignoreRegistered: true,
                require: [ 'dd-plugin' ]
            });

            var out = loader.resolve(true);
            var hasOptional = false;
            Y.each(out.jsMods, function(module) {
                if (module.name == 'dd-proxy') {
                    hasOptional = true;
                }
            });
            Assert.isTrue(hasOptional, 'Optional modules failed to load');
        },
        test_load_css_without_type: function() {
            var loader = new Y.Loader({
                combine: false,
                ignoreRegistered: true,
                modules: {
                    somecss: {
                        fullpath: './some/css/file.css'
                    }
                },
                require: [ 'somecss' ]
            });

            var out = loader.resolve(true);
            Assert.areEqual(0, out.js.length, 'JS Returned, should only return CSS');
            Assert.areEqual(1, out.css.length, 'Only one CSS module URL expected');
        },
        test_load_as_string: function() {
            var loader = new Y.Loader({
                combine: false,
                ignoreRegistered: true,
                modules: {
                    somecss: './some/css/file.css',
                    somejs: './some/js/file.js'
                },
                require: [ 'somecss', 'somejs' ]
            });

            var out = loader.resolve(true);
            Assert.areEqual(1, out.js.length, 'Only one JS module URL expected');
            Assert.areEqual(1, out.css.length, 'Only one CSS module URL expected');
        },
        test_combine_no_core_top_level: function() {
            /*
                I don't like this test, it's not EXACTLY how I would do it..
                This assumes that anything in the top level modules config
                is to not obey the combine parameter unless the module def
                contains the combine flag.

                Maybe this needs a new flag for combineTopLevel: true or something
                so that Loader can work stand-alone.
            */
            var loader = new Y.Loader({
                root: '',
                base: '',
                combine: true,
                comboBase: 'http://foobar.com/combo?',
                modules: {
                    foobar: {
                        combine: true,
                        type: 'js',
                        path: 'foo/foo.js',
                        requires: [ 'bar', 'baz' ]
                    },
                    baz: 'path/to/baz.js',
                    bar: 'bar.js',
                    somecss: 'my/css/files.css'
                },
                require: [ 'foobar', 'somecss' ]
            });

            var out = loader.resolve(true);
            Assert.areSame(3, out.js.length, 'Returned too many JS files');
            Assert.areSame(1, out.css.length, 'Returned too many CSS files');
            Assert.areSame('bar.js', out.js[0], 'Failed to serve single JS file properly');
            Assert.areSame('path/to/baz.js', out.js[1], 'Failed to serve single JS file properly');
            Assert.areSame('http://foobar.com/combo?foo/foo.js', out.js[2], 'Failed to combine manual JS file properly');
            Assert.areSame('my/css/files.css', out.css[0], 'Failed to serve single CSS file properly');
        
        },
        test_combine_no_core_group: function() {
            var loader = new Y.Loader({
                groups: {
                    local: {
                        root: '',
                        base: '',
                        combine: true,
                        comboBase: 'http://foobar.com/combo?',
                        modules: {
                            foobar: {
                                type: 'js',
                                path: 'foo/foo.js',
                                requires: [ 'bar', 'baz' ]
                            },
                            baz: {
                                path: 'path/to/baz.js',
                            },
                            bar: {
                                path: 'bar.js',
                            },
                            somecss: {
                                path: 'my/css/files.css'
                            }
                        }
                    }
                },
                require: [ 'foobar', 'somecss' ]
            });

            var out = loader.resolve(true);
            Assert.areSame(1, out.js.length, 'Returned too many JS files');
            Assert.areSame(1, out.css.length, 'Returned too many CSS files');
            Assert.areSame('http://foobar.com/combo?bar.js&path/to/baz.js&foo/foo.js', out.js[0], 'Failed to combine JS files properly');
            Assert.areSame('http://foobar.com/combo?my/css/files.css', out.css[0], 'Failed to combine CSS files properly');
        
        },
        test_outside_group: function() {
            var loader = new Y.Loader({
                combine: true,
                ignoreRegistered: true,
                require: [ 'gallery-calendar' ],
                groups: {
                    mygallery: {
                        base:'./js/yui-library/',
                        combine:true,
                        comboBase: '/yui/?',
                        root:'yui-library/',
                        modules: {
                            'gallery-calendar':{
                                requires: ['node-base','node-style','node-screen','calendar-skin']
                            }
                        }
                    },
                    outside: {
                        combine:false,
                        modules:{
                            'calendar-skin': {
                                fullpath: '/css/calendar-skin.css',
                                type:'css'
                            }
                        }
                    }
                }
            });

            var out = loader.resolve(true);

            Assert.areEqual(2, out.js.length, 'Number of JS modules is not correct');
            Assert.isTrue((out.jsMods.length > 1), 'Number of JS module data is not correct');
            Assert.areEqual(1, out.css.length, 'Number of CSS modules is not correct');

        },
        test_outside_nocombine: function() {
            var loader = new Y.Loader({
                combine: false,
                ignoreRegistered: true,
                require: [ 'gallery-calendar' ],
                groups: {
                    mygallery: {
                        base:'./js/yui-library/',
                        combine:true,
                        comboBase: '/yui/?',
                        root:'yui-library/',
                        modules: {
                            'gallery-calendar':{
                                requires: [ 'gallery-calendar2' ]
                            },
                            'gallery-calendar2':{
                                requires: [ 'gallery-calendar3' ]
                            },
                            'gallery-calendar3':{
                                requires: [ 'yui-base', 'oop' ]
                            }
                        }
                    }
                }
            });

            var out = loader.resolve(true);

            Assert.areEqual(3, out.js.length, 'Number of JS modules is not correct');
            Assert.isTrue((out.js[2].indexOf('/yui/?yui-library') === 0), 'Combo URL is not correct');
            Assert.isTrue((out.jsMods.length === 5), 'Number of JS module data is not correct');
            Assert.areEqual(0, out.css.length, 'Number of CSS modules is not correct');
            Assert.isTrue((out.js[0].indexOf('yahooapis') > 0), 'First JS file returned is not a YUI module');
            Assert.isTrue((out.js[0].indexOf('yui-base') > 0), 'First JS file is not the seed file');

        },
        test_submodules: function() {
            
            var loader = new Y.Loader({
                ignoreRegistered: true,
                combine: false,
                root: '',
                base: '',
                filter: 'raw',
                ignore: [ 'yui-base', 'intl-base', 'oop', 'event-custom-base', 'event-custom-complex', 'intl' ],
                modules: {
                    sub1: {
                        fullpath: './sub1.js',
                        submodules: {
                            subsub1: {
                            },
                            subsub2: {
                                lang: 'en',
                                skinnable: true
                            }
                        }
                    }
                },
                require: [ 'subsub2' ]
            });
            
            var out = loader.resolve(true);
            Assert.areSame('sub1/lang/subsub2.js', out.js[0], 'Failed to combine submodule with module path for LANG JS');
            Assert.areSame('sub1/subsub2.js', out.js[1], 'Failed to combine submodule with module path JS');
            Assert.areSame('sub1/assets/skins/sam/subsub2.css', out.css[0], 'Failed to combine submodule with module path CSS');
            Assert.areEqual(1, out.css.length, 'Failed to skin submodule');
        },
        test_plugins: function() {
            
            var loader = new Y.Loader({
                ignoreRegistered: true,
                combine: false,
                root: '',
                base: '',
                filter: 'raw',
                ignore: [ 'yui-base', 'intl-base', 'oop', 'event-custom-base', 'event-custom-complex', 'intl' ],
                modules: {
                    plug1: {
                        fullpath: './sub1.js',
                        plugins: {
                            subplug1: {
                                lang: 'en',
                                skinnable: true
                            },
                            subplug2: {
                                lang: 'en',
                                skinnable: true,
                                requires: [ 'subplug1' ]
                            }
                        }
                    }
                },
                require: [ 'subplug2' ]
            });
            
            var out = loader.resolve(true);
            Assert.areSame('plug1/lang/subplug2.js', out.js[0], 'Failed to combine plugin with module path LANG JS');
            Assert.areSame('plug1/lang/subplug1.js', out.js[1], 'Failed to combine plugin with module path LANG JS');
            Assert.areSame('plug1/subplug1.js', out.js[2], 'Failed to combine plugin with module path JS');
            Assert.areSame('plug1/subplug2.js', out.js[3], 'Failed to combine plugin with module path JS');

            Assert.areSame('plug1/assets/skins/sam/subplug1.css', out.css[0], 'Failed to combine plugin with module path CSS');
            Assert.areSame('plug1/assets/skins/sam/subplug2.css', out.css[1], 'Failed to combine plugin with module path CSS');
            Assert.areEqual(2, out.css.length, 'Failed to skin plugins');
        },
        test_fullpath_with_combine: function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
                combine: true,
                root: '',
                base: '',
                comboBase: 'http://my.combo.server.com/?',
                groups: {
                    test: {
                        combine: true,
                        modules: {
                            "fullpath-module": {
                                combine: false,
                                fullpath: "http://ryancannon.com/bugs/fullpath/fullpath.js"
                            }
                        }
                    }
                },
                require: [ 'oop', 'fullpath-module' ]
            });
            var out = loader.resolve(true);
            Assert.areEqual(2, out.js.length, 'Too many JS files returned');
            Assert.areEqual(out.js[0], 'http://ryancannon.com/bugs/fullpath/fullpath.js', 'Failed to return proper full path url');
            Assert.areEqual(out.js[1], 'http://my.combo.server.com/?yui-base/yui-base-min.js&oop/oop-min.js', 'Failed to return proper full path url');
        },
        test_load: function() {
            var test = this;

            var loader = new Y.Loader({
                ignoreRegistered: true,
                modules: {
                    loadmod: {
                        attributes: {
                            id: 'loadmod-test'
                        },
                        fullpath: './assets/mod.js'
                    }
                },
                require: ['loadmod']
            });
            loader.load(function() {
                test.resume(function() {
                    Assert.isNotNull(Y.one('#loadmod-test'), 'Failed to load module');
                });
            });
            
            test.wait();
        },
        test_async: function() {
            var test = this;

            var loader = new Y.Loader({
                ignoreRegistered: true,
                modules: {
                    loadmod2: {
                        async: false,
                        attributes: {
                            id: 'loadmod-test2'
                        },
                        fullpath: './assets/mod.js'
                    },
                    loadmod3: {
                        async: false,
                        attributes: {
                            id: 'loadmod-test3'
                        },
                        fullpath: './assets/mod.js'
                    },
                    loadmod4: {
                        async: true,
                        attributes: {
                            id: 'loadmod-test4'
                        },
                        fullpath: './assets/mod.js'
                    }
                },
                require: ['loadmod3', 'loadmod2', 'loadmod4']
            });
            loader.load(function() {
                test.resume(function() {
                    var node1 = Y.one('#loadmod-test2').getDOMNode(),
                        node2 = Y.one('#loadmod-test3').getDOMNode(),
                        node3 = Y.one('#loadmod-test4').getDOMNode();

                    Assert.isNotNull(node1, 'Failed to load module 1');
                    Assert.isNotNull(node2, 'Failed to load module 2');
                    Assert.isNotNull(node3, 'Failed to load module 3');

                    if (Y.Get._env.async) {
                        //This browser supports the async property, check it
                        Assert.isFalse(node1.async, 'Async flag on node1 was set incorrectly');
                        Assert.isFalse(node2.async, 'Async flag on node2 was set incorrectly');
                        Assert.isTrue(node3.async, 'Async flag on node3 was set incorrectly');
                    } else {
                        //The async attribute is still
                        Assert.isNull(node1.getAttribute('async'), 'Async flag on node1 was set incorrectly');
                        Assert.isNull(node2.getAttribute('async'), 'Async flag on node2 was set incorrectly');
                        Assert.isNotNull(node3.getAttribute('async'), 'Async flag on node3 was set incorrectly');
                    }
                });
            });
            
            test.wait();
            
        }
    });

    var suite = new Y.Test.Suite("Loader Automated Tests");
    suite.add(testLoader);
    Y.Test.Runner.add(suite);
    
});

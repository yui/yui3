YUI.add('loader-tests', function(Y) {

    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert,
        testY = YUI(),
        ua = Y.UA,
        jsFailure = !((ua.ie && ua.ie < 9) || (ua.opera && ua.compareVersions(ua.opera, 11.6) < 0) || (ua.webkit && ua.compareVersions(ua.webkit, 530.17) < 0));

    
    var resolvePath = function(p) {
        if (Y.UA.nodejs) {
            var path = require('path');
            p = path.join(__dirname, p);
        }
        return p;
    };


    var testLoader = new Y.Test.Case({
        name: "Loader Tests",
        _should: {
            ignore: {
                'test_failure': !jsFailure || Y.UA.nodejs,
                'test_timeout': !jsFailure || Y.UA.nodejs,
                test_module_attrs: Y.UA.nodejs,
                test_global_attrs: Y.UA.nodejs,
                test_iter: Y.UA.nodejs || Y.UA.winjs,
                test_progress: Y.UA.nodejs || Y.UA.winjs,
                'test: gallery skinnable': Y.UA.nodejs || Y.UA.winjs,
                test_load: Y.UA.nodejs,
                test_async: Y.UA.nodejs,
                test_css_stamp: Y.UA.nodejs,
                test_group_filters: Y.UA.nodejs,
                test_cond_no_test_or_ua: Y.UA.nodejs,
                test_condpattern: Y.UA.nodejs,
                test_cond_with_test_function: Y.UA.nodejs,
                'test external lang 1': Y.UA.nodejs,
                'testing fetchCSS false': !Y.config.win,
                'testing duplicate CSS loading': !Y.config.win,
                'test: mojito loader calculate bleeding over': (Y.UA.ie < 9)
            }
        },
        'test: skin overrides double loading': function() {
            var loader = new Y.Loader({
                base: './',
                modules:{
                        'gallery-fb-statusfield':{
                            fullpath: 'build_tmp/gallery-fb-statusfield-debug.js',
                            skinnable: true
                        }
                    },
                skin:{
                    overrides:{
                        'gallery-fb-statusfield': ['green']
                    }
                },
                require: ['gallery-fb-statusfield']
            });
            var out = loader.resolve(true);
            Assert.areSame('./gallery-fb-statusfield/assets/skins/green/gallery-fb-statusfield.css', out.css[0], 'Failed to load skin override');
            Assert.areEqual(1, out.css.length, 'Loaded too many css files');
        },
        'test: empty skin overrides': function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
                root: '',
                base: '',
                combine: true,
                comboBase: '/combo?',
                //So we can get a single response back to test against
                maxURLLength: 5000,
                skin: {
                    overrides: {
                        'widget-base': [],
                        'widget-stack': [],
                        'overlay': []
                    }
                },
                require: [ 'widget-base', 'widget-stack', 'overlay' ]
            });

            var out = loader.resolve(true);

            Assert.areEqual(0, out.css.length, 'Failed to override CSS skin files');
            Assert.isTrue((out.js[0].indexOf('widget-base') > -1), 'Failed to find the widget-base module in the JS');
            Assert.isTrue((out.js[0].indexOf('widget-stack') > -1), 'Failed to find the widget-stack module in the JS');
        },
        test_skin_overrides: function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
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
            //+1 here for widget skin
            Assert.areSame(loader.skin.overrides.slider.length + 1, out.css.length, 'Failed to load all override skins');
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
            Assert.isTrue((out.js.length >= 2), 'JS Files returned less than expected');
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
                                path: 'test/test.JS'
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
                                path: 'test/test.JS'
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
                require: ['foogg'],
                groups: {
                    extra: {
                        combine: true,
                        comboSep: '==;;==',
                        root: '',
                        base: '',
                        comboBase: 'http://secondhost.com/combo?',
                        modules: {
                            foogg: {
                                requires: ['yql', 'bargg']
                            },
                            bargg: {
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
                require: ['fooxx'],
                groups: {
                    extra: {
                        combine: true,
                        maxURLLength: 45,
                        root: '',
                        base: '',
                        comboBase: 'http://secondhost.com/combo?',
                        modules: {
                            fooxx: {
                                requires: ['yql', 'barxx']
                            },
                            barxx: {
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
                useSync: false,
                debug: true,
                filter: 'DEBUG',
                groups: {
                    local: {
                        filter: 'raw',
                        combine: false,
                        base: resolvePath('../assets/'),
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
                        fullpath: '../assets/attrs.js',
                        attributes: {
                            id: 'attrs-js-test'
                        }
                    },
                    'attrs-css': {
                        fullpath: '../assets/attrs.css',
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
                    'id': 'yui-id-css-module'
                },
                jsAttributes: {
                    'id': 'yui-id-js-module'
                },
                modules: {
                    'attrs2-js': {
                        fullpath: '../assets/attrs.js'
                    },
                    'attrs2-css': {
                        fullpath: '../assets/attrs.css'
                    }
                }
            }).use('attrs2-js', 'attrs2-css', 'node', function(Y) {
                test.resume(function() {
                    Assert.isNotNull(Y.one('#yui-id-js-module'), 'Failed to add id to JS');
                    Assert.isNotNull(Y.one('#yui-id-css-module'), 'Failed to add id to CSS');
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
                }
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
                    Assert.isObject(e.transaction, 'Failed to pass Get transaction object');
                    Assert.isArray(e.transaction.errors, 'Failed to pass Get transaction object with errors');
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
                useSync: false,
                groups: {
                    testpatterns: {
                        patterns: {
                            modtest: {
                                test: function(mname) {
                                    return (mname === 'mod');
                                },
                                configFn: function(me) {
                                    me.fullpath = resolvePath('../assets/mod.js');
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
                useSync: false,
                modules: {
                    cond2: {
                        fullpath: resolvePath('../assets/cond2.js'),
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
                useSync: false,
                modules: {
                    cond: {
                        fullpath: resolvePath('../assets/cond.js'),
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
        'test: conditional trigger is an array': function() {
            
            var loader = new Y.Loader({
                modules: {
                    test_one: {
                        fullpath: 'one.js'
                    },
                    test_two: {
                        fullpath: 'two.js'
                    },
                    cond_array: {
                        fullpath: 'cond_array.js',
                        condition: {
                            trigger: ['test_one', 'test_two']
                        }
                    }
                },
                require: ['test_one']
            });

            var out = loader.resolve(true);
            Assert.areEqual(2, out.js.length, 'Wrong number of files returned');
            Assert.areSame('one.js', out.js[0], 'Failed to load required module');
            Assert.areSame('cond_array.js', out.js[1], 'Failed to load conditional from trigger array');
        },
        'test: conditional module in array second module': function() {

            var loader = new Y.Loader({
                modules: {
                    test2_one: {
                        fullpath: '2one.js'
                    },
                    test2_two: {
                        fullpath: '2two.js'
                    },
                    test2_three: {
                        fullpath: '2three.js'
                    },
                    cond2_array: {
                        fullpath: '2cond_array.js',
                        condition: {
                            trigger: ['test2_one', 'test2_two']
                        }
                    }
                },
                require: ['test2_two']
            });

            var out = loader.resolve(true);
            Assert.areEqual(2, out.js.length, 'Wrong number of files returned (2)');
            Assert.areSame('2two.js', out.js[0], 'Failed to load required module (2)');
            Assert.areSame('2cond_array.js', out.js[1], 'Failed to load conditional from trigger array (2)');
        
        },
        'test: conditional array in modules not required': function() {
            var loader = new Y.Loader({
                modules: {
                    test3_one: {
                        fullpath: '3one.js'
                    },
                    test3_two: {
                        fullpath: '3two.js'
                    },
                    test3_three: {
                        fullpath: '3three.js'
                    },
                    cond3_array: {
                        fullpath: '3cond_array.js',
                        condition: {
                            trigger: ['test3_one', 'test3_two']
                        }
                    }
                },
                require: ['test3_three']
            });

            var out = loader.resolve(true);
            Assert.areEqual(1, out.js.length, 'Wrong number of files returned (3)');
            Assert.areSame('3three.js', out.js[0], 'Failed to load required module (3)');
            
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
        'testing duplicate CSS loading': function() {
            var test = this,
                links = document.getElementsByTagName('link'),
                sheets = document.getElementsByTagName('style'),
                holder = {
                    'console': 0,
                    'console-filters': 0,
                    'test-console': 0
                };
            
            Y.Array.each(links, function(item) {
                var href = item.href;
                if (/\/sam\/console\.css/.test(href)) {
                    holder['console']++;
                }
                if (/console-filters\.css/.test(href)) {
                    holder['console-filters']++;
                }
                if (/test-console\.css/.test(href)) {
                    holder['test-console']++;
                }
            });
            //Older Gecko's
            Y.Array.each(sheets, function(item) {
                var html = item.innerHTML;
                if (/\/sam\/console\.css/.test(html)) {
                    holder['console']++;
                }
                if (/console-filters\.css/.test(html)) {
                    holder['console-filters']++;
                }
                if (/test-console\.css/.test(html)) {
                    holder['test-console']++;
                }
            });
            Y.Object.each(holder, function(count, name) {
                Y.Assert.areEqual(1, count, 'Too many of ' + name + '.css');
            });
        },
        'testing fetchCSS false': function() {
            var test = this,
                links = document.getElementsByTagName('link').length + document.getElementsByTagName('style').length;

            YUI({
                fetchCSS: false
            }).use('panel', function(Y) {
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
            //
            //    I don't like this test, it's not EXACTLY how I would do it..
            //    This assumes that anything in the top level modules config
            //    is to not obey the combine parameter unless the module def
            //    contains the combine flag.
            //
            //    Maybe this needs a new flag for combineTopLevel: true or something
            //    so that Loader can work stand-alone.
            //
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
                                path: 'path/to/baz.js'
                            },
                            bar: {
                                path: 'bar.js'
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
                        fullpath: '../assets/mod.js'
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
                        fullpath: '../assets/mod.js'
                    },
                    loadmod3: {
                        async: false,
                        attributes: {
                            id: 'loadmod-test3'
                        },
                        fullpath: '../assets/mod.js'
                    },
                    loadmod4: {
                        async: true,
                        attributes: {
                            id: 'loadmod-test4'
                        },
                        fullpath: '../assets/mod.js'
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
                        Assert.isFalse(node1.async, '#1 Async flag on node1 was set incorrectly');
                        Assert.isFalse(node2.async, '#1 Async flag on node2 was set incorrectly');
                        Assert.isTrue(node3.async, '#1 Async flag on node3 was set incorrectly');
                    } else {
                        //The async attribute is still
                        if (Y.UA.ie && Y.UA.ie > 8 || Y.UA.opera) {
                            Assert.isTrue(node3.async, '#2 Async flag on node3 was set incorrectly');
                            Assert.isUndefined(node1.async, '#2 Async flag on node1 was set incorrectly');
                            Assert.isUndefined(node2.async, '#2 Async flag on node2 was set incorrectly');
                        } else {
                            Assert.isNull(node1.getAttribute('async'), '#3 Async flag on node1 was set incorrectly');
                            Assert.isNull(node2.getAttribute('async'), '#3 Async flag on node2 was set incorrectly');
                            Assert.isNotNull(node3.getAttribute('async'), '#3 Async flag on node3 was set incorrectly');

                        }
                    }
                });
            });

            test.wait();

        },
        'test: aliases config option': function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
                combine: true,
                aliases: {
                    dav: [ 'node' ],
                    davglass: [ 'dav' ]
                },
                require: [ 'davglass' ]
            });

            var out = loader.resolve(true);

            Assert.isTrue(out.js.length >= 1);
            Assert.isTrue(out.js[0].indexOf('node-core') > 0, 'Failed to load node-core');
            Assert.isTrue(out.js[0].indexOf('node-base') > 0, 'Failed to load node-base');

        },
        'test: aliases config option inside group': function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
                combine: true,
                groups: {
                    aliastest: {
                        aliases: {
                            dav2: [ 'node' ],
                            davglass2: [ 'dav2' ]
                        }
                    }
                },
                require: [ 'davglass2' ]
            });

            var out = loader.resolve(true);

            Assert.isTrue(out.js.length >= 1);
            Assert.isTrue(out.js[0].indexOf('node-core') > 0, 'Failed to load node-core');
            Assert.isTrue(out.js[0].indexOf('node-base') > 0, 'Failed to load node-base');

        },
        'test: addAlias': function() {

            var loader = new Y.Loader({
                ignoreRegistered: true,
                combine: true,
                comboBase: '/c?',
                root: '',
                maxURLLength: 4048
            });

            loader.addAlias([ 'node', 'dd' ], 'davdd');
            loader.require(['davdd']);

            var out = loader.resolve(true);

            Assert.isTrue(out.js.length >= 1);
            Assert.isTrue(out.js[0].indexOf('node-core') > 0, 'Failed to load node-core');
            Assert.isTrue(out.js[0].indexOf('node-base') > 0, 'Failed to load node-base');
            Assert.isTrue(out.js[0].indexOf('dd-drag') > 0, 'Failed to load dd-drag');

        },
        'test: gallery combo with custom server': function() {
            //TODO: in 3.6.0 this should not be required..
            var groups = YUI.Env[YUI.version].groups;

            var loader = new Y.Loader({
                ignoreRegistered: true,
                groups: groups,
                combine: true,
                root: '',
                comboBase: '/combo?',
                gallery: 'gallery-2010.08.04-19-46',
                require: [ 'gallery-noop-test' ]
            });

            var out = loader.resolve(true);
            Assert.isTrue((out.js[0].indexOf('yui.yahooapis.com') === -1), 'Combo URL should not contain yui.yahooapis.com URL');
            Assert.areSame('/combo?gallery-2010.08.04-19-46/build/gallery-noop-test/gallery-noop-test-min.js', out.js[0], 'Failed to return combo url for gallery module.');
        },
        'test: 2in3 combo with custom server': function() {
            //TODO: in 3.6.0 this should not be required..
            var groups = YUI.Env[YUI.version].groups;

            var loader = new Y.Loader({
                ignoreRegistered: true,
                groups: groups,
                combine: true,
                root: '',
                comboBase: '/combo?',
                '2in3': '4',
                'yui2': '2.9.0',
                require: [ 'yui2-foo' ] //Invalid module so we have no module data..
            });

            var out = loader.resolve(true);
            Assert.isTrue((out.js[0].indexOf('yui.yahooapis.com') === -1), 'Combo URL should not contain yui.yahooapis.com URL');
            Assert.areSame('/combo?2in3.4/2.9.0/build/yui2-foo/yui2-foo-min.js', out.js[0], 'Failed to return combo url for 2in3 module.');
        },
        'test: gallery skinnable': function() {
            var test = this,
                links = document.getElementsByTagName('link').length + document.getElementsByTagName('style').length;
            YUI({
                gallery: 'gallery-2012.03.23-18-00'
            }).use('gallery-accordion-horiz-vert', function(Y) {

                var links2 = document.getElementsByTagName('link').length + document.getElementsByTagName('style').length;
                test.resume(function() {
                    Assert.areEqual((links + 1), links2, 'Failed to load css for gallery module');
                });
            });
            test.wait();
        },
        'test: global async flag': function() {
            var loader = new Y.Loader({
                async: false
            });
            Assert.isFalse(loader.async, 'Failed to set async config option');

            var loader = new Y.Loader({});
            Assert.isTrue(loader.async, 'Failed to set default async config option');
        },
        'test: 2 loader instances with different skins': function() {
 
            var groups = {
                'foo': {
                    ext: false,
                    combine: true,
                    comboBase: '/comboBase?',
                    modules: {
                        'bar': {
                            'requires': [
                                'overlay',
                                'widget-autohide',
                                'array-extras',
                                'node-menunav',
                                'node-focusmanager'
                            ]
                        },
                        skinnable: true
                    },
                    root: ''
                }
            };

            var loader1, loader2, loader1resolved, loader2resolved;

            loader1 = new Y.Loader({
                base: '',
                combine: true,
                comboBase: '/comboBase?',
                ext: false,
                groups: groups,
                ignoreRegistered: true, // force loader to include modules already on the page
                require: ['bar'],
                root: '',
                skin: {
                  defaultSkin: 'sam'
                }
            });

            loader1resolved = loader1.resolve(true);

            loader2 = new Y.Loader({
                base: '',
                combine: true,
                comboBase: '/comboBase?',
                ext: false,
                groups: groups,
                ignoreRegistered: true, // force loader to include modules already on the page
                require: ['bar'],
                root: '',
                skin: {
                  defaultSkin: 'night'
                }
            });

            loader2resolved = loader2.resolve(true);

            Assert.isTrue((loader1resolved.css[0].indexOf('/sam/') > -1), '#1 Instance should have a sam skin');
            Assert.isTrue((loader2resolved.css[0].indexOf('/night/') > -1), '#2 Instance should have a night skin');
        },
        'test: multiple loaders, different resolve order': function() {
            var loader1, loader2, loader1resolved, loader2resolved,
                groups = {
                    'foo': {
                        ext: false,
                        combine: true,
                        comboBase: '/comboBase?',
                        modules: {
                            'bar': {
                                'requires': [
                                    'overlay',
                                    'widget-autohide',
                                    'array-extras',
                                    'node-menunav',
                                    'node-focusmanager'
                                ]
                            },
                            skinnable: true
                        },
                        root: ''
                    }
                };

            loader1 = new Y.Loader({
                base: '',
                combine: true,
                comboBase: '/comboBase?',
                ext: false,
                groups: groups,
                ignoreRegistered: true, // force loader to include modules already on the page
                require: ['bar'],
                root: '',
                skin: {
                  defaultSkin: 'sam'
                }
            });

            loader2 = new Y.Loader({
                base: '',
                combine: true,
                comboBase: '/comboBase?',
                ext: false,
                groups: groups,
                ignoreRegistered: true, // force loader to include modules already on the page
                require: ['bar'],
                root: '',
                skin: {
                    defaultSkin: 'night'
                }
            });

            loader1resolved = loader1.resolve(true);
            loader2resolved = loader2.resolve(true); 
        
            Assert.isTrue((loader1resolved.css[0].indexOf('/sam/') > -1), '#1 Instance should have a sam skin');
            Assert.isTrue((loader2resolved.css[0].indexOf('/night/') > -1), '#2 Instance should have a night skin');
        },
        'test: 2 loader instanced without shared module data': function() {

            var loader1, loader2, loader1resolved, loader2resolved;

            loader1 = new Y.Loader({
                base: '',
                combine: true,
                comboBase: '/comboBase?',
                ext: false,
                groups: {
                    'foo': {
                        ext: false,
                        combine: true,
                        comboBase: '/comboBase?',
                        modules: {
                            'bar': {
                                'requires': [
                                    'overlay',
                                    'widget-autohide',
                                    'array-extras',
                                    'node-menunav',
                                    'node-focusmanager'
                                ]
                            },
                            skinnable: true
                        },
                        root: ''
                    }
                },
                ignoreRegistered: true, // force loader to include modules already on the page
                require: ['bar'],
                root: '',
                skin: {
                    defaultSkin: 'sam'
                }
            });

            loader2 = new Y.Loader({
                base: '',
                combine: true,
                comboBase: '/comboBase?',
                ext: false,
                groups: {
                    'foo': {
                        ext: false,
                        combine: true,
                        comboBase: '/comboBase?',
                        modules: {
                            'bar': {
                                'requires': [
                                    'overlay',
                                    'widget-autohide',
                                    'array-extras',
                                    'node-menunav',
                                    'node-focusmanager'
                                ]
                            },
                            skinnable: true
                        },
                        root: ''
                    }
                },
                ignoreRegistered: true, // force loader to include modules already on the page
                require: ['bar'],
                root: '',
                skin: {
                    defaultSkin: 'night'
                }
            });

            loader1resolved = loader1.resolve(true);
            loader2resolved = loader2.resolve(true);

            Assert.isTrue((loader1resolved.css[0].indexOf('/sam/') > -1), '#1 Instance should have a sam skin');
            Assert.isTrue((loader2resolved.css[0].indexOf('/night/') > -1), '#2 Instance should have a night skin');

        },
        'test: cascade dependencies': function() {
            //helper method to get a named module from the meta
            var getMod = function(name) {
                var ret;
                Y.Array.each(out.jsMods, function(item) {
                    if (item.name === name) {
                        ret = item;
                    }
                });
                return ret;
            };

            var loader = new Y.Loader({
                requires: [ 'cas1', 'cas2' ],
                groups: {
                    casgroup1: {
                        requires: [ 'cas2mod1' ],
                        modules: {
                            cas1mod1: {
                                fullpath: 'cas1mod1.js'
                            }
                        }
                    },
                    casgroup2: {
                        modules: {
                            cas2mod1: {
                                fullpath: 'cas2mod1.js'
                            }
                        }
                    }
                },
                modules: {
                    cas1: {
                        fullpath: 'cas1.js',
                        requires: [ 'cas3' ]
                    },
                    cas2: {
                        fullpath: 'cas2.js',
                        requires: [ 'cas4' ]
                    },
                    cas3: {
                        fullpath: 'cas3.js'
                    },
                    cas4: {
                        fullpath: 'cas4.js'
                    }
                },
                require: [ 'cas1mod1' ]
            });

            var out = loader.resolve(true);
            
            Assert.areEqual(6, out.js.length, 'Failed to resolve all cascaded modules');
            
            ArrayAssert.itemsAreEqual(getMod('cas1').requires.sort(), ['cas1', 'cas2', 'cas3'], 'cas1');
            ArrayAssert.itemsAreEqual(getMod('cas2').requires.sort(), ['cas1', 'cas2', 'cas4'], 'cas2');
            ArrayAssert.itemsAreEqual(getMod('cas3').requires.sort(), ['cas1', 'cas2'], 'cas3');
            ArrayAssert.itemsAreEqual(getMod('cas4').requires.sort(), ['cas1', 'cas2'], 'cas4');
            
            ArrayAssert.itemsAreEqual(getMod('cas1mod1').requires.sort(), ['cas1', 'cas2', 'cas2mod1'], 'cas1mod1');
            ArrayAssert.itemsAreEqual(getMod('cas2mod1').requires.sort(), ['cas1', 'cas2'], 'cas2mod1');

        },
        'test: local lang file include': function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
                lang :["fr-FR","en-US"],
                modules : {
                    "my-module": {
                        combine : false,
                        lang: ["fr", "en"],
                        fullpath : 'scripts/my-module.js',
                        base : 'scripts/'
                    }
                },
                require: ['my-module']
            });
            var out = loader.resolve(true);
            var mod = out.js.pop();
            var lang = out.js.pop();
            Assert.areEqual('scripts/my-module.js', mod, 'Failed to resolve module');
            Assert.areEqual('scripts/my-module/lang/my-module_fr.js', lang, 'Failed to resolve local lang file');
        },
        'test: local lang file include in a group': function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
                lang :["fr-FR","en-US"],
                groups: {
                    'my-group-group': {
                        combine : false,
                        base : 'scripts/',
                        modules : {
                            "my-module-group": {
                                lang: ["fr", "en"],
                                fullpath : 'scripts/my-module.js'
                            }
                        }
                    }
                },
                require: ['my-module-group']
            });
            var out = loader.resolve(true);
            var mod = out.js.pop();
            var lang = out.js.pop();
            Assert.areEqual('scripts/my-module.js', mod, 'Failed to resolve module');
            Assert.areEqual('scripts/my-module-group/lang/my-module-group_fr.js', lang, 'Failed to resolve local lang file');
        },
        'test: local skin file include': function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
                modules : {
                    "my-module": {
                        combine : false,
                        fullpath : 'scripts/my-module.js',
                        base : 'scripts/',
                        skinnable: true
                    }
                },
                require: ['my-module']
            });
            var out = loader.resolve(true);
            Assert.areEqual('scripts/my-module.js', out.js[0], 'Failed to resolve module');
            Assert.areEqual('scripts/my-module/assets/skins/sam/my-module.css', out.css[0], 'Failed to resolve local skin file');
        },
        'test: local skin file include in a group': function() {
            var loader = new Y.Loader({
                ignoreRegistered: true,
                groups: {
                    'my-group-2': {
                        base : 'scripts/',
                        combine : false,
                        modules : {
                            "my-module-2": {
                                fullpath : 'scripts/my-module-2.js',
                                skinnable: true
                            }
                        }
                    }
                },
                require: ['my-module-2']
            });
            var out = loader.resolve(true);
            Assert.areEqual('scripts/my-module-2.js', out.js[0], 'Failed to resolve module');
            Assert.areEqual('scripts/my-module-2/assets/skins/sam/my-module-2.css', out.css[0], 'Failed to resolve local skin file');
        },
        'test: rootlang empty array': function() {
            var loader = new Y.Loader({
                combine: false,
                filter: "raw",
                lang: "en-GB",
                groups: {
                    "local": {
                        base: "./",
                        modules: {
                            "root-lang-fail": {
                                lang: []
                            },
                            "root-lang-win": {
                                lang: [""]
                            },
                            "de-lang": {
                                lang: ["de"]
                            }
                        }
                    }
                },
                ignoreRegistered: true,
                require: ["root-lang-fail", "root-lang-win", "de-lang"]
            });

            var out = loader.resolve(true),
                other = [];
            Y.Array.each(out.js, function(i) {
                if (i.indexOf('yahooapis') === -1) {
                    other.push(i);
                }
            });

            Assert.areEqual(6, other.length, 'Failed to resolve all modules and languages');
            var expected = [
                "./root-lang-fail/lang/root-lang-fail.js",
                "./root-lang-fail/root-lang-fail.js",
                "./root-lang-win/lang/root-lang-win.js",
                "./root-lang-win/root-lang-win.js",
                "./de-lang/lang/de-lang.js",
                "./de-lang/de-lang.js"
            ];
            ArrayAssert.itemsAreEqual(expected, other, 'Failed to resolve the proper modules');

        },
        'test: mojito loader calculate bleeding over': function() {
            var test = this,
                modules, required, expected, sorted,
                Y = YUI({ win: null, doc: null }),
                sort = function(modules, groupName, required) {
                    var loader;

                    //------------------------------------------------------------------------
                    // This is the workaround, which causes the tests to pass.
                    //delete YUI.Env._renderedMods;
                    //------------------------------------------------------------------------

                    loader = new Y.Loader({
                        ignoreRegistered: true
                    });
                    loader.addGroup({ modules: modules}, groupName);
                    loader.calculate({ required: required });
                    // not sure if we need to copy, but it can't hurt
                    return loader.sorted.slice();
                };

            Y.UA.nodejs = false;

            modules = {"mojito-analytics-addon-tests":{"requires":["mojito-analytics-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/analytics-tests.common.js"},"mojito-assets-addon-tests":{"requires":["mojito-assets-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/asset-tests.common.js"},"mojito-carrier-tests":{"requires":["mojito-carrier-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/carrier.common-test.js"},"mojito-composite-addon-tests":{"requires":["mojito-composite-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/composite-tests.common.js"},"mojito-config-addon-tests":{"requires":["mojito-config-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/config-tests.common.js"},"mojito-device-tests":{"requires":["mojito-device-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/device.common-test.js"},"mojito-i13n-tests":{"requires":["mojito-i13n-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/i13.common-tests.js"},"mojito-intl-addon-tests":{"requires":["mojito-intl-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/intl-tests.common.js"},"mojito-meta-addon-tests":{"requires":["mojito-meta-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/meta-tests.common.js"},"mojito-output-adapter-addon-tests":{"requires":["mojito-output-adapter-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/output-adapter-tests.common.js"},"mojito-params-addon-tests":{"requires":["mojito-params-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/params-tests.common.js"},"mojito-partial-addon-tests":{"requires":["mojito-partial-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/partial-tests.common.js"},"mojito-url-addon-tests":{"requires":["mojito-url-addon"],"fullpath":"/static/tests/autoload/app/addons/ac/url-tests.common.js"},"mojito-action-context-tests":{"requires":["mojito-action-context"],"fullpath":"/static/tests/autoload/app/autoload/action-context-tests.common.js"},"mojito-controller-context-tests":{"requires":["mojito-controller-context"],"fullpath":"/static/tests/autoload/app/autoload/controller-context-tests.common.js"},"mojito-dispatcher-tests":{"requires":["mojito-dispatcher"],"fullpath":"/static/tests/autoload/app/autoload/dispatch-tests.common.js"},"mojito-loader-tests":{"requires":["mojito-loader"],"fullpath":"/static/tests/autoload/app/autoload/loader-tests.common.js"},"mojito-logger-tests":{"requires":["mojito-logger"],"fullpath":"/static/tests/autoload/app/autoload/logger-tests.common.js"},"mojito-mojit-proxy-tests":{"requires":["mojito-mojit-proxy"],"fullpath":"/static/tests/autoload/app/autoload/mojit-proxy-tests.client.js"},"mojito-client-tests":{"requires":["mojito-client"],"fullpath":"/static/tests/autoload/app/autoload/mojito-client-tests.client.js"},"mojito-resource-store-adapter-tests":{"requires":["mojito-resource-store-adapter"],"fullpath":"/static/tests/autoload/app/autoload/resource-store-adapter-tests.common.js"},"mojito-rest-lib-tests":{"requires":["mojito-rest-lib"],"fullpath":"/static/tests/autoload/app/autoload/rest-tests.common.js"},"mojito-route-maker-tests":{"requires":["mojito-route-maker"],"fullpath":"/static/tests/autoload/app/autoload/route-maker-tests.common.js"},"mojito-view-renderer-tests":{"requires":["mojito-view-renderer"],"fullpath":"/static/tests/autoload/app/autoload/view-renderer-tests.common.js"},"mojito-analytics-addon":{"requires":["mojito-util","mojito-meta-addon"],"fullpath":"/static/mojito/addons/ac/analytics.common.js"},"mojito-assets-addon":{"requires":["mojito-util"],"fullpath":"/static/mojito/addons/ac/assets.common.js"},"mojito-composite-addon":{"requires":["mojito-util","mojito-params-addon"],"fullpath":"/static/mojito/addons/ac/composite.common.js"},"mojito-config-addon":{"requires":["mojito"],"fullpath":"/static/mojito/addons/ac/config.common.js"},"mojito-cookie-addon":{"requires":["cookie","mojito"],"fullpath":"/static/mojito/addons/ac/cookie.client.js"},"mojito-i13n-addon":{"requires":["mojito"],"fullpath":"/static/mojito/addons/ac/i13n.common.js"},"mojito-intl-addon":{"requires":["intl","datatype-date","mojito","mojito-config-addon"],"fullpath":"/static/mojito/addons/ac/intl.common.js"},"mojito-meta-addon":{"requires":["mojito-util","mojito-output-adapter-addon"],"fullpath":"/static/mojito/addons/ac/meta.common.js"},"mojito-output-adapter-addon":{"requires":["json-stringify","event-custom-base","mojito-view-renderer","mojito-util"],"fullpath":"/static/mojito/addons/ac/output-adapter.common.js"},"mojito-params-addon":{"requires":["mojito"],"fullpath":"/static/mojito/addons/ac/params.common.js"},"mojito-partial-addon":{"requires":["mojito-util","mojito-params-addon","mojito-view-renderer"],"fullpath":"/static/mojito/addons/ac/partial.common.js"},"mojito-url-addon":{"requires":["querystring-stringify-simple","mojito-route-maker","mojito-util"],"fullpath":"/static/mojito/addons/ac/url.common.js"},"mojito-mu":{"requires":["mojito-util","io-base"],"fullpath":"/static/mojito/addons/view-engines/mu.client.js"},"mojito-action-context":{"requires":["mojito-config-addon","mojito-output-adapter-addon","mojito-url-addon","mojito-assets-addon","mojito-cookie-addon","mojito-params-addon","mojito-composite-addon"],"fullpath":"/static/mojito/autoload/action-context.common.js"},"mojito-controller-context":{"requires":["mojito-action-context","mojito-util"],"fullpath":"/static/mojito/autoload/controller-context.common.js"},"mojito-dispatcher":{"requires":["mojito-controller-context","mojito-util","mojito-resource-store-adapter","intl"],"fullpath":"/static/mojito/autoload/dispatch.common.js"},"mojito-loader":{"requires":["get","mojito"],"fullpath":"/static/mojito/autoload/loader.common.js"},"mojito-logger":{"requires":["mojito"],"fullpath":"/static/mojito/autoload/logger.common.js"},"mojito-mojit-proxy":{"requires":["mojito-util"],"fullpath":"/static/mojito/autoload/mojit-proxy.client.js"},"mojito-client":{"requires":["io-base","event-delegate","node-base","querystring-stringify-simple","mojito","mojito-logger","mojito-loader","mojito-dispatcher","mojito-route-maker","mojito-client-store","mojito-resource-store-adapter","mojito-mojit-proxy","mojito-tunnel-client","mojito-output-handler","mojito-util"],"fullpath":"/static/mojito/autoload/mojito-client.client.js"},"mojito-test":{"requires":["mojito"],"fullpath":"/static/mojito/autoload/mojito-test.common.js"},"mojito":{"requires":["mojito-perf"],"fullpath":"/static/mojito/autoload/mojito.common.js"},"mojito-output-handler":{"requires":["mojito","json"],"fullpath":"/static/mojito/autoload/output-handler.client.js"},"mojito-perf":{"fullpath":"/static/mojito/autoload/perf.client.js"},"mojito-resource-store-adapter":{"requires":["mojito-util"],"fullpath":"/static/mojito/autoload/resource-store-adapter.common.js"},"mojito-rest-lib":{"requires":["io-base","mojito"],"fullpath":"/static/mojito/autoload/rest.common.js"},"mojito-route-maker":{"requires":["querystring-stringify-simple","querystring-parse","mojito-util"],"fullpath":"/static/mojito/autoload/route-maker.common.js"},"mojito-client-store":{"requires":["mojito-util","querystring-stringify-simple"],"fullpath":"/static/mojito/autoload/store.client.js"},"dali-bean":{"requires":["breg","oop","event-custom"],"fullpath":"/static/mojito/autoload/transport/beanregistry/dali_bean.client-optional.js"},"bean-performance-watcher":{"requires":["breg"],"fullpath":"/static/mojito/autoload/transport/beanregistry/performance_monitor.client-optional.js"},"breg":{"requires":["oop","event-custom"],"fullpath":"/static/mojito/autoload/transport/beanregistry/registry.client-optional.js"},"io-facade":{"requires":["breg","dali-bean"],"fullpath":"/static/mojito/autoload/transport/io_facade.client-optional.js"},"simple-request-formatter":{"requires":["breg"],"fullpath":"/static/mojito/autoload/transport/request_formatter.client-optional.js"},"request-handler":{"requires":["dali-bean","breg"],"fullpath":"/static/mojito/autoload/transport/request_handler.client-optional.js"},"requestor":{"requires":["json","breg"],"fullpath":"/static/mojito/autoload/transport/requestor.client-optional.js"},"response-formatter":{"requires":["breg"],"fullpath":"/static/mojito/autoload/transport/response_formatter.client-optional.js"},"response-processor":{"requires":["dali-bean","breg"],"fullpath":"/static/mojito/autoload/transport/response_processor.client-optional.js"},"dali-transport-base":{"requires":["event-custom","breg","dali-bean"],"fullpath":"/static/mojito/autoload/transport/transport.client-optional.js"},"transport-utils":{"requires":["breg"],"fullpath":"/static/mojito/autoload/transport/transport_utils.client-optional.js"},"mojito-tunnel-client":{"requires":["breg","querystring-stringify-simple","mojito","dali-transport-base","request-handler","simple-request-formatter","requestor","io-facade","response-formatter","response-processor"],"fullpath":"/static/mojito/autoload/tunnel.client-optional.js"},"mojito-util":{"requires":["mojito"],"fullpath":"/static/mojito/autoload/util.common.js"},"mojito-view-renderer":{"requires":["mojito"],"fullpath":"/static/mojito/autoload/view-renderer.common.js"},"LazyLoadBinderIndex":{"requires":["mojito-client","node","json"],"fullpath":"/static/LazyLoad/binders/index.js"},"LazyLoad":{"requires":["mojito","json"],"fullpath":"/static/LazyLoad/controller.common.js"}};
            required = {"mojito":true,"LazyLoadBinderIndex":true,"LazyLoad":true,"mojito-mu":true,"mojito-dispatcher":true };
            expected = ["mojito-perf","mojito","yui-base","oop","event-custom-base","intl-base","event-custom-complex","intl","querystring-stringify-simple","mojito-config-addon","json-stringify","mojito-view-renderer","mojito-util","mojito-output-adapter-addon","array-extras","querystring-parse","mojito-route-maker","mojito-url-addon","mojito-assets-addon","cookie","mojito-cookie-addon","mojito-params-addon","mojito-composite-addon","mojito-action-context","mojito-controller-context","mojito-resource-store-adapter","mojito-dispatcher","io-base","features","dom-core","dom-base","selector-native","selector","node-core","node-base","event-base","event-delegate","mojito-logger","get","mojito-loader","mojito-client-store","mojito-mojit-proxy","breg","dali-bean","dali-transport-base","request-handler","simple-request-formatter","json-parse","requestor","io-facade","response-formatter","response-processor","mojito-tunnel-client","mojito-output-handler","mojito-client","node-event-delegate","pluginhost-base","pluginhost-config","node-pluginhost","color-base","dom-style","dom-style-ie","dom-screen","node-screen","node-style","LazyLoadBinderIndex","LazyLoad","mojito-mu"];
            sorted = sort(modules, 'LazyLoad', required);
            ArrayAssert.itemsAreEqual(expected, sorted, 'Failed to calculate first set of modules');

            modules = {"ModelFlickr":{"requires":["yql","jsonp-url"],"fullpath":"/app/models/flickr.common.js"},"mojito-analytics-addon":{"requires":["mojito-util","mojito-meta-addon"],"fullpath":"/fw/addons/ac/analytics.common.js"},"mojito-assets-addon":{"requires":["mojito-util"],"fullpath":"/fw/addons/ac/assets.common.js"},"mojito-composite-addon":{"requires":["mojito-util","mojito-params-addon"],"fullpath":"/fw/addons/ac/composite.common.js"},"mojito-config-addon":{"requires":["mojito"],"fullpath":"/fw/addons/ac/config.common.js"},"mojito-cookie-addon":{"requires":["cookie","mojito"],"fullpath":"/fw/addons/ac/cookie.client.js"},"mojito-i13n-addon":{"requires":["mojito"],"fullpath":"/fw/addons/ac/i13n.common.js"},"mojito-intl-addon":{"requires":["intl","datatype-date","mojito","mojito-config-addon"],"fullpath":"/fw/addons/ac/intl.common.js"},"mojito-meta-addon":{"requires":["mojito-util","mojito-output-adapter-addon"],"fullpath":"/fw/addons/ac/meta.common.js"},"mojito-output-adapter-addon":{"requires":["json-stringify","event-custom-base","mojito-view-renderer","mojito-util"],"fullpath":"/fw/addons/ac/output-adapter.common.js"},"mojito-params-addon":{"requires":["mojito"],"fullpath":"/fw/addons/ac/params.common.js"},"mojito-partial-addon":{"requires":["mojito-util","mojito-params-addon","mojito-view-renderer"],"fullpath":"/fw/addons/ac/partial.common.js"},"mojito-url-addon":{"requires":["querystring-stringify-simple","mojito-route-maker","mojito-util"],"fullpath":"/fw/addons/ac/url.common.js"},"mojito-mu":{"requires":["mojito-util","io-base"],"fullpath":"/fw/addons/view-engines/mu.client.js"},"mojito-action-context":{"requires":["mojito-config-addon","mojito-output-adapter-addon","mojito-url-addon","mojito-assets-addon","mojito-cookie-addon","mojito-params-addon","mojito-composite-addon"],"fullpath":"/fw/autoload/action-context.common.js"},"mojito-controller-context":{"requires":["mojito-action-context","mojito-util"],"fullpath":"/fw/autoload/controller-context.common.js"},"mojito-dispatcher":{"requires":["mojito-controller-context","mojito-util","mojito-resource-store-adapter","intl"],"fullpath":"/fw/autoload/dispatch.common.js"},"mojito-loader":{"requires":["get","mojito"],"fullpath":"/fw/autoload/loader.common.js"},"mojito-logger":{"requires":["mojito"],"fullpath":"/fw/autoload/logger.common.js"},"mojito-mojit-proxy":{"requires":["mojito-util"],"fullpath":"/fw/autoload/mojit-proxy.client.js"},"mojito-client":{"requires":["io-base","event-delegate","node-base","querystring-stringify-simple","mojito","mojito-logger","mojito-loader","mojito-dispatcher","mojito-route-maker","mojito-client-store","mojito-resource-store-adapter","mojito-mojit-proxy","mojito-tunnel-client","mojito-output-handler","mojito-util"],"fullpath":"/fw/autoload/mojito-client.client.js"},"mojito-test":{"requires":["mojito"],"fullpath":"/fw/autoload/mojito-test.common.js"},"mojito":{"requires":["mojito-perf"],"fullpath":"/fw/autoload/mojito.common.js"},"mojito-output-handler":{"requires":["mojito","json"],"fullpath":"/fw/autoload/output-handler.client.js"},"mojito-perf":{"fullpath":"/fw/autoload/perf.client.js"},"mojito-resource-store-adapter":{"requires":["mojito-util"],"fullpath":"/fw/autoload/resource-store-adapter.common.js"},"mojito-rest-lib":{"requires":["io-base","mojito"],"fullpath":"/fw/autoload/rest.common.js"},"mojito-route-maker":{"requires":["querystring-stringify-simple","querystring-parse","mojito-util"],"fullpath":"/fw/autoload/route-maker.common.js"},"mojito-client-store":{"requires":["mojito-util","querystring-stringify-simple"],"fullpath":"/fw/autoload/store.client.js"},"mojito-util":{"requires":["mojito"],"fullpath":"/fw/autoload/util.common.js"},"mojito-view-renderer":{"requires":["mojito"],"fullpath":"/fw/autoload/view-renderer.common.js"},"LazyLoadBinderIndex":{"requires":["mojito-client","node","json"],"fullpath":"/LazyLoad/binders/index.js"},"LazyLoad":{"requires":["mojito","json"],"fullpath":"/LazyLoad/controller.common.js"}};
            required = {"mojito":true,"LazyLoadBinderIndex":true,"LazyLoad":true,"mojito-mu":true,"mojito-dispatcher":true};
            expected = ["mojito-perf","mojito","yui-base","oop","event-custom-base","intl-base","event-custom-complex","intl","querystring-stringify-simple","mojito-config-addon","json-stringify","mojito-view-renderer","mojito-util","mojito-output-adapter-addon","array-extras","querystring-parse","mojito-route-maker","mojito-url-addon","mojito-assets-addon","cookie","mojito-cookie-addon","mojito-params-addon","mojito-composite-addon","mojito-action-context","mojito-controller-context","mojito-resource-store-adapter","mojito-dispatcher","io-base","features","dom-core","dom-base","selector-native","selector","node-core","node-base","event-base","event-delegate","mojito-logger","get","mojito-loader","mojito-client-store","mojito-mojit-proxy","json-parse","mojito-output-handler","mojito-client","node-event-delegate","pluginhost-base","pluginhost-config","node-pluginhost","color-base","dom-style","dom-style-ie","dom-screen","node-screen","node-style","LazyLoadBinderIndex","LazyLoad","mojito-mu","mojito-tunnel-client"];
            sorted = sort(modules, 'LazyLoad', required);
            ArrayAssert.itemsAreEqual(expected, sorted, 'Failed to calculate second set of modules');

        },
        'testing configFn for bug #2532498': function() {
            var loader = new Y.Loader({
                    filter: "debug",
                    base: "build/yui/3.5.1/build/",
                    root: "",
                    combine: false,
                    maxURLLength: 2000,
                    fetchCSS: true,
                    lang: "en",
                    groups: {
                        sui: {
                            combine:  false,
                            base:   "build/",
                            modules: {
                                "part1-accordion": {
                                    "requires": [
                                        "part1-base"
                                    ]
                                },
                                "part1-base": {
                                    "requires": [
                                        "yui-base"
                                    ]
                                },
                                "part1-busyloader": {
                                    "requires": [
                                        "oop",
                                        "node",
                                        "event",
                                        "part1-base",
                                        "part1-util"
                                    ]
                                },
                                "part1-button": {
                                    "requires": [
                                        "oop",
                                        "part1-base",
                                        "part1-util"
                                    ]
                                },
                                "part1-chart-deprecated": {
                                    "requires": [
                                        "part1-base",
                                        "part1-util"
                                    ]
                                },
                                "part1-chart": {
                                    "requires": [
                                        "oop",
                                        "part1-busyloader",
                                        "json-stringify",
                                        "part1-page",
                                        "part1-util",
                                        "part1-xhr-datasource",
                                        "part1-init-configevent-provider",
                                        "part1-settings-ds-provider"
                                    ]
                                },
                                "part1-checkbox": {
                                    "requires": [
                                        "oop",
                                        "part1-select",
                                        "part1-util"
                                    ]
                                },
                                "part1-contentbox-element": {
                                    "requires": [
                                        "oop",
                                        "part1-element",
                                        "part1-init-configevent-provider",
                                        "part1-xhr-datasource"
                                    ]
                                },
                                "part1-contentbox": {
                                    "requires": [
                                        "oop",
                                        "part1-util",
                                        "part1-init-configevent-provider",
                                        "part1-settings-ds-provider",
                                        "part1-xhr-datasource"
                                    ]
                                },
                                "part1-datatable-expandable-provider": {
                                    "requires": [
                                        "part1-datatable",
                                        "part1-util"
                                    ]
                                },
                                "part1-datatable": {
                                    "requires": [
                                        "oop",
                                        "part1-init-configevent-provider",
                                        "part1-util",
                                        "part1-xhr-datasource",
                                        "part1-busyloader"
                                    ]
                                },
                                "part1-datatable-multilevel-provider": {
                                    "requires": [
                                        "part1-base",
                                        "part1-util"
                                    ]
                                },
                                "part1-datatable-paged": {
                                    "requires": [
                                        "oop",
                                        "node",
                                        "part1-datatable",
                                        "part1-util"
                                    ]
                                },
                                "part1-datatable-resize-provider": {
                                    "requires": [
                                        "part1-base"
                                    ]
                                },
                                "part1-datatable-sort-serverside-provider": {
                                    "requires": [
                                        "part1-base",
                                        "part1-util",
                                        "part1-xhr-datasource"
                                    ]
                                },
                                "part1-datatable-tree-expand-provider": {
                                    "requires": [
                                        "oop",
                                        "node",
                                        "part1-base",
                                        "part1-util",
                                        "part1-xhr-datasource",
                                        "part1-datatable"
                                    ]
                                },
                                "part1-datatable-tree-provider": {
                                    "requires": [
                                        "part1-base"
                                    ]
                                },
                                "part1-dialog-form-builder": {
                                    "requires": [
                                        "oop",
                                        "part1-layer",
                                        "part1-util",
                                        "part1-init-configevent-provider",
                                        "part1-validate",
                                        "part1-validate-control",
                                        "part1-busyloader",
                                        "part1-xhr-datasource"
                                    ]
                                },
                                "part1-dropdown-button": {
                                    "requires": [
                                        "oop",
                                        "node",
                                        "part1-base",
                                        "part1-dropdown",
                                        "part1-util",
                                        "part1-busyloader",
                                        "part1-treeview"
                                    ]
                                },
                                "part1-dropdown": {
                                    "requires": [
                                        "oop",
                                        "part1-util",
                                        "part1-busyloader",
                                        "part1-xhr-datasource",
                                        "part1-init-configevent-provider",
                                        "part1-settings-ds-provider"
                                    ]
                                },
                                "part1-dropdown-navi": {
                                    "requires": [
                                        "oop",
                                        "part1-dropdown",
                                        "part1-init-configevent-provider"
                                    ]
                                },
                                "part1-element": {
                                    "requires": [
                                        "oop",
                                        "part1-util",
                                        "part1-init-configevent-provider",
                                        "part1-settings-ds-provider"
                                    ]
                                },
                                "part1-elements-group": {
                                    "requires": [
                                        "oop",
                                        "part1-base",
                                        "part1-element",
                                        "part1-xhr-datasource",
                                        "part1-busyloader"
                                    ]
                                },
                                "part1-init-configevent-provider": {
                                    "requires": [
                                        "part1-base"
                                    ]
                                },
                                "part1-label": {
                                    "requires": [
                                        "oop",
                                        "part1-element",
                                        "part1-util",
                                        "part1-init-configevent-provider",
                                        "part1-xhr-datasource",
                                        "part1-busyloader"
                                    ]
                                },
                                "part1-lang-controller": {
                                    "requires": [
                                        "oop",
                                        "part1-base",
                                        "part1-util",
                                        "part1-init-configevent-provider",
                                        "part1-xhr-datasource",
                                        "part1-busyloader"
                                    ]
                                },
                                "part1-layer": {
                                    "requires": [
                                        "oop",
                                        "node",
                                        "event",
                                        "part1-util",
                                        "part1-xhr-datasource",
                                        "part1-init-configevent-provider",
                                        "part1-settings-ds-provider"
                                    ]
                                },
                                "part1-page": {
                                    "requires": [
                                        "oop",
                                        "event",
                                        "cookie",
                                        "node",
                                        "cookie",
                                        "part1-base",
                                        "part1-util",
                                        "part1-init-configevent-provider"
                                    ]
                                },
                                "part1-radio": {
                                    "requires": [
                                        "oop",
                                        "part1-select"
                                    ]
                                },
                                "part1-select": {
                                    "requires": [
                                        "oop",
                                        "part1-util",
                                        "part1-xhr-datasource",
                                        "part1-element",
                                        "part1-init-configevent-provider",
                                        "part1-busyloader"
                                    ]
                                },
                                "part1-selector-simple": {
                                    "requires": [
                                        "oop",
                                        "part1-dropdown"
                                    ]
                                },
                                "part1-settings-ds-provider": {
                                    "requires": [
                                        "part1-base",
                                        "part1-util"
                                    ]
                                },
                                "part1-textarea": {
                                    "requires": [
                                        "oop",
                                        "node",
                                        "part1-element",
                                        "part1-util",
                                        "part1-xhr-datasource",
                                        "part1-init-configevent-provider"
                                    ]
                                },
                                "part1-textnode": {
                                    "requires": [
                                        "oop",
                                        "part1-base"
                                    ]
                                },
                                "part1-treeview-json": {
                                    "requires": [
                                        "oop",
                                        "part1-util",
                                        "part1-treeview",
                                        "part1-busyloader",
                                        "part1-textnode"
                                    ]
                                },
                                "part1-treeview": {
                                    "requires": [
                                        "oop",
                                        "node",
                                        "part1-util",
                                        "part1-xhr-datasource",
                                        "part1-init-configevent-provider",
                                        "part1-settings-ds-provider",
                                        "part1-busyloader",
                                        "part1-textnode"
                                    ]
                                },
                                "part1-util": {
                                    "requires": [
                                        "json-parse",
                                        "part1-base",
                                        "part1-util",
                                        "part1-xhr-datasource",
                                        "part2-stacktrace"
                                    ]
                                },
                                "part1-validate-control": {
                                    "requires": [
                                        "part1-base",
                                        "part1-util",
                                        "part1-validate"
                                    ]
                                },
                                "part1-validate": {
                                    "requires": [
                                        "part1-base"
                                    ]
                                },
                                "part1-xhr-datasource": {
                                    "requires": [
                                        "event",
                                        "cookie",
                                        "part1-base"
                                    ]
                                },
                                "part1-test": {
                                    "requires": [
                                        "event",
                                        "cookie",
                                        "part1-base",
                                        "part1-util",
                                        "part1-treeview",
                                        "part1-treeview-json",
                                        "part1-xhr-datasource",

                                    ]
                                }
                            },
                            patterns: {
                                "part1-": {
                                    configFn: function (me) {
                                        //change from default format of part1-mod1/part1-mod1.js to just part1-mod1.js
                                        me.path = me.path.replace(/part1-[^\/]+\//, "");
                                    }
                                }
                            }
                        }
                    },
                require: ['part1-test']
            });

            var out = loader.resolve(true);
            var mods = [];
            Y.Array.each(out.js, function(i) {
                if (i.indexOf('build/yui') !== 0) {
                    mods.push(i);
                }
            });
            Y.Array.each(mods, function(item) {
                var len = item.split('/').length;
                Assert.areEqual(2, len, 'Failed to call configFn on ' + item);
            });
        },
        'test coverage filter': function() {
            var loader = new Y.Loader({
                root: '/',
                base: '/',
                coverage: ['yql'],
                ignoreRegistered: true,
                filter: 'coverage',
                require: ['node', 'yql']
            });
            Assert.isObject(loader.filters, 'filters object not created');
            Assert.isObject(loader.filters.yql, 'filters.yql object not created');
            Assert.areEqual(loader.filters.yql.replaceStr, '-coverage.js', 'Failed to create -coverage search string');
            Assert.areEqual(loader.filters.yql.searchExp, '-min\\.js', 'Failed to create -min replaceExp');
            var out = loader.resolve(true);
            var hasYQLCoverage = Y.Array.some(out.js, function(mod) {
                return (mod === '/yql/yql-coverage.js');
            });
            var hasOOPNoCoverage = Y.Array.some(out.js, function(mod) {
                return (mod === '/oop/oop.js');
            });
            Assert.isTrue(hasYQLCoverage, 'Failed to filter yql-coverage.js');
            Assert.isTrue(hasOOPNoCoverage, 'Failed to filter oop.js');
        },
        'test external lang 1': function() {
            var test = this;
            YUI({
                useSync: false,
                filter: 'raw',
                lang: ['en'],
                groups: {
                    test: {
                        base: resolvePath('../assets/'),
                        patterns: {
                            'test-': {              
                                configFn: function(me) {
                                    //Nothing here, used for pattern matching
                                }
                            }
                        }
                    }
                }
            }).use('test-payload-view', function(Y) {
                test.resume(function() {
                    Assert.isObject(Y.TEST, 'failed to load module');
                    var strings = Y.Intl.get('test-payload-view');
                    Assert.areEqual('It worked!', strings.TEST, 'Failed to resolve language pack');
                });
            });
            test.wait();
        }
    });
    
    var name = 'Loader';
    if (typeof TestName != 'undefined') {
        name = TestName;
    }

    var suite = new Y.Test.Suite(name);
    suite.add(testLoader);
    Y.Test.Runner.add(suite);


});

YUI.add('core-tests', function(Y) {

    /* {{{ Core URL Tests */
        var core_urls = {
            'http://localhost/build/yui/yui.js': { path: 'http://localhost/build/', filter: undefined },
            'http://localhost/build/yui/yui-debug.js': { path: 'http://localhost/build/', filter: 'debug' },
            'http://localhost/build/yui-base/yui-base.js': { path: 'http://localhost/build/', filter: undefined },
            'http://localhost/build/yui-base/yui-base-debug.js': { path: 'http://localhost/build/', filter: 'debug' },
            'http://combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base.js': { path: 'http://combohost.com/combo?/build/', filter: undefined },
            'http://combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base-debug.js': { path: 'http://combohost.com/combo?/build/', filter: 'debug' },
            'http://combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base.js&build/loader/loader.js': { path: 'http://combohost.com/combo?/build/', filter: undefined },
            'http://combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base-debug.js&buid/loader/loader.js': { path: 'http://combohost.com/combo?/build/', filter: 'debug' },
            'https://localhost/build/yui/yui.js': { path: 'https://localhost/build/', filter: undefined },
            'https://localhost/build/yui/yui-debug.js': { path: 'https://localhost/build/', filter: 'debug' },
            'https://localhost/build/yui-base/yui-base.js': { path: 'https://localhost/build/', filter: undefined },
            'https://localhost/build/yui-base/yui-base-debug.js': { path: 'https://localhost/build/', filter: 'debug' },
            'https://combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base.js': { path: 'https://combohost.com/combo?/build/', filter: undefined },
            'https://combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base-debug.js': { path: 'https://combohost.com/combo?/build/', filter: 'debug' },
            'https://combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base.js&build/loader/loader.js': { path: 'https://combohost.com/combo?/build/', filter: undefined },
            'https://combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base-debug.js&buid/loader/loader.js': { path: 'https://combohost.com/combo?/build/', filter: 'debug' },

            '/build/yui/yui.js': { path: '/build/', filter: undefined },
            '/build/yui/yui-debug.js': { path: '/build/', filter: 'debug' },
            '/build/yui-base/yui-base.js': { path: '/build/', filter: undefined },
            '/build/yui-base/yui-base-debug.js': { path: '/build/', filter: 'debug' },
            'build/simpleyui/simpleyui.js': { path: 'build/', filter: undefined },
            'build/simpleyui/simpleyui-debug.js': { path: 'build/', filter: 'debug' },
            'build/yui/yui.js': { path: 'build/', filter: undefined },
            'build/yui/yui-debug.js': { path: 'build/', filter: 'debug' },
            '//combohost.com/combo?foo/foo.js&bar-bar.js&/build/simpleyui/simpleyui.js&build/loader/loader.js': { path: '//combohost.com/combo?/build/', filter: undefined },
            '//combohost.com/combo?foo/foo.js&bar-bar.js&/build/simpleyui/simpleyui-debug.js&buid/oop/oop.js': { path: '//combohost.com/combo?/build/', filter: 'debug' },
            '//combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base.js': { path: '//combohost.com/combo?/build/', filter: undefined },
            '//combohost.com/combo?foo/foo.js&bar-bar.js&/build/yui-base/yui-base-debug.js': { path: '//combohost.com/combo?/build/', filter: 'debug' }
        };
    /* }}} */

    YUI.GlobalConfig = YUI.GlobalConfig || {};
    YUI.GlobalConfig.useSync = true;

    var resolvePath = function(p) {
        if (Y.UA.nodejs || typeof __dirname !== 'undefined') {
            var path = require('path');
            //Shifting up a dir, then back down since we live in assets and so does the include
            p = path.join(__dirname, '../', p);
        }
        return p;
    };

    var testCore = new Y.Test.Case({

        name: "Core tests",
        _should: {
            error: {
                test_attach_error: true,
                test_attach_error_errFn: true
            },
            ignore: {
                'getLocation() should return the location object': (Y.UA.nodejs ? true : false),
                'getLocation() should return `null` when executing in node.js': (!Y.UA.nodejs || (Y.UA.nodejs && Y.config.win)), //If there is a window object, ignore too
                test_log_params: (typeof console == "undefined" || !console.info || Y.UA.nodejs),
                'test: domready delay': !Y.config.win,
                'test: window.onload delay': !Y.config.win,
                'test: contentready delay': !Y.config.win,
                'test: available delay': !Y.config.win,
                'test: pattern requires order': !Y.config.win || Y.UA.winjs,
                'test: fetch with external dependencies redefined in external file': !Y.config.win,
                'test: double skin loading from seed': !Y.config.win,
                test_global_config: !Y.config.win,
                test_missed: !Y.config.win,
                'test: requirements defined in external module': !Y.config.win
            }
        },
        'test: double skin loading from seed': function() {
            var test = this,
                Assert = Y.Assert,
                ArrayAssert = Y.ArrayAssert,
                green = Y.Node.create('<div id="skin-test-green"/>'),
                sam = Y.Node.create('<div id="skin-test-sam"/>');

            Y.one('body').append(green);
            Y.one('body').append(sam);

            YUI({
                filter: 'raw',
                groups: {
                    skins: {
                        base: resolvePath('./assets/'),
                        modules: {
                            'skin-test': {
                                skinnable: true
                            }
                        }
                    }
                },
                skin: {
                    overrides:{
                        'skin-test': ['green']
                    }
                }
            }).use('skin-test', function(Y, status) {
                test.resume(function() {
                    var modules = status.data.sort();
                    Assert.isTrue(Y.SKIN_TEST, 'Failed to load external module');
                    Assert.areEqual('underline', green.getStyle('textDecoration').toLowerCase(), 'Green Skin Failed to Load');
                    Assert.areNotEqual('underline', sam.getStyle('textDecoration').toLowerCase(), 'Sam Skin Loaded');
                });
            });

            test.wait();
        },
        'test: pattern requires order': function() {
            var test = this,
            Assert = Y.Assert;
            //This test will throw if it fails..
            YUI({
                modules: {
                    'pattern-module': {
                        fullpath: './assets/pattern-module.js',
                        async: false
                    }
                }
            }).use('pattern-module', function(Y) {
                test.resume(function() {
                    Y.PatternModule();
                });
            });

            test.wait();
        },

        'cached functions should execute only once per input': function() {

            var r1 = "", r2 = "", r3 = "";

            var f1 = function(a) {
                r1 += a;
            };
            var c1 = Y.cached(f1);

            c1('a');
            c1('b');
            c1('a');
            c1('b');
            c1('a');
            c1('b');

            Y.Assert.areEqual('ab', r1);

            var f2 = function(a, b) {
                r2 += (a + b);
            };
            var c2 = Y.cached(f2);

            c2('a', 'b');
            c2('c', 'd');
            c2('a', 'b');
            c2('c', 'd');
            c2('a', 'b');
            c2('c', 'd');

            var o = new Y.EventTarget();
            o.foo = 1;

            var f3 = function(a) {
                Y.Assert.areEqual(1, this.foo);
                r3 += a;
            };

            var c3 = Y.cached(Y.bind(f3, o), {
                a: 'z'
            });

            c3('a');
            c3('b');
            c3('a');
            c3('b');
            c3('a');
            c3('b');

            Y.Assert.areEqual('b', r3);

            // falsy second arg needs to produce a different key than no second arg
            var cn = Y.ClassNameManager.getClassName;
            Y.Assert.areEqual('yui3-a-', cn('a', ''));
            Y.Assert.areEqual('yui3-a', cn('a'));

        },

        'getLocation() should return the location object': function () {
            Y.Assert.areSame(Y.config.win.location, Y.getLocation(), 'Did not return Y.config.win.location.');
        },

        'getLocation() should return `null` when executing in node.js': function () {
            Y.Assert.isNull(Y.getLocation(), 'Did not return `null`');
        },

        test_cached_undefined_null: function() {

            var f1 = function(a) {
                return a;
            };
            var c1 = Y.cached(f1);

            var a = c1(null);
            Y.Assert.areEqual(a, null);
            a = c1(undefined);
            Y.Assert.areEqual(a, undefined);
            a = c1('foo');
            Y.Assert.areEqual(a, 'foo');

        },
        test_guid: function() {
            var id, id2, i;
            for (i = 0; i < 1000; i++) {
                id = Y.guid();
                id2 = Y.guid();
                Y.Assert.areNotEqual(id, id2, 'GUID creation failed, ids match');
            }
        },
        test_stamp: function() {
            var id, id2, i;
            for (i = 0; i < 1000; i++) {
                id = Y.stamp({});
                id2 = Y.stamp({});
                Y.Assert.areNotEqual(id, id2, 'STAMP GUID creation failed, ids match');
            }
        },
        test_use_array: function() {
            var Assert = Y.Assert;
            YUI().use(['yui-throttle', 'oop'], function(Y) {
                Assert.isObject(Y.throttle, 'Throttle was not loaded');
                Assert.isObject(Y.each, 'OOP was not loaded');
            });
        },
        test_use_strings: function() {
            var Assert = Y.Assert;
            YUI().use('yui-throttle', 'oop', function(Y) {
                Assert.isObject(Y.throttle, 'Throttle was not loaded');
                Assert.isObject(Y.each, 'OOP was not loaded');
            });
        },
        test_one_submodule: function() {
            var Assert = Y.Assert;
            YUI({
                  modules:{
                      'something':{
                          'submodules':{
                              'something1':{
                                    fullpath: resolvePath('./assets/sub.js')
                              }
                          }
                      }
                  }
            }).use('something1', function(Y) {
                Assert.isTrue(Y.something1);
            });
        },
        test_base_path: function() {
            var Assert = Y.Assert;
            for (var i in core_urls) {
                var info = Y.Env.parseBasePath(i, Y.Env._BASE_RE);
                Assert.areSame(info.path, core_urls[i].path, 'Paths do not match (' + core_urls[i].path + ')');
                //This test is assuming that IE returns an undefined, but it actually returns an empty string for the property
                //Assert.areSame(info.filter, core_urls[i].filter, 'Filters do not match (' + core_urls[i].path + ')');
            }
        },
        test_log_params: function() {
            if (typeof console == "undefined" || !console.info) {
                return;
            }
            var l = console.info,
                Assert = Y.Assert,
                last;

            // Override all of the console functions so that we can check
            // their return values.
            console.error = console.log = console.warn = console.debug = console.info = function(str) {
                last = str.split(':')[0];
            };

            YUI().use(function (Y) {
                Y.applyConfig({
                    logInclude: {
                        logMe: true,
                        butNotMe: false
                    }
                });

                Y.log('test logInclude logMe','info','logMe');
                Assert.areEqual(last, 'logMe', 'logInclude (true) Failed');
                last = undefined;

                Y.log('test logInclude butNotMe','info','butNotMe');
                Assert.isUndefined(last, 'logInclude (false) Failed');

                Y.applyConfig({
                    logInclude: '',
                    logExclude: {
                        excludeMe: true,
                        butDontExcludeMe: false
                    }
                });
                Y.log('test logExclude excludeMe','info','excludeMe');
                Assert.isUndefined(last, 'excludeInclude (true) Failed');
                Y.log('test logExclude butDontExcludeMe','info','butDontExcludeMe');
                Assert.areEqual(last, 'butDontExcludeMe', 'logExclue (false) Failed');

                Y.applyConfig({
                    logInclude: {
                        davglass: true
                    },
                    logExclude: {
                        '': true
                    }
                });
                last = undefined;
                Y.log('This should be ignored', 'info');
                Assert.isUndefined(last, 'Failed to exclude log param with empty string');
                Y.log('This should NOT be ignored', 'info', 'davglass');
                Assert.areEqual(last, 'davglass', 'Failed to include log param');

                // Default logLevel is debug
                Y.applyConfig({
                    logInclude: {
                        'logleveltest': true
                    }
                });
                last = undefined;
                Y.log('This should be logged', 'debug', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'info', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');

                // Debug should also take effect when actively specified
                Y.applyConfig({
                    logLevel: 'debug'
                });
                last = undefined;
                Y.log('This should be logged', 'debug', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'info', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');

                // An invalid log level has the same effect as 'debug'
                Y.applyConfig({
                    logLevel: 'invalidloglevel'
                });
                last = undefined;
                Y.log('This should be logged', 'debug', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'info', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');

                Y.applyConfig({
                    logLevel: 'info'
                });
                last = undefined;
                Y.log('This should NOT be logged', 'debug', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold');
                last = undefined;
                Y.log('This should be logged', 'info', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');

                Y.applyConfig({
                    logLevel: 'warn'
                });
                last = undefined;
                Y.log('This should NOT be logged', 'debug', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold');
                last = undefined;
                Y.log('This should NOT be logged', 'info', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold');
                last = undefined;
                Y.log('This should be logged', 'warn', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
                last = undefined;
                Y.log('This should be logged', 'error', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');

                Y.applyConfig({
                    logLevel: 'error'
                });
                last = undefined;
                Y.log('This should NOT be logged', 'debug', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold');
                last = undefined;
                Y.log('This should NOT be logged', 'info', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold');
                last = undefined;
                Y.log('This should NOT be ignored', 'warn', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold');
                last = undefined;
                Y.log('This should NOT be ignored', 'error', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');

                Y.applyConfig({
                    logLevel: 'ERROR'
                });
                last = undefined;
                Y.log('This should NOT be logged', 'debug', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold - case insensitivty possibly ignored');
                last = undefined;
                Y.log('This should NOT be logged', 'info', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold - case insensitivty possibly ignored');
                last = undefined;
                Y.log('This should NOT be ignored', 'warn', 'logleveltest');
                Assert.isUndefined(last, 'Failed to exclude log level below threshold - case insensitivty possibly ignored');
                last = undefined;
                Y.log('This should NOT be ignored', 'error', 'logleveltest');
                Assert.areEqual(last, 'logleveltest', 'Failed to include log param');
            });
            console.info = l;
        },
        test_global_apply_config: function() {
            var Assert = Y.Assert,
                test = this;

            YUI.applyConfig({
                modules: {
                    davglass: {
                        fullpath: resolvePath('./assets/davglass.js')
                    }
                }
            });

            YUI.applyConfig({
                modules: {
                    foo: {
                        fullpath: resolvePath('./assets/foo.js')
                    }
                }
            });

            Assert.isObject(YUI.GlobalConfig, 'Global config not created');
            Assert.isObject(YUI.GlobalConfig.modules, 'modules object in global config not created');
            Assert.isObject(YUI.GlobalConfig.modules.davglass, 'First module in global config not created');
            Assert.isObject(YUI.GlobalConfig.modules.foo, 'Second module in global config not created');

        },
        test_old_config: function() {
            var Assert = Y.Assert,
                testY = YUI();

            testY._config({
                foo: true
            });

            Assert.isTrue(testY.config.foo, 'Old style config did not apply');
        },
        test_applyTo: function() {
            var Assert = Y.Assert,
                testY = YUI(),
                id = testY.id;

            testY.io = {
                xdrReady: function() {
                    Assert.areSame(id, this.id, 'Did not apply to the right instance');
                }
            };

            testY.foobar = function() {
                Assert.isTrue(false, 'testY.foobar should not have ever fired.');
            };

            YUI.applyTo(id, 'io.xdrReady', []); //Should call
            YUI.applyTo(id, 'io.xdrResponse', []); //Does not exist
            YUI.applyTo(id, 'foobar', []); //Should not call
            YUI.applyTo('1234567890', 'io.xdrReady', []); //Should not call since instance id is invalid
        },
        test_global_config: function() {
            var Assert = Y.Assert,
                test = this;
            
            YUI({useSync: false }).use('global-mod', function(Y) {
                test.resume(function() {
                    Assert.isTrue(Y.GlobalMod, 'Module in global config failed to load');
                });
            });

            test.wait(3000);
        },
        test_multiple_ua: function() {
            var Assert = Y.Assert,
                globalUA = YUI.Env.UA,
                uaFF = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:6.0) Gecko/20100101 Firefox/6.0',
                uaChrome = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.860.0 Safari/535.2';

            var Y1 = YUI();
            Assert.areEqual(globalUA.userAgent, Y1.UA.userAgent, 'Global UA and local (Y1) UA are different');

            var parsed = YUI.Env.parseUA(uaChrome);
            Assert.areEqual(parsed.userAgent, uaChrome, 'Parsed UA not equal Chrome');
            Assert.isTrue((parsed.chrome > 0), 'Parsed UA not equal Chrome');

            var Y2 = YUI();
            Assert.areEqual(globalUA.userAgent, Y2.UA.userAgent, 'Global UA and local (Y2) UA are different');


            Assert.areEqual(YUI.Env.UA.userAgent, Y2.UA.userAgent, 'Global UA and local (Y2) UA are different');

        },
        test_conditional: function() {
            var Assert = Y.Assert,
            test = this;

            YUI.add('cond', function(Y) {
                Y.cond = true;
            });

            YUI.add('cond-test', function(Y) {
                Y.condTest = true;
            });

            YUI({
                modules: {
                    'cond-test': {
                        condition: {
                            trigger: 'cond',
                            test: function() {
                                return true;
                            }
                        }                       
                    }
                }
            }).use('cond', function(Y2) {
                //Should be sync..
                Assert.isTrue(Y2.cond, 'Conditional module was not loaded.');
                Assert.isTrue(Y2.condTest, 'Conditional module was not loaded.');
            });
            
        },
        test_missed: function() {
            var Assert = Y.Assert;

            var testY = YUI().use('bogus');

            Assert.areSame(1, testY.Env._missed.length, 'Failed to error on bogus module');
            Assert.areSame('bogus', testY.Env._missed[0], 'Failed to error on bogus module');

            YUI.add('bogus', function(Y) { Y.bogus = true; });

            testY.use('bogus');

            Assert.areSame(0, testY.Env._missed.length, 'Failed to remove added bogus module');

        },
        test_attach_error: function() {
            //
            //    As of 3.6.0 this should now throw an error as the default
            //    setting throwFail: false will supress the error #2531679
            //
            var Assert = Y.Assert;
            YUI.add('attach-error', function() { Y.push(); });

            YUI({
                errorFn: function(str) {
                    Assert.isTrue(str.indexOf('attach-error') > -1, 'Failed to fire errorFn on attach error');
                    return true;
                }
            }).use('attach-error');
        },
        test_attach_error_silent: function() {
            //
            //    As of 3.6.0 this should NOT throw an error as
            //    setting throwFail: false will supress the error #2531679
            //
            var Assert = Y.Assert;
            YUI.add('attach-error', function() { Y.push(); });

            YUI({
                throwFail: false,
                errorFn: function(str) {
                    Assert.isTrue(str.indexOf('attach-error') > -1, 'Failed to fire errorFn on attach error');
                    return true;
                }
            }).use('attach-error');
        },
        test_attach_error_errFn: function() {
            //
            //    As of 3.6.0 this should throw an error as
            //    setting throwFail: false will supress the error and
            //    errorFn returns false see #2531679
            //
            var Assert = Y.Assert;
            YUI.add('attach-error', function() { Y.push(); });

            YUI({
                throwFail: false,
                errorFn: function(str) {
                    Assert.isTrue(str.indexOf('attach-error') > -1, 'Failed to fire errorFn on attach error');
                    return false;
                }
            }).use('attach-error');
        },
        test_dump_core: function() {
            var Assert = Y.Assert,
                o = {},
                testY = YUI();

            var str = testY.dump(o);
            Assert.isString(str, 'Default Y.dump failed to return a string');
        },
        test_destroy: function() {
            var Assert = Y.Assert,
                testY = YUI();
            
            testY.destroy();
            Assert.isUndefined(testY.Env, 'Environment not destroyed');
            Assert.isUndefined(testY.config, 'Instance config not destroyed');
        },
        test_features: function() {
            var Assert = Y.Assert,
                testY = YUI(),
                results = testY.Features.all('load', [testY]);

            Assert.isString(results, 'Feature tests failed to return a string');
            Assert.isTrue((results.length > 0), 'Feature tests failed to return results');
            Assert.areEqual(testY.Object.keys(testY.Features.tests.load).length, results.split(';').length, 'Failed to return all results for Feature Tests');
        },
        'test: requirements defined in external module': function() {
            var test = this,
                Assert = Y.Assert;

            YUI({
                useSync: false,
                modules: {
                    mod: {
                        fullpath: resolvePath('./assets/mod.js')
                    }
                }
            }).use('mod', function(Y) {
                test.resume(function() {
                    Assert.isTrue(Y.MOD, 'Failed to load external mod');
                    Assert.isObject(Y.YQL, 'Failed to load YQL requirement');
                });
            });

            test.wait();
        },
        'test: domready delay': function() {
            var test = this,
            Assert = Y.Assert;

            YUI({
                delayUntil: 'domready'
            }).use('node', function(Y, status) {
                test.resume(function() {
                    Assert.areSame('domready', status.delayUntil, 'domready did not trigger this callback');
                });
            });

            test.wait();
        },
        // This test does not require a `wait()` and `resume()` because it is
        // completely synchronous (i.e., `load` has already fired and `node`
        // has already loaded).
        'test: window.onload delay': function() {
            var Assert = Y.Assert;

            YUI({
                delayUntil: 'load'
            }).use('node', function(Y, status) {
                Assert.areSame('load', status.delayUntil, 'load did not trigger this callback');
            });
        },
        'test: available delay': function() {
            var test = this,
            Assert = Y.Assert;

            Assert.isNull(Y.one('#foobar'), 'Found trigger #foobar before it should have');

            setTimeout(function() {
                var div = document.createElement('div');
                div.id = 'foobar';
                document.body.appendChild(div);
            }, 3000);

            YUI({
                delayUntil: {
                    event: 'available',
                    args: '#foobar'
                }
            }).use('node', function(Y, status) {
                test.resume(function() {
                    Assert.isNotNull(Y.one('#foobar'), 'Failed to find trigger #foobar');
                    Assert.areSame('available', status.delayUntil, 'available did not trigger this callback');
                });
            });

            test.wait();
        },
        'test: contentready delay': function() {
            var test = this,
            Assert = Y.Assert;

            Assert.isNull(Y.one('#foobar2'), 'Found trigger #foobar2 before it should have');

            setTimeout(function() {
                var div = document.createElement('div');
                div.id = 'foobar2';
                document.body.appendChild(div);
            }, 3000);

            YUI({
                delayUntil: {
                    event: 'contentready',
                    args: '#foobar2'
                }
            }).use('node', function(Y, status) {
                test.resume(function() {
                    Assert.isNotNull(Y.one('#foobar2'), 'Failed to find trigger #foobar2');
                    Assert.areSame('contentready', status.delayUntil, 'contentready did not trigger this callback');
                });
            });

            test.wait();
        },
        'status should be true': function() {
            var test = this,
                Assert = Y.Assert;
                
                YUI().use('oop', function(Y, status) {
                    Assert.isTrue(status.success, 'Success callback failed');
                });

                YUI({
                    useSync: false,
                    modules: {
                        good: {
                            fullpath: resolvePath('./assets/good.js')
                        }
                    }
                }).use('good', function(Y, status) {
                    Assert.isTrue(Y.GOOD, 'Failed to load module');
                    Assert.isTrue(status.success, 'Status is good');
                });
        },
        'status should be false': function() {
            var test = this,
                Assert = Y.Assert;

            YUI().use('no-such-module', function(Y, status) {
                Assert.isFalse(status.success, 'Failed to set false on bad module');
                Assert.areSame(status.msg, 'Missing modules: no-such-module', 'Failed to set missing status');
                Y.use('no-such-module', function(Y, status) {
                    Assert.isFalse(status.success, 'Failed to set false on bad module');
                    Assert.areSame(status.msg, 'Missing modules: no-such-module', 'Failed to set missing status');
                });
            });
        },
        'test: fetch with external dependencies redefined in external file': function() {
            var test = this;
            Y.applyConfig({ useSync: true });
            Y.use('parallel', function() {
                var stack = new Y.Parallel();
                YUI.applyConfig({
                    useSync: true,
                    groups: {
                        'mygroup': {
                            base    : './assets/',
                            combine : false,
                            ext     : false,
                            root    : "",
                            patterns: { 
                                'mygroup-': {
                                    test: function(name) {
                                        return /^mygroup-/.test(name);
                                    },
                                    configFn: function(me) {
                                        var parts = me.name.split("-"),
                                            mygroup = parts.shift(),
                                            version = parts.pop(),
                                            name = parts.join("-"),
                                            cssname, jsname;
                                        if (name.match(/-css/)) {
                                            name = name.replace("-css", "");
                                            cssname = name + ".css";    
                                            me.type = 'css';
                                            me.path = [name, version, "assets", cssname].join("/");
                                        } else {
                                            jsname = name + '.js';
                                            me.path = [name, version, jsname].join("/");
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                YUI.add("lang/mygroup-util-1.4", function(Y) {
                    Y.Intl.add("mygroup-util-1.4", '', {
                            'test': 'CIAO CIAO CIAO'
                        });
                }, '1.4', {'requires': ['intl']});
                YUI.add("lang/mygroup-util-1.4_it", function(Y) {
                    Y.Intl.add("mygroup-util-1.4", 'it', {
                            'test': 'CIAO CIAO CIAO'
                        });
                }, '1.4', {'requires': ['intl']});
                YUI.add("lang/mygroup-util-1.4_en", function(Y) {
                    Y.Intl.add("mygroup-util-1.4", 'en', {
                            'test': 'HELLO HELLO HELLO'
                        });
                }, '1.4', {'requires': ['intl']});
                
                var results = [];
                YUI({ lang: '' }).use('mygroup-util-1.4', stack.add(function(Y) {
                    var t = Y.mygroup.test();
                    results[0] = t;
                }));
                YUI().use('mygroup-util-1.4', stack.add(function(Y) {
                    var t = Y.mygroup.test();
                    results[1] = t;
                }));
                YUI({ lang: 'it' }).use('mygroup-util-1.4', stack.add(function(Y) {
                    var t = Y.mygroup.test();
                    results[2] = t;
                }));
                YUI({ lang: 'en' }).use('mygroup-util-1.4', stack.add(function(Y) {
                    var t = Y.mygroup.test();
                    results[3] = t;
                }));
                stack.done(function() {
                    test.resume(function() {
                        var exp = ["CIAO CIAO CIAO", "HELLO HELLO HELLO", "CIAO CIAO CIAO", "HELLO HELLO HELLO"];
                        Y.ArrayAssert.itemsAreEqual(exp, results, 'Failed to load external dependencies');
                    });
                });
            
            });

            test.wait();
        },
        'test y.guid': function() {
            //I can't add tests for this because the API is screwed so I'm adding logical tests with my code update
            var time = new Date().getTime(),
                myY = YUI(),
                idx = myY.Env.yidx,
                version = '3.5.0-2pre+';
            //This is what Y.Env._guidp should be if Y.version is '3.5.0-2pre+'
            myY.Env._guidp = ('yui_' + version + '_' + idx + '_' + time).replace(/[^a-z0-9_]+/g, '_');
            Y.Assert.areEqual('yui_3_5_0_2pre__' + idx + '_' + time, myY.Env._guidp);
            Y.Assert.areEqual('yui_3_5_0_2pre__' + idx + '_' + time + '_2', myY.guid());
            Y.Assert.areEqual('yui_3_5_0_2pre__' + idx + '_' + time + '_3', myY.guid());
        },
        'test Y.config.global': function() {
            var global = Function('return this')();
            Y.Assert.areEqual(global, Y.config.global);
        }
    });

    Y.SeedTests.add(testCore);
});

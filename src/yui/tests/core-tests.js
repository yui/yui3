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

    var testCore = new Y.Test.Case({

        name: "Core tests",

        _should: {
            ignore: {
                'getLocation() should return the location object': Y.UA.nodejs,
                'getLocation() should return `undefined` when executing in node.js': !Y.UA.nodejs
            }
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

        'getLocation() should return `undefined` when executing in node.js': function () {
            Y.Assert.isUndefined(Y.getLocation(), 'Did not return `undefined`');
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

        test_ie_enum_bug: function() {
            var o = {
                valueOf: function() {
                    return 'foo';
                }
            },

            p = Y.merge(o);
            Y.Assert.areEqual('foo', p.valueOf());
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
            YUI().use(['dd', 'node'], function(Y) {
                Assert.isObject(Y.DD, 'DD was not loaded');
                Assert.isObject(Y.Node, 'Node was not loaded');
            });
        },
        test_use_strings: function() {
            var Assert = Y.Assert;
            YUI().use('dd', 'node', function(Y) {
                Assert.isObject(Y.DD, 'DD was not loaded');
                Assert.isObject(Y.Node, 'Node was not loaded');
            });
        },
        test_one_submodule: function() {
            var Assert = Y.Assert;
            YUI({
                  modules:{
                      'something':{
                          'submodules':{
                              'something1':{
                                    fullpath: './assets/sub.js'
                              }
                          }
                      }
                  }
            }).use('something1', function(Y) {
                Assert.isTrue(Y.something1);
            });
        },
        test_rollup_false: function() {
            var Assert = Y.Assert;
            YUI().use('dd', function(Y) {
                Assert.isUndefined(Y.Env._attached.dd, 'DD Alias Module was attached');
            });
            YUI().use('node', function(Y) {
                Assert.isUndefined(Y.Env._attached.node, 'Node Alias Module was attached');
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

            console.info = function(str) {
                last = str.split(':')[0];
            };

            YUI().use(function (Y) {
              Y.config.logInclude = {
                  logMe: true,
                  butNotMe: false
              };

              Y.log('test logInclude logMe','info','logMe');
              Assert.areEqual(last, 'logMe', 'logInclude (true) Failed');
              last = undefined;

              Y.log('test logInclude butNotMe','info','butNotMe');
              Assert.isUndefined(last, 'logInclude (false) Failed');

              Y.config.logInclude = '';
              Y.config.logExclude = {
                  excludeMe: true,
                  butDontExcludeMe: false
              };
              Y.log('test logExclude excludeMe','info','excludeMe');
              Assert.isUndefined(last, 'excludeInclude (true) Failed');
              Y.log('test logExclude butDontExcludeMe','info','butDontExcludeMe');
              Assert.areEqual(last, 'butDontExcludeMe', 'logExclue (false) Failed');

            });
            console.info = l;
        },
        test_loader_combo_sep: function() {
            var Assert = Y.Assert;

            var testY = YUI({
                debug: true,
                combine: true,
                comboSep: '--;;--'
            });
            var loader = new testY.Loader(testY.config);
            testY.Env._loader = loader;

            testY.Get.script = function(s) {
                var url = s[0];
                Assert.isTrue((url.indexOf(testY.config.comboSep) > 5), 'Combo seperator (' + testY.config.comboSep + ') was not used');
                testY._loading = false;
            };
            testY.use('editor');
        },
        test_global_apply_config: function() {
            var Assert = Y.Assert,
                test = this;

            YUI.applyConfig({
                modules: {
                    davglass: {
                        fullpath: './assets/davglass.js'
                    }
                }
            });

            YUI.applyConfig({
                modules: {
                    foo: {
                        fullpath: './assets/foo.js'
                    }
                }
            });

            Assert.isObject(YUI.GlobalConfig, 'Global config not created');
            Assert.isObject(YUI.GlobalConfig.modules, 'modules object in global config not created');
            Assert.isObject(YUI.GlobalConfig.modules.davglass, 'First module in global config not created');
            Assert.isObject(YUI.GlobalConfig.modules.foo, 'Second module in global config not created');

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

        }
    });

    Y.SeedTests.add(testCore);
});

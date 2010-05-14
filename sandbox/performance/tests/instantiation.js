YUI.add('perf-instantiation', function (Y) {

// Tests are defined in an object hash mapping test names to test objects. A
// test object may have the following properties, of which only the "test"
// property is required:
//
//   asyncSetup (Boolean):
//     By default, setup functions are assumed to be synchronous. Set this to
//     true to indicate that your setup function is asynchronous. This will
//     cause the test runner to wait for you to explicitly indicate completion
//     by calling done() from within the setup function.
//
//     You may optionally pass a value to done(). To indicate a setup failure,
//     pass false, and the test will be aborted (just as it would if you
//     returned false from a synchronous setup function).
//
//   bootstrapYUI (Boolean):
//     By default, all sandboxes are pristine. Set this to true to automatically
//     bootstrap YUI3 core and Loader into the test sandbox.
//
//   duration (Number):
//     Time duration in milliseconds during which the number of successful runs
//     will be counted when using time-based testing. Defaults to 1000 if not
//     specified.
//
//   iterations (Number):
//     Number of iterations to run when using iteration-based testing. Defaults
//     to 1 if not specified.
//
//   preloadUrls (Object):
//     Object hash of keys mapped to publicly-accessible URLs. Each URL will be
//     preloaded via a cross-domain YQL proxy, and its contents will be made
//     available to the setup/teardown/test functions as sandbox.preload.key,
//     where "key" is the same key that was used on the preloadUrls object.
//
//   setup (Function):
//     Setup function to execute before each iteration of the test. Runs in the
//     same sandbox as the test. If the setup function returns false, the test
//     will be aborted.
//
//   teardown (Function):
//     Teardown function to execute after each iteration of the test. Runs in
//     the same sandbox as the test.
//
//   test (Function):
//     The test itself, each iteration of which will be timed. The test function
//     must call done() when it's completely finished; until this happens, the
//     next test cannot run and the profile timer will keep ticking.
//
//   useStrictSandbox (Boolean):
//     By default, each test gets a single sandbox which is reused for all
//     iterations of that test. Set this to true if you want a brand new sandbox
//     to be created for each iteration of the test.
//
//   warmup (Boolean):
//     If this is true, the test will be run once (and timing data discarded) as
//     a warmup before the main iterations begin.
//
// Your test code in the setup, test, and teardown functions also has access to
// a special "sandbox" object, on which your test may get and set properties to
// share information with the test runner.
//
// The sandbox object contains the following utility methods:
//
//   log()
//     Sends a Y.log() call to the sandbox's parent window. All standard Y.log()
//     arguments and functionality apply.
//
//   xhrGet(url)
//     Performs a synchronous XMLHttpRequest on the specified URL and returns
//     the responseText. If the XHR call fails (for example, due to a
//     same-origin restriction or because the test is being run from the local
//     filesystem), null will be returned and a warning will be logged in the
//     parent window.

Y.Performance.addTestSuite('Instantiation Tests', {
    "YUI3: yui-min.js + loader-min.js parsing/execution": {
        duration: 500,
        iterations: 10,

        // Run each iteration in a new sandbox.
        useStrictSandbox: true,

        setup: function () {
            var yuiJS    = sandbox.xhrGet('../../build/yui/yui-min.js'),
                loaderJS = sandbox.xhrGet('../../build/loader/loader-min.js');

            if (yuiJS && loaderJS) {
                window.yuiScript = yuiJS + "\n" + loaderJS;
            } else {
                sandbox.log('Failed to load yui-min.js and/or loader-min.js.', 'warn', 'sandbox');
                return false;
            }
        },

        test: function () {
            eval(yuiScript);
            done();
        }
    },

    "YUI2: yuiloader-dom-event.js parsing/execution": {
        duration: 500,
        iterations: 10,
        useStrictSandbox: true,

        setup: function () {
            var yuiLoaderJS = sandbox.xhrGet('assets/yui2/yuiloader-dom-event.js');

            if (yuiLoaderJS) {
                window.yuiScript = yuiLoaderJS;
            } else {
                sandbox.log('Failed to load yuiloader-dom-event.js.', 'warn', 'sandbox');
                return false;
            }
        },

        test: function () {
            eval(yuiScript);
            done();
        }
    },

    "jQuery 1.4.2": {
        duration: 500,
        iterations: 10,
        useStrictSandbox: true,

        preloadUrls: {
            jquery: 'http://code.jquery.com/jquery-1.4.2.min.js'
        },

        setup: function () {
            // Make sure the JS was preloaded successfully.
            if (!sandbox.preload.jquery) {
                sandbox.log('Failed to load jquery.', 'warn', 'sandbox');
                return false;
            }
        },

        test: function () {
            eval(sandbox.preload.jquery);
            done();
        }
    },

    "YUI 3.1.1 jQueryish package w/ explicit dependencies + rollups + Loader": {
        duration: 500,
        iterations: 10,
        useStrictSandbox: true,
        warmup: true,

        preloadUrls: {
            yui: 'http://yui.yahooapis.com/combo?3.1.1/build/yui/yui-base-min.js&3.1.1/build/oop/oop-min.js&3.1.1/build/dom/dom-min.js&3.1.1/build/dom/selector-css3-min.js&3.1.1/build/yui/yui-later-min.js&3.1.1/build/event-custom/event-custom-min.js&3.1.1/build/io/io-base-min.js&3.1.1/build/event/event-min.js&3.1.1/build/pluginhost/pluginhost-min.js&3.1.1/build/node/node-min.js&3.1.1/build/io/io-form-min.js&3.1.1/build/querystring/querystring-stringify-simple-min.js&3.1.1/build/json/json-parse-min.js&3.1.1/build/yui/get-min.js&3.1.1/build/loader/loader-min.js&3.1.1/build/attribute/attribute-base-min.js&3.1.1/build/base/base-base-min.js&3.1.1/build/anim/anim-min.js'
        },

        setup: function () {
            // Make sure the JS was preloaded successfully.
            if (!sandbox.preload.yui) {
                sandbox.log('Failed to load YUI JS.', 'warn', 'sandbox');
                return false;
            }
        },

        test: function () {
            eval(sandbox.preload.yui);
            YUI().use('oop', 'yui-later', 'event-custom', 'event-base', 'dom', 'node-base', 'selector-css3', 'node-screen', 'node-style', 'event-delegate', 'event-focus', 'event-mouseenter', 'event-resize', 'node-event-delegate', 'attribute-base', 'base-base', 'anim-base', 'anim-easing', 'anim-scroll', 'anim-xy', 'io-base', 'io-form', 'querystring-stringify-simple', 'json-parse', function (Y) {
                done();
            });
        }
    },

    "YUI 3.1.1 jQueryish package w/ YUI().use('*'), no Loader, no bootstrap" : {
        duration: 500,
        iterations: 10,
        useStrictSandbox: true,

        preloadUrls: {
            yui: 'http://yui.yahooapis.com/combo?3.1.1/build/yui/yui-base-min.js&3.1.1/build/oop/oop-min.js&3.1.1/build/yui/yui-later-min.js&3.1.1/build/event-custom/event-custom-min.js&3.1.1/build/event/event-base-min.js&3.1.1/build/dom/dom-base-min.js&3.1.1/build/dom/selector-native-min.js&3.1.1/build/dom/selector-css2-min.js&3.1.1/build/node/node-base-min.js&3.1.1/build/dom/selector-css3-min.js&3.1.1/build/dom/dom-style-min.js&3.1.1/build/dom/dom-screen-min.js&3.1.1/build/node/node-screen-min.js&3.1.1/build/node/node-style-min.js&3.1.1/build/event/event-delegate-min.js&3.1.1/build/event/event-focus-min.js&3.1.1/build/event/event-mouseenter-min.js&3.1.1/build/event/event-resize-min.js&3.1.1/build/attribute/attribute-base-min.js&3.1.1/build/base/base-base-min.js&3.1.1/build/anim/anim-base-min.js&3.1.1/build/anim/anim-easing-min.js&3.1.1/build/anim/anim-scroll-min.js&3.1.1/build/anim/anim-xy-min.js&3.1.1/build/io/io-base-min.js&3.1.1/build/io/io-form-min.js&3.1.1/build/querystring/querystring-stringify-simple-min.js&3.1.1/build/json/json-parse-min.js&3.1.1/build/node/node-event-delegate-min.js'
        },

        setup: function () {
            // Make sure the JS was preloaded successfully.
            if (!sandbox.preload.yui) {
                sandbox.log('Failed to load YUI JS.', 'warn', 'sandbox');
                return false;
            }
        },

        test: function () {
            eval(sandbox.preload.yui);
            YUI({bootstrap: false}).use('*', function (Y) {
                done();
            });
        }
    },

    "YUI().use()": {
        bootstrapYUI: true,
        duration: 500,
        iterations: 40,

        test: function () {
            YUI().use(function (Y) {
                done();
            });
        }
    },

    // "YUI().use('anim', 'event', 'io', 'json', 'node')": {
    //     bootstrapYUI: true,
    //     duration: 1000,
    //     iterations: 40,
    //     warmup: true,
    //
    //     test: function () {
    //         YUI().use('anim', 'event', 'io', 'json', 'node', function (Y) {
    //             done();
    //         });
    //     }
    // },

    "Simple Y.Base extension + instantiation": {
        asyncSetup: true,
        bootstrapYUI: true,
        duration: 500,
        iterations: 40,

        setup: function () {
            window.Y = YUI().use('base', function (Y) {
                done();
            });
        },

        test: function () {
            function MyClass() {
                MyClass.superclass.constructor.apply(this, arguments);
            }

            Y.extend(MyClass, Y.Base);
            var foo = new MyClass();
            done();
        }
    },

    "Simple Y.Widget extension + instantiation (no DOM)": {
        asyncSetup: true,
        bootstrapYUI: true,
        duration: 500,
        iterations: 40,

        setup: function () {
            window.Y = YUI().use('widget', function (Y) {
                done();
            });
        },

        test: function () {
            function MyWidget() {
                MyWidget.superclass.constructor.apply(this, arguments);
            }

            MyWidget.NAME  = 'mywidget';
            MyWidget.ATTRS = {};

            Y.extend(MyWidget, Y.Widget, {
                renderUI: function () {},
                bindUI  : function () {},
                syncUI  : function () {}
            });

            var foo = new MyWidget();
            done();
        }
    },

    "TabView with 3 tabs": {
        bootstrapYUI: true,
        duration: 2000,
        iterations: 40,
        warmup: true,

        setup: function () {
            window.tabViewContainer = document.body.appendChild(
                    document.createElement('div'));
        },

        teardown: function () {
            document.body.removeChild(window.tabViewContainer);
        },

        test: function () {
            YUI().use('tabview', function(Y) {
                var tabview = new Y.TabView({
                    children: [{
                        label: 'foo',
                        content: '<p>foo content</p>'
                    }, {
                        label: 'bar',
                        content: '<p>bar content</p>'
                    }, {
                        label: 'baz',
                        content: '<p>baz content</p>'
                    }]
                });

                tabview.render(window.tabViewContainer);
                done();
            });
        }
    }
});

}, '@VERSION@', {requires: ['performance']});

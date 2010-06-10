YUI.add('perf-instantiation-yui3-git', function (Y) {

Y.Performance.addTestGroup({
    name   : 'YUI3 (git)',
    suite  : 'Instantiation Tests',
    version: '2010-06-10',

    tests: {
        "yui-min.js + loader-min.js parsing/execution": {
            duration: 500,
            iterations: 10,

            // Run each iteration in a new sandbox.
            useStrictSandbox: true,

            setup: function () {
                var js = sandbox.xhrGet('/combo/yui3-git?build/yui/yui-min.js&build/loader/loader-min.js');

                if (js) {
                    window.yuiScript = js;
                } else {
                    sandbox.log('Failed to load JS.', 'warn', 'sandbox');
                    return false;
                }
            },

            test: function () {
                eval(yuiScript);
                done();
            }
        }

/*
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
        }
*/
    }
});

}, '@VERSION@', {requires: ['performance']});

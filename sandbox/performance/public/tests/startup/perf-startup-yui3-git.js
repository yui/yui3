YUI.add('perf-startup-yui3-git', function (Y) {

Y.Performance.addTestGroup({
    name   : 'YUI3 (git)',
    suite  : 'Startup Tests',
    version: '2010-06-11',

    tests: {
        "Seed parsing/execution": {
            // This test loads the common seed package of yui-min.js +
            // loader-min.js.

            duration: 500,
            iterations: 10,

            // Run each iteration in a new sandbox.
            useStrictSandbox: true,

            preloadUrls: {
                js: '/combo/yui3-git?build/yui/yui-min.js&build/loader/loader-min.js'
            },

            test: function () {
                eval(sandbox.preload.js);
                done();
            }
        },

        "jQueryish package w/ explicit dependencies + rollups + Loader": {
            duration: 500,
            iterations: 10,
            useStrictSandbox: true,
            warmup: true,

            preloadUrls: {
                js: '/combo/yui3-git?build/yui/yui-base-min.js&build/oop/oop-min.js&build/dom/dom-min.js&build/dom/selector-css3-min.js&build/yui/yui-later-min.js&build/event-custom/event-custom-min.js&build/io/io-base-min.js&build/event/event-min.js&build/pluginhost/pluginhost-min.js&build/node/node-min.js&build/io/io-form-min.js&build/querystring/querystring-stringify-simple-min.js&build/json/json-parse-min.js&build/yui/get-min.js&build/loader/loader-min.js&build/attribute/attribute-base-min.js&build/base/base-base-min.js&build/anim/anim-min.js'
            },

            test: function () {
                eval(sandbox.preload.js);
                YUI().use('oop', 'yui-later', 'event-custom', 'event-base', 'dom', 'node-base', 'selector-css3', 'node-screen', 'node-style', 'event-delegate', 'event-focus', 'event-mouseenter', 'event-resize', 'node-event-delegate', 'attribute-base', 'base-base', 'anim-base', 'anim-easing', 'anim-scroll', 'anim-xy', 'io-base', 'io-form', 'querystring-stringify-simple', 'json-parse', function (Y) {
                    done();
                });
            }
        },

        "jQueryish package w/ YUI().use('*'), no Loader, no bootstrap" : {
            duration: 500,
            iterations: 10,
            useStrictSandbox: true,

            preloadUrls: {
                js: '/combo/yui3-git?build/yui/yui-base-min.js&build/oop/oop-min.js&build/yui/yui-later-min.js&build/event-custom/event-custom-min.js&build/event/event-base-min.js&build/dom/dom-base-min.js&build/dom/selector-native-min.js&build/dom/selector-css2-min.js&build/node/node-base-min.js&build/dom/selector-css3-min.js&build/dom/dom-style-min.js&build/dom/dom-screen-min.js&build/node/node-screen-min.js&build/node/node-style-min.js&build/event/event-delegate-min.js&build/event/event-focus-min.js&build/event/event-mouseenter-min.js&build/event/event-resize-min.js&build/attribute/attribute-base-min.js&build/base/base-base-min.js&build/anim/anim-base-min.js&build/anim/anim-easing-min.js&build/anim/anim-scroll-min.js&build/anim/anim-xy-min.js&build/io/io-base-min.js&build/io/io-form-min.js&build/querystring/querystring-stringify-simple-min.js&build/json/json-parse-min.js&build/node/node-event-delegate-min.js'
            },

            test: function () {
                eval(sandbox.preload.js);
                YUI({bootstrap: false}).use('*', function (Y) {
                    done();
                });
            }
        },

        "YUI().use()": {
            duration: 500,
            iterations: 40,

            preloadUrls: {
                js: '/combo/yui3-git?build/yui/yui-min.js&build/loader/loader-min.js'
            },

            setup: function () {
                eval(sandbox.preload.js);
                window.YUI = YUI;
            },

            test: function () {
                YUI().use(function (Y) {
                    done();
                });
            }
        },

        "jQuery 1.4.2": {
            duration: 500,
            iterations: 10,
            useStrictSandbox: true,
        
            preloadUrls: {
                js: 'http://code.jquery.com/jquery-1.4.2.min.js'
            },
        
            test: function () {
                eval(sandbox.preload.js);
                done();
            }
        }
    }
});

}, '@VERSION@', {requires: ['performance']});

YUI.add('perf-startup-yui3-3.1.1', function (Y) {

Y.Performance.addTestGroup({
    name   : 'YUI3 (3.1.1)',
    suite  : 'Startup Tests',
    version: '2010-08-02',

    tests: {
        "Seed parse/eval": {
            // This test loads the common seed package of yui-min.js +
            // loader-min.js.

            duration: 500,
            iterations: 10,

            preloadUrls: {
                js: '/combo/yui3-3.1.1?build/yui/yui-min.js&build/loader/loader-min.js'
            },

            test: function () {
                eval(sandbox.preload.js);
                done();
            }
        },

        "Empty YUI().use()": {
            duration: 500,
            iterations: 10,

            preloadUrls: {
                js: '/combo/yui3-3.1.1?build/yui/yui-min.js&build/loader/loader-min.js'
            },

            setup: function () {
                if (!window.YUI) {
                    eval(sandbox.preload.js);
                    window.YUI = YUI;
                }
            },

            test: function () {
                YUI().use(function (Y) {
                    done();
                });
            }
        },

        "YUI().use('*'), no bootstrap": {
            duration: 500,
            iterations: 10,

            preloadUrls: {
                js: '/combo/yui3-3.1.1?build/yui/yui-min.js&build/oop/oop-min.js&build/event-custom/event-custom-min.js&build/dom/dom-min.js&build/event/event-min.js&build/attribute/attribute-min.js&build/pluginhost/pluginhost-min.js&build/base/base-min.js&build/node/node-min.js&build/anim/anim-min.js&build/json/json-min.js&build/io/io-min.js'
            },

            setup: function () {
                if (!window.YUI) {
                    eval(sandbox.preload.js);
                    window.YUI = YUI;
                }
            },

            test: function () {
                YUI({bootstrap: false}).use('*', function (Y) {
                    done();
                });
            }
        },

        "YUI().use('node')": {
            duration: 500,
            iterations: 10,

            preloadUrls: {
                js: 'combo/yui3-3.1.1?build/yui/yui-min.js&build/loader/loader-min.js'
            },

            setup: function () {
                if (!window.YUI) {
                    eval(sandbox.preload.js);
                    window.YUI = YUI;
                }
            },

            test: function () {
                YUI({
                    comboBase: '/combo/yui3-3.1.1?',
                    combine  : true,
                    root     : 'build/'
                }).use('node', function (Y) {
                    done();
                });
            }
        },

        "Nested YUI().use() from seed": {
            duration: 500,
            iterations: 10,

            // Run a warmup iteration first to factor out the network load time
            // of the dependencies.
            warmup: true,

            preloadUrls: {
                js: '/combo/yui3-3.1.1?build/yui/yui-min.js&build/loader/loader-min.js'
            },

            setup: function () {
                if (!window.YUI) {
                    eval(sandbox.preload.js);
                    window.YUI = YUI;
                }
            },

            test: function () {
                YUI({
                    comboBase: '/combo/yui3-3.1.1?',
                    combine  : true,
                    root     : 'build/'
                }).use('node', function(Y) { 
                    Y.use('widget', function() {
                        Y.use('console', function() {
                            Y.use('slider', function() {
                                Y.use('widget-parent', function() {
                                    done();
                                });
                            });
                        });
                    });
                });
            }
        },

        "jQueryish package w/ explicit dependencies + rollups + Loader": {
            duration: 500,
            iterations: 10,
            // warmup: true,

            preloadUrls: {
                js: '/combo/yui3-3.1.1?build/yui/yui-base-min.js&build/oop/oop-min.js&build/dom/dom-min.js&build/dom/selector-css3-min.js&build/yui/yui-later-min.js&build/event-custom/event-custom-min.js&build/io/io-base-min.js&build/event/event-min.js&build/pluginhost/pluginhost-min.js&build/node/node-min.js&build/io/io-form-min.js&build/querystring/querystring-stringify-simple-min.js&build/json/json-parse-min.js&build/yui/get-min.js&build/loader/loader-min.js&build/attribute/attribute-base-min.js&build/base/base-base-min.js&build/anim/anim-min.js'
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

            preloadUrls: {
                js: '/combo/yui3-3.1.1?build/yui/yui-base-min.js&build/oop/oop-min.js&build/yui/yui-later-min.js&build/event-custom/event-custom-min.js&build/event/event-base-min.js&build/dom/dom-base-min.js&build/dom/selector-native-min.js&build/dom/selector-css2-min.js&build/node/node-base-min.js&build/dom/selector-css3-min.js&build/dom/dom-style-min.js&build/dom/dom-screen-min.js&build/node/node-screen-min.js&build/node/node-style-min.js&build/event/event-delegate-min.js&build/event/event-focus-min.js&build/event/event-mouseenter-min.js&build/event/event-resize-min.js&build/attribute/attribute-base-min.js&build/base/base-base-min.js&build/anim/anim-base-min.js&build/anim/anim-easing-min.js&build/anim/anim-scroll-min.js&build/anim/anim-xy-min.js&build/io/io-base-min.js&build/io/io-form-min.js&build/querystring/querystring-stringify-simple-min.js&build/json/json-parse-min.js&build/node/node-event-delegate-min.js'
            },

            test: function () {
                eval(sandbox.preload.js);
                YUI({bootstrap: false}).use('*', function (Y) {
                    done();
                });
            }
        }
    }
});

}, '@VERSION@', {requires: ['performance']});

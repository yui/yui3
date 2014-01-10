YUI.add('jsonp-url-tests', function(Y) {

var suite = new Y.Test.Suite("jsonp-url"),

    // For the tests, replace Y.Get.js with an object that calls the
    // appropriate callback based on the url and sets a _getConfig property
    // on the test object for inspection. This test suite is not testing
    // the Get module. Asynchronicity is removed from the operations as well,
    // but maybe it should be reinserted.
    setup = function () {
        var test = this;
        this._GetJS = Y.Get.js;

        Y.Get.js = function (url, config) {
            test._getConfig = config;

            return {
                execute: function () {
                    var proxy = url.match(/YUI\.Env\.JSONP\.(\w+)/)[1],
                        callback;

                    test._proxyName = proxy;
                    
                    if (url.indexOf('404') > -1) {
                        callback = config.onFailure;
                    // for the timeout + success test, where one request should
                    // timeout and others succeed
                    } else if (url.indexOf('wait=') > -1
                           && (test._remainingTimeouts === undefined
                               || test._remainingTimeouts--)) {
                        callback = config.onTimeout;
                    } else {
                        callback = YUI.Env.JSONP[proxy];
                    }

                    // Support async simulation by setting the test's _asyncGet
                    if (test._asyncGet) {
                        setTimeout(function () {
                            callback({ callback: proxy });
                        }, 0);
                    } else {
                        callback({ callback: proxy });
                    }
                }
            };
        };
    },

    teardown = function () {
        Y.Get.js = this._GetJS;

        if (this._global && Y.config.win) {
            Y.config.win[this._global] = undefined;
        }
    };


suite.add(new Y.Test.Case({
    name : "Callback in URL",

    setUp   : setup,
    tearDown: teardown,

    _should: {
        ignore: {
            // Ignore the tests that require Y.config.win if not in an env with
            // a window object (e.g. nodejs)
            "callback in URL should be executed": !Y.config.win,
            "inline callback should be replaced if function passed": !Y.config.win,
            "inline callback should be replaced if success function provided in config": !Y.config.win,
            "complex nested callback in URL should be executed": !Y.config.win
        }
    },

    "callback in URL should be executed": function () {
        this._global = 'globalFunction';

        Y.config.win.globalFunction = function (data) {
            Y.Assert.isObject(data);
        };

        Y.jsonp("echo/jsonp?&callback=globalFunction");
    },
        
    "inline callback should be replaced if function passed": function () {
        this._global = 'globalFunction';
        
        Y.config.win.globalFunction = function (data) {
            Y.Assert.fail("inline function should not be used");
        };

        Y.jsonp("echo/jsonp?&callback=globalFunction", function (data) {
            Y.Assert.isObject(data);
        });
    },
        
    "inline callback should be replaced if success function provided in config": function () {
        this._global = 'globalFunction';
        
        Y.config.win.globalFunction = function (data) {
            Y.Assert.fail("inline function should not be used");
        };

        Y.jsonp("echo/jsonp?&callback=globalFunction", {
            on: {
                success: function (data) {
                    Y.Assert.isObject(data);
                }
            }
        });
    },
    
    "complex nested callback in URL should be executed": function () {
        this._global = 'deeply';

        Y.config.win.deeply = [
            null,
            null,
            {
                nested: {
                    global: {
                        func: {
                            tion: function (json) {
                                Y.Assert.isObject(json);
                            }
                        }
                    }
                }
            }
        ];

        Y.jsonp('echo/jsonp?&callback=deeply[2].nested["global"].func["tion"]');
    },

    "callback relative to Y should be executed": function () {
        Y.callbackFunction = function (json) {
            delete Y.callbackFunction;
            Y.Assert.isObject(json);
        };

        Y.jsonp("echo/jsonp?&callback=callbackFunction");
    },

    "nested inline callback relative to Y should be executed": function () {
        Y.deeply = [
            null,
            null,
            {
                nested: {
                    global: {
                        func: {
                            tion: function (json) {
                                delete Y.deeply;
                                Y.Assert.isObject(json);
                            }
                        }
                    }
                }
            }
        ];

        Y.jsonp('echo/jsonp?&callback=deeply[2].nested["global"].func["tion"]');
    },

    "inline callback including 'Y.' should be executed": function () {
        Y.callbackFunction = function (json) {
            delete Y.callbackFunction;
            Y.Assert.isObject(json);
        };

        Y.jsonp("echo/jsonp?&callback=Y.callbackFunction");
    },

    "nested inline callback should be replaced if function passed": function () {
        Y.deeply = [
            null,
            null,
            {
                nested: {
                    global: {
                        func: {
                            tion: function (json) {
                                delete Y.deeply;
                                Y.Assert.fail("inline function should not be used");
                            }
                        }
                    }
                }
            }
        ];

        Y.jsonp('echo/jsonp?&callback=deeply[2].nested["global"].func["tion"]', function (data) {
            delete Y.deeply;
            Y.Assert.isObject(data);
        });
    },

    "nested inline callback should be replaced if success function provided in config": function () {
        Y.deeply = [
            null,
            null,
            {
                nested: {
                    global: {
                        func: {
                            tion: function (json) {
                                delete Y.deeply;
                                Y.Assert.fail("inline function should not be used");
                            }
                        }
                    }
                }
            }
        ];

        Y.jsonp('echo/jsonp?&callback=deeply[2].nested["global"].func["tion"]', {
            on: {
                success: function (data) {
                    delete Y.deeply;
                    Y.Assert.isObject(data);
                }
            }
        });
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['jsonp-url', 'test']});

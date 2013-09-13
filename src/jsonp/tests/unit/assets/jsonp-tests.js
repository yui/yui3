YUI.add('jsonp-tests', function(Y) {

var suite = new Y.Test.Suite("JSONP"),

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
                            callback({ url: url, callback: proxy });
                        }, 0);
                    } else {
                        callback({ url: url, callback: proxy });
                    }
                }
            };
        };
    },

    teardown = function () {
        Y.Get.js = this._GetJS;
    };

suite.add(new Y.Test.Case({
    name: "send",
    
    setUp   : setup,
    tearDown: teardown,

    _should: {
        ignore: {
            "config charset should be set via Y.Get.js": 'Not testing Get behavior'
        }
    },

    "config charset should be set via Y.Get.js": function () {
        Y.jsonp("echo/jsonp?callback={callback}", {
            on: { success: function () {} }
        });

        Y.Assert.areSame('utf-8', this._getConfig.charset);

        Y.jsonp("echo/jsonp?callback={callback}", {
            on: { success: function () {} },
            charset: "GBK"
        });

        Y.Assert.areSame('GBK', this._getConfig.charset);
    },

    "config attributes should be set via Y.Get.js": function () {
        Y.jsonp("echo/jsonp?callback={callback}", {
            on: { success: function () {} },
            attributes: {
                // passing an attribute that is less likely to be skipped over
                // by browser whitelisting (if they do that now or will later)
                language: "javascript"
            }
        });

        Y.Assert.isObject(this._getConfig.attributes);
        Y.Assert.areSame("javascript", this._getConfig.attributes.language);
    },

    "async config should be set via Y.Get.js": function () {
        Y.jsonp("echo/jsonp?callback={callback}", {
            on: { success: function () {} },
            async: true
        });
        
        Y.Assert.isTrue(this._getConfig.async);
    }
}));

suite.add(new Y.Test.Case({
    name : "callbacks",

    setUp   : setup,
    tearDown: teardown,
    
    "callback function as second arg should be success handler": function () {
        Y.jsonp("echo/jsonp?&callback={callback}", function (json) {
            Y.Assert.isObject(json);
        });
    },

    "success handler in callback object should execute": function () {
        Y.jsonp("echo/jsonp?&callback={callback}", {
            on: {
                success: function (json) {
                    Y.Assert.isObject(json);
                }
            }
        });
    },

    "failure handler in callback object should execute": function () {
        Y.jsonp("status/404?callback={callback}", {
            on: {
                success: function (json) {
                    Y.Assert.fail("Success handler called from 404 response");
                },
                failure: function () {
                    Y.Assert.isTrue(true);
                }
            }
        });
    },

    "failure handler in callback object should not execute for successful io": function () {
        Y.jsonp("echo/jsonp?&callback={callback}", {
            on: {
                success: function (json) {
                    Y.Assert.isTrue(true);
                },
                failure: function () {
                    Y.Assert.fail("Failure handler called after successful response");
                }
            }
        });
    },

    "test multiple send() from an instance of Y.JSONPRequest": function () {
        var count = 0,
            service;

        service = new Y.JSONPRequest("echo/jsonp?callback={callback}", {
            on: {
                success: function (json) {
                    count++;
                }
            }
        });

        service.send().send().send();

        Y.Assert.areSame(count, 3);
    },

    "test otherparam={callback}": function () {
        var url, called;

        Y.jsonp("echo/jsonp?foo={callback}", function (data) {
            called = true;
            url = data.url;
        });

        Y.Assert.isTrue(called);
        Y.Assert.areSame(-1, url.indexOf('callback'));
    }

    // failure for bogus response data (not yet implemented)
    // missing {callback} (not sure how to test. No callback would be attached.
    //      Maybe have the service create a property on YUI and have the test
    //      look for that after a time?)
    // missing success handler (logs a warning)
    // JSONPRequest + send
    // JSONPRequest + send with config overrides (not yet implemented)
}));

suite.add(new Y.Test.Case({
    name : "allowCache",

    setUp   : setup,
    tearDown: teardown,
        
    "allowCache should preserve the same callback": function () {
        var test = this,
            callback = [],
            jsonp;
            
        jsonp = new Y.JSONPRequest('echo/jsonp?&callback={callback}', {
            allowCache: true,
            on: {
                success: function (data) {
                    callback.push(data.callback);
                }
            }
        });

        jsonp.send().send();

        Y.Assert.areSame(2, callback.length);
        Y.Assert.isString(callback[0]);
        Y.Assert.areSame(callback[0], callback[1]);
    },

    "allowCache should not clear proxy if another send() is pending response": function () {
        var test = this,
            callbacks = [],
            jsonp;

        // Make the Y.Get.js shim execute asynchronously
        test._asyncGet = true;

        jsonp = new Y.JSONPRequest('echo/jsonp?&callback={callback}', {
            allowCache: true,
            on: {
                success: function (data) {
                    callbacks.push(data.callback);

                    if (callbacks.length > 2) {
                        test.resume(function () {
                            Y.Assert.areSame(callbacks[0], callbacks[1]);
                            Y.Assert.areSame(callbacks[1], callbacks[2]);
                            Y.Assert.isUndefined(YUI.Env.JSONP[callbacks[0]]);
                        });
                    } else if (!YUI.Env.JSONP[data.callback]) {
                        test.resume(function () {
                            Y.Assert.fail("proxy cleared prematurely");
                        });
                    }

                }
            }
        });

        jsonp.send().send().send();

        this.wait();
    }

}));

suite.add(new Y.Test.Case({
    name : "timeout",
    
    setUp   : setup,
    tearDown: teardown,

    "timeout should not flush the global proxy": function () {
        var timeoutCalled = false,
            jsonp;

        jsonp = new Y.JSONPRequest('echo/jsonp?&wait=2&callback={callback}', {
            timeout: 1000,
            on: {
                success: function (data) {
                    Y.Assert.fail("Success callback executed after timeout");
                },
                timeout: function () {
                    timeoutCalled = true;
                }
            }
        });

        jsonp.send();

        Y.Assert.isTrue(timeoutCalled);
        Y.Assert.isFunction(YUI.Env.JSONP[this._proxyName]);
    },

    "timeout should not flush the global proxy across multiple send calls": function () {
        var test = this,
            callbacks = [],
            timeoutCalled = false,
            jsonp;
            
        test._remainingTimeouts = 1;

        jsonp = new Y.JSONPRequest('echo/jsonp?wait=2&callback={callback}', {
            allowCache: true,
            timeout: 1000,
            on: {
                success: function (data) {
                    callbacks.push(data.callback);
                },
                timeout: function () {
                    callbacks.push(test._proxyName);
                    timeoutCalled = true;
                }
            }
        });

        jsonp.send().send();

        Y.Assert.isTrue(timeoutCalled);
        Y.Assert.areSame(2, callbacks.length);
        Y.Assert.areSame(callbacks[0], callbacks[1]);
        Y.Assert.isFunction(YUI.Env.JSONP[callbacks[0]]);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['jsonp', 'test'] });

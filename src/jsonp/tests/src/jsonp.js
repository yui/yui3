var suite = new Y.Test.Suite("Y.JSONPRequest and Y.jsonp with jsonp-url");

suite.add(new Y.Test.Case({
    name : "Complex callback path in URL (jsonp-url)",
        
    "complex nested callback in URL should be executed": function () {
        var self = this;

        Y.config.win.deeply = [
            null,
            null,
            {
                nested: {
                    global: {
                        func: {
                            tion: function (json) {
                                self.resume(function () {
                                    Y.config.win.deeply = undefined;
                                    Y.Assert.isObject(json);
                                });
                            }
                        }
                    }
                }
            }
        ];

        Y.jsonp('server/service.php?callback=deeply[2].nested["global"].func["tion"]');

        self.wait();
    },

    "callback relative to Y should be executed": function () {
        var self = this;

        Y.callbackFunction = function (json) {
            self.resume(function () {
                delete Y.callbackFunction;
                Y.Assert.isObject(json);
            });
        };
        Y.jsonp("server/service.php?callback=callbackFunction");

        self.wait();
    },

    "nested inline callback relative to Y should be executed": function () {
        var self = this;

        Y.deeply = [
            null,
            null,
            {
                nested: {
                    global: {
                        func: {
                            tion: function (json) {
                                self.resume(function () {
                                    delete Y.deeply;
                                    Y.Assert.isObject(json);
                                });
                            }
                        }
                    }
                }
            }
        ];

        Y.jsonp('server/service.php?callback=deeply[2].nested["global"].func["tion"]');
        self.wait();
    },

    "inline callback including 'Y.' should be executed": function () {
        var self = this;

        Y.callbackFunction = function (json) {
            self.resume(function () {
                delete Y.callbackFunction;
                Y.Assert.isObject(json);
            });
        };
        Y.jsonp("server/service.php?callback=Y.callbackFunction");

        self.wait();
    },

    "inline callback should be replaced if function passed": function () {
        var self = this;

        Y.deeply = [
            null,
            null,
            {
                nested: {
                    global: {
                        func: {
                            tion: function (json) {
                                self.resume(function () {
                                    delete Y.deeply;
                                    Y.Assert.fail("inline function should not be used");
                                });
                            }
                        }
                    }
                }
            }
        ];

        Y.jsonp('server/service.php?callback=deeply[2].nested["global"].func["tion"]', function (data) {
            self.resume(function () {
                delete Y.deeply;
                Y.Assert.isObject(data);
            });
        });

        self.wait();
    },

    "inline callback should be replaced if success function provided in config": function () {
        var self = this;

        Y.deeply = [
            null,
            null,
            {
                nested: {
                    global: {
                        func: {
                            tion: function (json) {
                                self.resume(function () {
                                    delete Y.deeply;
                                    Y.Assert.fail("inline function should not be used");
                                });
                            }
                        }
                    }
                }
            }
        ];

        Y.jsonp('server/service.php?callback=deeply[2].nested["global"].func["tion"]', {
            on: {
                success: function (data) {
                    self.resume(function () {
                        delete Y.deeply;
                        Y.Assert.isObject(data);
                    });
                }
            }
        });

        self.wait();
    },

    "allowCache should preserve the same callback": function () {
        var test = this,
            remaining = 2,
            callback,
            jsonp = new Y.JSONPRequest('server/service.php?callback={callback}', {
                allowCache: true,
                on: {
                    success: function (data) {
                        if (callback) {
                            if (callback !== data.callback) {
                                test.resume(function () {
                                    Y.Assert.areSame(callback, data.callback, "callback proxy name should be reused");
                                });
                            } else if (--remaining) {
                                jsonp.send();
                            } else {
                                test.resume(function () {
                                    // Pass
                                });
                            }
                        } else {
                            callback = data.callback;
                            jsonp.send();
                        }

                    }
                }
            });

        jsonp.send();

        this.wait();
    },

    "allowCache should not clear proxy if another send() is pending response":
    function () {
        var test = this,
            callbacks = [],
            jsonp = new Y.JSONPRequest('server/service.php?callback={callback}', {
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
                        } else if (!YUI.Env.JSONP[data.callback.split(/\./).pop()]) {
                            test.resume(function () {
                                Y.Assert.fail("proxy cleared prematurely");
                            });
                        }

                    }
                }
            });

        jsonp.send();
        jsonp.send();
        jsonp.send();

        this.wait();
    },

    "timeout should not flush the global proxy": function () {
        var test = this,
            timeoutCalled = false,
            jsonpProxies = Y.Object.keys(Y.Env.JSONP).length,
            jsonp = new Y.JSONPRequest('server/service.php?wait=2&callback={callback}', {
                timeout: 1000,
                on: {
                    success: function (data) {
                        test.resume(function () {
                            Y.Assert.fail("Success callback executed after timeout");
                        });
                    },
                    timeout: function () {
                        timeoutCalled = true;
                    }
                }
            }),
            scripts = Y.all('script')._nodes,
            newScript;

        Y.Assert.areSame(0, jsonpProxies, "Whar these leavings from?");

        jsonp.send();

        // Success is measured by the success callback NOT being executed,
        // but we're in an async operation, so I need something to trigger
        // a test.resume(..).  So I'm finding the added script tag and
        // hooking a separate onload handler to it, which would execute after
        // the success handler if it is called due to callbacks executing in
        // subscription order.  Not pretty, but better than a longer setTimeout?
        newScript = Y.Array.filter(Y.all('script')._nodes, function (s) {
            return Y.Array.indexOf(scripts, s) === -1;
        })[0];

        Y.on('load', function () {
            test.resume(function () {
                Y.Assert.isTrue(timeoutCalled);
                Y.Assert.areSame(jsonpProxies, Y.Object.keys(Y.Env.JSONP).length);
            });
        }, newScript);

        test.wait(3000);
    }

    /*
    "timeout should not flush the global proxy across multiple send calls": function () {
        // README
        // Stubbed from the test above.  This test needs to contact the
        // serverat the same url, but get varying delays.  This means to
        // properly test, the server needs to behave randomly, and this test
        // needs to iterate until that random behavior matches the expected
        // test behavior.  Which is icky.
        var test = this,
            timeoutCalled = false,
            jsonp = new Y.JSONPRequest('server/service.php?wait=2&callback={callback}', {
                timeout: 1000,
                on: {
                    success: function (data) {
                        test.resume(function () {
                            Y.Assert.fail("Success callback executed after timeout");
                        });
                    },
                    timeout: function () {
                        timeoutCalled = true;
                    }
                }
            }),
            scripts = Y.all('script')._nodes,
            newScript;

        jsonp.send();

        newScript = Y.Array.filter(Y.all('script')._nodes, function (s) {
            return Y.Array.indexOf(scripts, s) === -1;
        })[0];

        Y.on('load', function () {
            test.resume(function () {
                Y.Assert.isTrue(timeoutCalled);
            });
        }, newScript);

        test.wait(3000);
    }
    */
}));

Y.Test.Runner.add(suite);

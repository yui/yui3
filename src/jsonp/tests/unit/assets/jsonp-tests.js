YUI.add('jsonp-tests', function(Y) {

var suite = new Y.Test.Suite("JSONP"),
    // Dirty dirty hack to future proof duck type for onload where
    // possible
    onScriptLoad = (function () {
        var onload = true,
            onrsc = true;

        return function (node, callback) {
            var loaded = false;

            if (onload) {
                node.onload = function () {
                    // prefer onload to onreadystatechange
                    onload = true;
                    this.onload = this.onreadystatechange = onrsc = null;
                    if (!loaded) {
                        callback();
                        loaded = true;
                    }
                };
            }
            if (onrsc) {
                node.onreadystatechange = function () {
                    if (!('loaded|complete'.indexOf(this.readyState) % 7)) {
                        // assume no onload support until onload says so.
                        // this leaks one onload function.
                        this.onreadystatechange = null;
                        // just in case onload fired first (which it shouldn't)
                        if (onrsc && !loaded) {
                            onload = false;
                            callback();
                            loaded = true;
                        }
                    }
                };
            }
        };
    })();

suite.add(new Y.Test.Case({
    name: "send",
    
    "config charset should be set via Y.Get.script": function () {
        var test = this,
            counter = 0,
            check = function() {
                if (counter === 2) {
                    test.resume();
                }
            };

        Y.jsonp("echo/jsonp?callback={callback}", {
            on: { 
                success: function () {}
            },
            attributes: {
                id: 'jsonp_utf8'
            }
        });

        Y.on('available', function() {
            counter++;
            var newScript = Y.one('#jsonp_utf8').getDOMNode();
            Y.Assert.areSame("utf-8", newScript.charset);
            check();
        }, '#jsonp_utf8');
        


        Y.jsonp("echo/jsonp?callback={callback}", {
            on: {
                success: function () {}
            },
            charset: "GBK",
            attributes: {
                id: 'gbk_charset'
            }
        });

        Y.on('available', function() {
            counter++;
            var newScript = Y.one('#gbk_charset').getDOMNode();
            Y.Assert.areSame("GBK", newScript.getAttribute("charset"));
            check();
        }, '#gbk_charset');
        
        Y.on('available', function() {
            var newScript = Y.one('#jsonp_utf8').getDOMNode();
            Y.Assert.areSame("utf-8", newScript.charset);
        }, '#jsonp_utf8');

        test.wait();
    },
    "config attributes should be set via Y.Get.script": function () {
        var test = this,
            scripts = Y.all('script')._nodes,
            newScript;

        Y.jsonp("echo/jsonp?callback={callback}", {
            on: {
                success: function () {
                    if (Y.Test.Runner._waiting) {
                        test.resume();
                    }
                }
            },
            attributes: {
                // passing an attribute that is less likely to be skipped over
                // by browser whitelisting (if they do that now or will later)
                language: "javascript"
            }
        });

        newScript = Y.Array.filter(Y.all('script')._nodes, function (s) {
            return Y.Array.indexOf(scripts, s) === -1;
        })[0];

        Y.Assert.areSame("javascript", newScript.getAttribute("language"));

        // to allow JSONP the chance to clean up the callback registry before
        // other tests begin.
        test.wait();
    },
    "async config should be set via Y.Get.script": function () {
        var test = this;

        Y.jsonp("echo/jsonp?callback={callback}", {
            on: {
                success: function () {
                
                }
            },
            async: true,
            attributes: {
                id: 'async_test'
            }
        });
        
        Y.on('available', function() {
            test.resume(function() {
                Y.Assert.isTrue(Y.one('#async_test').getDOMNode().async);
            });
        }, '#async_test');

        test.wait();

    }
}));

suite.add(new Y.Test.Case({
    name : "callbacks",
        
    _should: {
        ignore: {
            // Get (v3.3) doesn't support onerror in recent webkit
            "failure handler in callback object should execute": true
        }
    },

    "callback function as second arg should be success handler": function () {
        var self = this;

        Y.jsonp("echo/jsonp?&callback={callback}", function (json) {
            //console.log(Y.Object.keys(YUI.Env.JSONP), "callback function as second arg should be success handler");
            self.resume(function () {
                Y.Assert.isObject(json);
            });
        });

        self.wait();
    },

    "success handler in callback object should execute": function () {
        var self = this;

        Y.jsonp("echo/jsonp?&callback={callback}", {
            on: {
                success: function (json) {
                    //console.log(Y.Object.keys(YUI.Env.JSONP), "success handler in callback object should execute");
                    self.resume(function () {
                        Y.Assert.isObject(json);
                    });
                }
            }
        });

        self.wait();
    },

    "failure handler in callback object should execute": function () {
        var self = this;

        Y.jsonp("status/404?callback={callback}", {
            on: {
                success: function (json) {
                    self.resume(function () {
                        Y.Assert.fail("Success handler called from 404 response");
                    });
                },
                failure: function () {
                    //console.log("failure handler in callback object should execute");
                    // Pass
                    self.resume(function () {});
                }
            }
        });

        self.wait();
    },

    "failure handler in callback object should not execute for successful io": function () {
        var self = this;

        Y.jsonp("echo/jsonp?&callback={callback}", {
            on: {
                success: function (json) {
                    //console.log(Y.Object.keys(YUI.Env.JSONP), "failure handler in callback object should not execute for successful io");
                    // Pass
                    if (Y.Test.Runner._waiting) {
                        self.resume();
                    }
                },
                failure: function () {
                    if (Y.Test.Runner._waiting) {
                        self.resume(function () {
                            Y.Assert.fail("Failure handler called after successful response");
                        });
                    } else {
                        Y.Assert.fail("Failure handler called after successful response");
                    }
                }
            }
        });

        self.wait();
    },

    "test multiple send() from an instance of Y.JSONPRequest": function () {
        var self = this,
            count = 0,
            service;

        service = new Y.JSONPRequest("echo/jsonp?callback={callback}", {
            on: {
                success: function (json) {
                    //console.log(Y.Object.keys(YUI.Env.JSONP), "test multiple send() from an instance of Y.JSONPRequest");
                    if (++count === 3) {
                        self.resume(function () {
                            // Pass
                            Y.Assert.areSame(count, 3);
                        });
                    }
                }
            }
        });

        service.send().send().send();

        this.wait();
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
        
    "allowCache should preserve the same callback": function () {
        var test = this,
            remaining = 2,
            callback,
            jsonp = new Y.JSONPRequest('echo/jsonp?&callback={callback}', {
                allowCache: true,
                on: {
                    success: function (data) {
                        //console.log(Y.Object.keys(YUI.Env.JSONP), "allowCache should preserve the same callback");
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
            jsonp = new Y.JSONPRequest('echo/jsonp?&callback={callback}', {
                allowCache: true,
                on: {
                    success: function (data) {
                        //console.log(Y.Object.keys(YUI.Env.JSONP), "allowCache should not clear proxy if another send() is pending response");
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
    }

}));

/*
suite.add(new Y.Test.Case({
    name : "timeout",
        
    "timeout should not flush the global proxy": function () {
        var test = this,
            timeoutCalled = false,
            jsonpProxies = Y.Object.keys(YUI.Env.JSONP).length,
            jsonp = new Y.JSONPRequest('echo/jsonp?&wait=2&callback={callback}', {
                timeout: 1000,
                on: {
                    success: function (data) {
                        //console.log(Y.Object.keys(YUI.Env.JSONP), "timeout should not flush the global proxy");
                        test.resume(function () {
                            Y.Assert.fail("Success callback executed after timeout");
                        });
                    },
                    timeout: function () {
                        //console.log(Y.Object.keys(YUI.Env.JSONP), "timeout should not flush the global proxy (timeout)");
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

        onScriptLoad(newScript, function () {
            //console.log("__yui_wait: " + test.__yui_wait + " (should be a setTimeout int)");
            // If the success callback is triggered, it will resume the test,
            // and clear the wait() timeout, so having another resume() here
            // will just blow up.  The test has already failed if !_waiting
            if (Y.Test.Runner._waiting) {
                test.resume(function () {
                    Y.Assert.isTrue(timeoutCalled);
                    Y.Assert.areSame(jsonpProxies, Y.Object.keys(YUI.Env.JSONP).length);
                });
            }
        });

        test.wait(3000);
    }
    ,

    "timeout should not flush the global proxy across multiple send calls": function () {
        // README
        // Stubbed from the test above.  This test needs to contact the
        // serverat the same url, but get varying delays.  This means to
        // properly test, the server needs to behave randomly, and this test
        // needs to iterate until that random behavior matches the expected
        // test behavior.  Which is icky.
        var test = this,
            timeoutCalled = false,
            jsonp = new Y.JSONPRequest('echo/jsonp?wait=2&callback={callback}', {
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
}));
    */

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['jsonp', 'test', 'array-extras', 'event']});

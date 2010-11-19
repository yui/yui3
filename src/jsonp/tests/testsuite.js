YUI.add('jsonp-test', function(Y) {

var suite = new Y.Test.Suite("Y.JSONPRequest and Y.jsonp");

suite.add(new Y.Test.Case({
    name : "Callback in URL",

    "callback in URL should be executed": function () {
        var self = this;

        Y.config.win.globalFunction = function (json) {
            self.resume(function () {
                Y.config.win.globalFunction = undefined;
                Y.Assert.isObject(json);
            });
        };
        Y.jsonp("server/service.php?callback=globalFunction");

        self.wait(300);
    }
}));

suite.add(new Y.Test.Case({
    name : "Callback function",
        
    "callback function as second arg should be success handler": function () {
        var self = this;

        Y.jsonp("server/service.php?callback={callback}", function (json) {
            self.resume(function () {
                Y.Assert.isObject(json);
            });
        });

        self.wait(300);
    },

    "inline callback should be replaced if function passed": function () {
        var self = this;

        Y.config.win.globalFunction = function (json) {
            self.resume(function () {
                Y.config.win.globalFunction = undefined;
                Y.Assert.fail("inline function should not be used");
            });
        };

        Y.jsonp("server/service.php?callback=globalFunction", function (data) {
            self.resume(function () {
                Y.config.win.globalFunction = undefined;
                Y.Assert.isObject(data);
            });
        });

        self.wait(300);
    }
}));

suite.add(new Y.Test.Case({
    name : "Callback object",
        
    "success handler in callback object should execute": function () {
        var self = this;

        Y.jsonp("server/service.php?callback={callback}", {
            on: {
                success: function (json) {
                    self.resume(function () {
                        Y.Assert.isObject(json);
                    });
                }
            }
        });

        self.wait(300);
    },

    "inline callback should be replaced if success function provided in config": function () {
        var self = this;

        Y.config.win.globalFunction = function (json) {
            self.resume(function () {
                Y.config.win.globalFunction = undefined;
                Y.Assert.fail("inline function should not be used");
            });
        };

        Y.jsonp("server/service.php?callback=globalFunction", {
            on: {
                success: function (data) {
                    self.resume(function () {
                        Y.config.win.globalFunction = undefined;
                        Y.Assert.isObject(data);
                    });
                }
            }
        });

        self.wait(300);
    }
}));

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

        self.wait(300);
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

        self.wait(300);
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
        self.wait(300);
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

        self.wait(300);
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

        self.wait(300);
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

        self.wait(300);
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
    }
}));
Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['test', 'jsonp-url']});

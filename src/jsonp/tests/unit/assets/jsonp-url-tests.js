YUI.add('jsonp-url-tests', function(Y) {

var suite = new Y.Test.Suite("JSONP: URL's");

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
        Y.jsonp("echo/jsonp?&callback=globalFunction");

        self.wait();
    },
        
    "inline callback should be replaced if function passed": function () {
        var self = this;

        Y.config.win.globalFunction = function (json) {
            self.resume(function () {
                Y.config.win.globalFunction = undefined;
                Y.Assert.fail("inline function should not be used");
            });
        };

        Y.jsonp("echo/jsonp?&callback=globalFunction", function (data) {
            self.resume(function () {
                Y.config.win.globalFunction = undefined;
                Y.Assert.isObject(data);
            });
        });

        self.wait();
    },
        
    "inline callback should be replaced if success function provided in config": function () {
        var self = this;

        Y.config.win.globalFunction = function (json) {
            self.resume(function () {
                Y.config.win.globalFunction = undefined;
                Y.Assert.fail("inline function should not be used");
            });
        };

        Y.jsonp("echo/jsonp?&callback=globalFunction", {
            on: {
                success: function (data) {
                    self.resume(function () {
                        Y.config.win.globalFunction = undefined;
                        Y.Assert.isObject(data);
                    });
                }
            }
        });

        self.wait();
    },
    
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

        Y.jsonp('echo/jsonp?&callback=deeply[2].nested["global"].func["tion"]');

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
        Y.jsonp("echo/jsonp?&callback=callbackFunction");

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

        Y.jsonp('echo/jsonp?&callback=deeply[2].nested["global"].func["tion"]');
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
        Y.jsonp("echo/jsonp?&callback=Y.callbackFunction");

        self.wait();
    },

    "nested inline callback should be replaced if function passed": function () {
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

        Y.jsonp('echo/jsonp?&callback=deeply[2].nested["global"].func["tion"]', function (data) {
            self.resume(function () {
                delete Y.deeply;
                Y.Assert.isObject(data);
            });
        });

        self.wait();
    },

    "nested inline callback should be replaced if success function provided in config": function () {
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

        Y.jsonp('echo/jsonp?&callback=deeply[2].nested["global"].func["tion"]', {
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
    }

}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['jsonp-url', 'test']});

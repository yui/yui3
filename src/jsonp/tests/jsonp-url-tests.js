YUI.add('jsonp-url-tests', function(Y) {

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

        self.wait();
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

        Y.jsonp("server/service.php?callback=globalFunction", function (data) {
            self.resume(function () {
                Y.config.win.globalFunction = undefined;
                Y.Assert.isObject(data);
            });
        });

        self.wait();
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

        self.wait();
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['jsonp-url', 'test']});

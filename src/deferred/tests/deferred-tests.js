YUI.add('deferred-tests', function (Y) {

    var suite = new Y.Test.Suite('deferred');

    suite.add(new Y.Test.Case({
        name: "instantiation",

        "test new Y.Deferred()": function () {
            var deferred = new Y.Deferred();

            Y.Assert.isInstanceOf(Y.Deferred, deferred);
        },

        "test Y.Deferred()": function () {
            var deferred = Y.Deferred();

            Y.Assert.isInstanceOf(Y.Deferred, deferred);
        },

        "test new Y.Deferred(executor) executes executor": function () {
            var executed = false,
                deferred = new Y.Deferred(function () {
                    executed = true;
                });

            Y.Assert.isTrue(executed);
        },

        "test new Y.Deferred(executor) executor receives the deferred as param": function () {
            var param    = null,
                deferred = new Y.Deferred(function (heya) {
                    param = heya;
                });

            Y.Assert.areSame(deferred, param);
        }
    }));

    suite.add(new Y.Test.Case({
        name: "then",

        "then(callback) should return a promise": function () {
        },

        "then(callback) promise should NOT be deferred.promise()": function () {
        },

        "then(null, callback) should return a promise": function () {
        },

        "then(null, callback) promise should NOT be deferred.promise()": function () {
        },

        "then(callbackA, callbackB) should return a promise": function () {
        },

        "then(callbackA, callbackB) promise should NOT be deferred.promise()": function () {
        },

        "then(callback) callback should be executed when resolved": function () {
        },

        "then(null, callback) callback should be executed when rejected": function () {
        },

        "callback that returns a promise should resolve the then()'d promise when that promise is resolved": function () {
            
        }
    }));

    suite.add(new Y.Test.Case({
        name: "on",

        "deferred.on(event, callback) should return promise": function () {
        },

        "test deferred.on() event name aliases": function () {
        },

        "subscription after resolution should execute immediately": function () {
        },

        "subscription after resolution should be called with stored return value": function () {
        },

        "subscription to 'resolve' after rejected should do nothing": function () {
        },

        "subscription to 'reject' after resolved should do nothing": function () {
        },

        "subscription to 'progress' after resolution should do nothing": function () {
        }
    }));

    suite.add(new Y.Test.Case({
        name: "resolve",

        "should call 'resolve' event subscribers": function () {

        },

        "should pass arguments to subscribers": function () {
        }
    }));

    suite.add(new Y.Test.Case({
        name: "reject",

        "should call 'reject' event subscribers": function () {

        },

        "should pass arguments to subscribers": function () {
        }
    }));

    suite.add(new Y.Test.Case({
        name: "notify",

        "should call 'progress' event subscribers": function () {

        },

        "should pass arguments to subscribers": function () {
        }
    }));

    suite.add(new Y.Test.Case({
        name: "promise",

        "should return the associated promise": function () {
        },

        "should have the same on, then, and promise methods as the associated Deferred": function () {
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'deferred', 'test', 'test-console' ] });

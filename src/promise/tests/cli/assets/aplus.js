YUI.add('aplus-tests', function(Y) {
 
    var Assert = Y.Assert;

    var adapter = {
        fulfilled: function (value) {
            return new Y.Promise(function (fulfill) {
                fulfill(value);
            });
        },
        rejected: function (value) {
            return new Y.Promise(function (fulfill, reject) {
                reject(value);
            });
        },
        pending: function () {
            var fulfill, reject, promise;
         
            promise = new Y.Promise(function (f, r) {
                fulfill = f;
                reject = r;
            });
         
            return {
                promise: promise,
                fulfill: fulfill,
                reject: reject
            };
        }
    };

    var promisesAplusTests = require("promises-aplus-tests");
    
    var suite = new Y.Test.Suite('Promise Aplus');

    suite.add(new Y.Test.Case({
        name: "Promise Aplus",
        'should run the full test suite': function() {
            var test = this;

            promisesAplusTests(adapter, {reporter: 'dot'}, function (err) {
                test.resume(function() {
                    Assert.isNull(err, 'All promises tests should pass');
                });
            });

            test.wait(9999999);
        }
    }));

    Y.Test.Runner.add(suite);

});

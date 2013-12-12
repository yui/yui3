YUI.add('tests-promise-utils', function (Y) {

    var Assert = Y.Assert,
        Promise = Y.Promise;

    Y.mix(Y.Test.Case.prototype, {
        /**
        Takes a promise and a callback. Calls the callback or fails the test
        if the promise was rejected.
        **/
        isFulfilled: function (promise, callback) {
            var test = this;

            promise.then(function (value) {
                test.resume(function () {
                    callback.call(this, value);
                });
            }, function (reason) {
                test.resume(function () {
                    Assert.fail('Promise rejected instead of fulfilled');
                });
            });

            test.wait();
        },
        /**
        Takes a promise and a callback. Calls the callback or fails the test
        if the promise was rejected.
        **/
        isRejected: function (promise, callback) {
            var test = this;

            promise.then(function (value) {
                test.resume(function () {
                    Assert.fail('Promise fulfilled instead of rejected');
                });
            }, function (reason) {
                test.resume(function () {
                    callback.call(this, reason);
                });
            });

            test.wait();
        }
    });
    
    Y.fulfilledAfter = function fulfilledAfter(ms) {
        return new Promise(function (fulfill) {
            setTimeout(function () {
                fulfill(ms);
            }, ms);
        });
    };

    Y.rejectedAfter = function rejectedAfter(ms) {
        return new Promise(function (fulfill, reject) {
            setTimeout(function () {
                reject(ms);
            }, ms);
        });
    };

}, '@VERSION@', {
    requires: [
        'promise',
        'test'
    ]
});

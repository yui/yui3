YUI.add('promise-benchmark', function (Y) {

    var Promise = Y.Promise,
        suite = Y.BenchmarkSuite = new Benchmark.Suite,
        i, array = [];

    // Disable soon, otherwise the suite would measure its performance
    // not all the other operations performed by promises
    Y.soon = function (fn) {
        fn();
    };

    function noop() {
    }

    function identity(x) {
        return x;
    }

    function rethrow(e) {
        throw e;
    }

    for (i = 0; i < 100; i++) {
        array[i] = i;
    }

    suite.add('Promise creation', function () {
        var promise = new Promise(noop);
    });

    suite.add('Single callback resolution', function () {
        var promise = new Promise(function (resolve) {
            resolve(5);
        });
        promise.then(noop);
    });

    suite.add('Single callback rejection', function () {
        var promise = new Promise(function (resolve, reject) {
            reject(5);
        });
        promise.then(noop);
    });

    suite.add('Multiple callback resolution', function () {
        var resolve,
            promise = new Promise(function (_resolve) {
                resolve = _resolve;
            });
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);

        resolve(5);
    });

    suite.add('Multiple callback rejection', function () {
        var reject,
            promise = new Promise(function (_resolve, _reject) {
                reject = _reject;
            });
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);
        promise.then(noop);

        reject(5);
    });

    suite.add('Chaining fulfilled promises', function () {
        var promise = new Promise(function (resolve) {
            resolve(5);
        });
        promise.then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity);
    });

    suite.add('Chaining rejected promises', function () {
        var promise = new Promise(function (resolve, reject) {
            reject(5);
        });
        promise.then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow);
    });

    suite.add('Chaining fulfilled promises with reject callbacks', function () {
        var promise = new Promise(function (resolve) {
            resolve(5);
        });
        promise.then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow)
               .then(null, rethrow);
    });

    suite.add('Chaining rejected promises with resolve callbacks', function () {
        var promise = new Promise(function (resolve, reject) {
            reject(5);
        });
        promise.then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity)
               .then(identity);
    });

    suite.add('Reducing a large array', function () {
        Y.Array.reduce(array, new Promise(function (resolve) {
            resolve(0);
        }), function (promise, nextVal) {
            return promise.then(function (prevVal) {
                return prevVal + nextVal;
            });
        });
    });

}, '@VERSION@', {
    requires: [
        'promise',
        'array-extras'
    ]
});

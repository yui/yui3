var suite = new PerfSuite({
    name: 'Y.Promise performance tests',
    yui: {
        use: ['promise', 'array-extras']
    },
    global: {
        setup: function () {

            var i, array = [];

            Y.soon = function (fn) { fn(); };

            function noop() {}

            function identity(x) {
              return x;
            }

            function rethrow(e) {
              throw e;
            }

            for (i = 0; i < 100; i++) {
              array[i] = i;
            }
        }
    },
    tests: [
        {
            name: 'Promise creation',
            fn: function () {
                var promise = new Y.Promise(noop);
            }
        },
        {
            name: 'Single callback resolution',
            fn: function () {
                var promise = new Y.Promise(function (resolve) {
                    resolve(5);
                });
                promise.then(noop);
            }
        },
        {
            name: 'Single callback rejection',
            fn: function () {
                var promise = new Y.Promise(function (resolve, reject) {
                    reject(5);
                });
                promise.then(noop);
            }
        },
        {
            name: 'Multiple callback resolution',
            fn: function () {
                var resolve,
                    promise = new Y.Promise(function (_resolve) {
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
            }
        },
        {
            name: 'Multiple callback rejection',
            fn: function () {
                var reject,
                    promise = new Y.Promise(function (_resolve, _reject) {
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
            }
        },
        {
            name: 'Multiple callback rejection',
            fn: function () {
                var promise = new Y.Promise(function (resolve) {
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
            }
        },
        {
            name: 'Chaining rejected promises',
            fn: function () {
                var promise = new Y.Promise(function (resolve, reject) {
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
            }
        },
        {
            name: 'Chaining fulfilled promises with reject callbacks',
            fn: function () {
                var promise = new Y.Promise(function (resolve) {
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

            }
        },
        {
            name: 'Chaining rejected promises with resolve callbacks',
            fn: function () {
                var promise = new Y.Promise(function (resolve, reject) {
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
            }
        },
        {
            name: 'Reducing a large array',
            fn: function () {
                Y.Array.reduce(array, new Y.Promise(function (resolve) {
                    resolve(0);
                }), function (promise, nextVal) {
                    return promise.then(function (prevVal) {
                        return prevVal + nextVal;
                    });
                });
            }
        }
    ]
});

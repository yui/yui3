/**
Adds a `Y.batch()` method to wrap any number of callbacks or promises in a
single promise that will be resolved when all callbacks and/or promises have completed.

@module promise
@submodule promise-batch
**/

var slice = [].slice;

/**
Returns a new promise that will be resolved when all operations have completed.
Takes both callbacks and promises as arguments. If an argument is a callback,
it will be wrapped in a new promise.

@for YUI
@method batch
@param {Function|Promise} operation* Any number of functions or Y.Promise
            objects
@return {Promise}
**/
Y.batch = function () {
    var funcs     = slice.call(arguments),
        remaining = funcs.length,
        j         = 0,
        length    = funcs.length,
        results   = [];

    return new Y.Promise(function (fulfill, reject) {
        var allDone = this;

        function oneDone(i) {
            return function (value) {
                results[i] = value;

                remaining--;

                if (!remaining && allDone.getStatus() !== 'rejected') {
                    fulfill(results);
                }
            };
        }

        if (length < 1) {
            return fulfill(results);
        }

        for (; j < length; j++) {
            Y.when(funcs[j], oneDone(j), reject);
        }
    });
};

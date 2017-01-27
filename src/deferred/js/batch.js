/**
Adds a `Y.batch()` method to wrap any number of callbacks or promises in a
Y.Deferred, and return the associated promise that will resolve when all
callbacks and/or promises have completed.  Each callback is passed a Y.Deferred
that it must `resolve()` when it completes.

@module deferred
@submodule deferred-when
**/

/**
Wraps any number of callbacks in a Y.Deferred, and returns the associated
promise that will resolve when all callbacks have completed.  Each callback is
passed a Y.Deferred that it must `resolve()` when that callback completes.

@for YUI
@method batch
@param {Function|Promise} operation* Any number of functions or Y.Promise
            objects
@return {Promise}
**/
Y.batch = function () {
    var funcs     = slice.call(arguments),
        remaining = funcs.length,
        results   = [];

    return Y.defer(function (allDone) {
        var failed = Y.bind('reject', allDone);

        function oneDone(i) {
            return function () {
                var args = slice.call(arguments);

                results[i] = args.length > 1 ? args : args[0];

                remaining--;

                if (!remaining && allDone.getStatus() !== 'rejected') {
                    allDone.resolve.apply(allDone, results);
                }
            };
        }

        Y.Array.each(funcs, function (fn, i) {
            Y.when((isFunction(fn) ? Y.defer(fn) : fn), oneDone(i), failed);
        });
    });
};

/**
Adds a `Y.when()` method to wrap any number of callbacks or promises in a
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
@method when
@param {Function|Promise} operation* Any number of functions or Y.Promise
            objects
@return {Promise}
**/
Y.when = function () {
    var funcs     = slice.call(arguments),
        allDone   = new Y.Deferred(),
        remaining = funcs.length,
        results   = [];

    function oneDone(i) {
        return function () {
            var args = slice.call(arguments);

            results[i] = args.length > 1 ? args : args[0];

            if (!--remaining) {
                allDone.resolve.apply(allDone, results);
            }
        };
    }

    Y.Array.each(funcs, function (fn, i) {
        var finished = oneDone(i);
            deferred;

        // accept promises as well as functions
        if (typeof fn === 'function') {
            deferred = new Y.Deferred();
        
            deferred.then(finished, finished);
            
            // It's up to each passed function to resolve/reject the deferred
            // that is assigned to it.
            fn.apply(Y, deferred);

        } else if (fn && typeof fn.then === 'function') {
            fn.then(finished, finished);
        }
    }

    return allDone.promise();
};

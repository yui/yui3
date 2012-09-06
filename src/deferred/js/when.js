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
        failed    = Y.bind('reject', allDone),
        remaining = funcs.length,
        results   = [];

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
        var finished = oneDone(i),
            deferred;

        // accept promises as well as functions
        if (typeof fn === 'function') {
            deferred = new Y.Deferred();
        
            deferred.then(finished, failed);
            
            // It's up to each passed function to resolve/reject the deferred
            // that is assigned to it.
            fn.call(Y, deferred);

        } else if (fn && typeof fn.then === 'function') {
            fn.then(finished, failed);
        } else {
            remaining--;
            results[i] = fn;
        }
    });

    funcs = null;

    // For some crazy reason, only values, not functions or promises were passed
    // in, so we're done already.
    if (!remaining) {
        allDone.resolve.apply(allDone, results);
    }

    return allDone.promise();
};

/**
Returns a new promise that will be resolved when all operations have completed.
Takes both callbacks and promises as arguments. If an argument is a callback,
it will be wrapped in a new promise.

@for YUI
@method batch
@param {Function|Promise} operation* Any number of functions or Y.Promise
            objects
@return {Promise}
@deprecated @SINCE@
**/
Y.batch = function () {
    Y.log('batch() was deprecated in YUI @SINCE@. Use Promise.every()', 'warn');

    var funcs     = slice.call(arguments),
        remaining = funcs.length,
        i         = 0,
        length    = funcs.length,
        results   = [];

    return new Y.Promise(function (fulfill, reject) {
        var allDone = this;

        function oneDone(index) {
            return function (value) {
                results[index] = value;

                remaining--;

                if (!remaining && allDone.getStatus() !== 'rejected') {
                    fulfill(results);
                }
            };
        }

        if (length < 1) {
            return fulfill(results);
        }

        for (; i < length; i++) {
            Y.when(funcs[i], oneDone(i), reject);
        }
    });
};

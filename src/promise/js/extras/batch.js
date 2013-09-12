/**
Returns a new promise that will be resolved when all operations have completed.
Takes both promises and regular JavaScript values as arguments.

@for YUI
@method batch
@param {Any} values* Any number of promises or regular JavaScript values
@return {Promise}
@deprecated @SINCE@
**/
Y.batch = function () {
    Y.log('batch() was deprecated in YUI @VERSION@. Use Y.Promise.every()', 'warn');

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

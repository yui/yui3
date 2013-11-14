/**
Returns a new promise that will be resolved when all operations have completed.
Takes both any numer of values as arguments. If an argument is a not a promise,
it will be wrapped in a new promise, same as in `Y.when()`.

@for YUI
@method batch
@param {Any} operation* Any number of Y.Promise objects or regular JS values
@return {Promise} Promise to be fulfilled when all provided promises are
                    resolved
**/
Y.batch = function () {
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

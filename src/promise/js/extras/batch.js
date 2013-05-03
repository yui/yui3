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
    return Promise.every(slice.call(arguments));
};

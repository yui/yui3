/**
Abstraction API allowing you to interact with promises or raw values as if they
were promises. If a non-promise object is passed in, a new Resolver is created
and scheduled to resolve asynchronously with the provided value.

In either case, a promise is returned.  If either _callback_ or _errback_ are
provided, the promise returned is the one returned from calling
`promise.then(callback, errback)` on the provided or created promise.  If neither
are provided, the original promise is returned.

@for YUI
@method when
@param {Any} promise Promise object or value to wrap in a resolved promise
@param {Function} [callback] callback to execute if the promise is resolved
@param {Function} [errback] callback to execute if the promise is rejected
@return {Promise}
**/
Y.when = function (promise, callback, errback) {
    promise = Promise.resolve(promise);

    return (callback || errback) ? promise.then(callback, errback) : promise;
};

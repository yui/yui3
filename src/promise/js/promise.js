/**
Wraps the execution of asynchronous operations, providing a promise object that
can be used to subscribe to the various ways the operation may terminate.

When the operation completes successfully, call the Resolver's `fulfill()`
method, passing any relevant response data for subscribers.  If the operation
encounters an error or is unsuccessful in some way, call `reject()`, again
passing any relevant data for subscribers.

The Resolver object should be shared only with the code resposible for
resolving or rejecting it. Public access for the Resolver is through its
_promise_, which is returned from the Resolver's `promise` property. While both
Resolver and promise allow subscriptions to the Resolver's state changes, the
promise may be exposed to non-controlling code. It is the preferable interface
for adding subscriptions.

Subscribe to state changes in the Resolver with the promise's
`then(callback, errback)` method.  `then()` wraps the passed callbacks in a
new Resolver and returns the corresponding promise, allowing chaining of
asynchronous or synchronous operations. E.g.
`promise.then(someAsyncFunc).then(anotherAsyncFunc)`

@module promise
@since 3.9.0
**/

/**
The public API for a Resolver. Used to subscribe to the notification events for
resolution or progress of the operation represented by the Resolver.

@class Promise
@constructor
@param {Function} fn A function where to insert the logic that resolves this
        promise. Receives `fulfill` and `reject` functions as parameters
**/
function Promise(fn) {
    if (!(this instanceof Promise)) {
        return new Promise(fn);
    }

    var resolver = new Promise.Resolver(this);

    /**
    A reference to the resolver object that handles this promise
    
    @property _resolver
    @type Object
    @private
    */
    this._resolver = resolver;

    fn.call(this, Y.bind('fulfill', resolver), Y.bind('reject', resolver));
}

/**
Schedule execution of a callback to either or both of "fulfill" and
"reject" resolutions for this promise. The callbacks are wrapped in a new
promise and that promise is returned.  This allows operation chaining ala
`functionA().then(functionB).then(functionC)` where `functionA` returns
a promise, and `functionB` and `functionC` _may_ return promises.

Asynchronicity of the callbacks is guaranteed.

@method then
@param {Function} [callback] function to execute if the promise
            resolves successfully
@param {Function} [errback] function to execute if the promise
            resolves unsuccessfully
@return {Promise} A promise wrapping the resolution of either "resolve" or
            "reject" callback
**/

/**
Returns the current status of the operation. Possible results are
"pending", "fulfilled", and "rejected".

@method getStatus
@return {String}
**/
Y.Array.each(['then', 'getStatus'], function (method) {
    Promise.prototype[method] = function () {
        return this._resolver[method].apply(this._resolver, arguments);
    };
});


/**
Checks if an object or value is a promise. This is cross-implementation
compatible, so promises returned from other libraries or native components
that are compatible with the Promises A+ spec should be recognized by this
method.

@method isPromise
@param {Any} obj The object to test
@return {Boolean} Whether the object is a promise or not
@static
**/
Promise.isPromise = function (obj) {
    return !!obj && typeof obj.then === 'function';
};

Y.Promise = Promise;
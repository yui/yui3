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
A promise represents a value that may not yet be available. Promises allow
you to chain asynchronous operations, write synchronous looking code and
handle errors throughout the process.

This constructor takes a function as a parameter where you can insert the logic
that fulfills or rejects this promise. The fulfillment value and the rejection
reason can be any JavaScript value. It's encouraged that rejection reasons be
error objects

<pre><code>
var fulfilled = new Y.Promise(function (fulfill) {
    fulfill('I am a fulfilled promise');
});

var rejected = new Y.Promise(function (fulfill, reject) {
    reject(new Error('I am a rejected promise'));
});
</code></pre>

@class Promise
@constructor
@param {Function} fn A function where to insert the logic that resolves this
        promise. Receives `fulfill` and `reject` functions as parameters.
        This function is called synchronously.
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

    fn.call(this, function (value) {
        resolver.fulfill(value);
    }, function (reason) {
        resolver.reject(reason);
    });
}

Y.mix(Promise.prototype, {
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
    then: function (callback, errback) {
        return this._resolver.then(callback, errback);
    },

    /**
    Returns the current status of the operation. Possible results are
    "pending", "fulfilled", and "rejected".

    @method getStatus
    @return {String}
    **/
    getStatus: function () {
        return this._resolver.getStatus();
    }
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
    // We test promises by form to be able to identify other implementations
    // as promises. This is important for cross compatibility and in particular
    // Y.when which should take any kind of promise
    return !!obj && typeof obj.then === 'function';
};

Y.Promise = Promise;

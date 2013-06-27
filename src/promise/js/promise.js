/**
Wraps the execution of asynchronous operations, providing a promise object that
can be used to subscribe to the various ways the operation may terminate.

@module promise-core
@since 3.11.0
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

    var resolver = new Promise.Resolver();

    /**
    A reference to the resolver object that handles this promise
    
    @property _resolver
    @type Object
    @private
    */
    this._resolver = resolver;

    fn.call(this, function (value) {
        resolver.resolve(value);
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
    @return {Promise} A promise wrapping the resolution of either "fulfill" or
                "reject" callback
    **/
    then: function (callback, errback) {
        return this._resolver.then(callback, errback);
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
    if (obj) {
        // Use try...catch when retrieving obj.then. Return false if it throws
        // See Promises/A+ 1.1
        try {
            return typeof obj.then === 'function';
        } catch (e) {
        }
    }
    return false;
};

Y.Promise = Promise;

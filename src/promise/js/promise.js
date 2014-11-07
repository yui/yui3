/**
Wraps the execution of asynchronous operations, providing a promise object that
can be used to subscribe to the various ways the operation may terminate.

When the operation completes successfully, call the Resolver's `resolve()`
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

var Lang  = Y.Lang,
    slice = [].slice;

/**
A promise represents a value that may not yet be available. Promises allow
you to chain asynchronous operations, write synchronous looking code and
handle errors throughout the process.

This constructor takes a function as a parameter where you can insert the logic
that fulfills or rejects this promise. The fulfillment value and the rejection
reason can be any JavaScript value. It's encouraged that rejection reasons be
error objects

<pre><code>
var fulfilled = new Y.Promise(function (resolve) {
    resolve('I am a fulfilled promise');
});

var rejected = new Y.Promise(function (resolve, reject) {
    reject(new Error('I am a rejected promise'));
});
</code></pre>

@class Promise
@constructor
@param {Function} fn A function where to insert the logic that resolves this
        promise. Receives `resolve` and `reject` functions as parameters.
        This function is called synchronously.
**/
function Promise(fn) {
    if (!(this instanceof Promise)) {
        Y.log('Promises should always be created with new Promise(). This will throw an error in the future', 'warn', NAME);
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

    try {
        fn.call(this, function (value) {
            resolver.resolve(value);
        }, function (reason) {
            resolver.reject(reason);
        });
    } catch (e) {
        resolver.reject(e);
    }
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
        var Constructor = this.constructor,
            resolver = this._resolver;

        // using this.constructor allows for customized promises to be
        // returned instead of plain ones
        return new Constructor(function (resolve, reject) {
            resolver._addCallbacks(
                // Check if callbacks are functions. If not, default to
                // `resolve` and `reject` respectively.
                // The wrapping of the callbacks is done here and not in
                // `_addCallbacks` because it is a feature specific to  `then`.
                // If `done` is added to promises it would call `_addCallbacks`
                // without defaulting to anything and without wrapping
                typeof callback === 'function' ?
                    Promise._wrap(resolve, reject, callback) : resolve,
                typeof errback === 'function' ?
                    Promise._wrap(resolve, reject, errback) : reject
            );
        });
    },

    /**
    A shorthand for `promise.then(undefined, callback)`.

    Returns a new promise and the error callback gets the same treatment as in
    `then`: errors get caught and turned into rejections, and the return value
    of the callback becomes the fulfilled value of the returned promise.

    @method catch
    @param [Function] errback Callback to be called in case this promise is
                        rejected
    @return {Promise} A new promise modified by the behavior of the error
                        callback
    **/
    'catch': function (errback) {
        return this.then(undefined, errback);
    },

    /**
    Returns the current status of the operation. Possible results are
    "pending", "fulfilled", and "rejected".

    @method getStatus
    @return {String}
    @deprecated
    **/
    getStatus: function () {
        Y.log('promise.getStatus() will be removed in the future', 'warn', NAME);
        return this._resolver.getStatus();
    }
});

/**
Wraps the callback in another function to catch exceptions and turn them into
rejections.

@method _wrap
@param {Function} resolve Resolving function of the resolver that
                    handles this promise
@param {Function} reject Rejection function of the resolver that
                    handles this promise
@param {Function} fn Callback to wrap
@return {Function}
@private
**/
Promise._wrap = function (resolve, reject, fn) {
    // callbacks and errbacks only get one argument
    return function (valueOrReason) {
        var result;

        // Promises model exception handling through callbacks
        // making both synchronous and asynchronous errors behave
        // the same way
        try {
            // Use the argument coming in to the callback/errback from the
            // resolution of the parent promise.
            // The function must be called as a normal function, with no
            // special value for |this|, as per Promises A+
            result = fn(valueOrReason);
        } catch (e) {
            reject(e);
            return;
        }

        resolve(result);
    };
};

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
    var then;
    // We test promises by structure to be able to identify other
    // implementations' promises. This is important for cross compatibility and
    // In particular Y.when which should recognize any kind of promise
    // Use try...catch when retrieving obj.then. Return false if it throws
    // See Promises/A+ 1.1
    try {
        then = obj.then;
    } catch (_) {}
    return typeof then === 'function';
};

/**
Ensures that a certain value is a promise. If it is not a promise, it wraps it
in one.

This method can be copied or inherited in subclasses. In that case it will
check that the value passed to it is an instance of the correct class.
This means that `PromiseSubclass.resolve()` will always return instances of
`PromiseSubclass`.

@method resolve
@param {Any} Any object that may or may not be a promise
@return {Promise}
@static
**/
Promise.resolve = function (value) {
    return Promise.isPromise(value) && value.constructor === this ? value :
        /*jshint newcap: false */
        new this(function (resolve) {
        /*jshint newcap: true */
            resolve(value);
        });
};

/**
A shorthand for creating a rejected promise.

@method reject
@param {Any} reason Reason for the rejection of this promise. Usually an Error
    Object
@return {Promise} A rejected promise
@static
**/
Promise.reject = function (reason) {
    /*jshint newcap: false */
    return new this(function (resolve, reject) {
    /*jshint newcap: true */
        reject(reason);
    });
};

/**
Returns a promise that is resolved or rejected when all values are resolved or
any is rejected. This is useful for waiting for the resolution of multiple
promises, such as reading multiple files in Node.js or making multiple XHR
requests in the browser.

@method all
@param {Any[]} values An array of any kind of values, promises or not. If a value is not
@return [Promise] A promise for an array of all the fulfillment values
@static
**/
Promise.all = function (values) {
    var Promise = this;
    return new Promise(function (resolve, reject) {
        if (!Lang.isArray(values)) {
            reject(new TypeError('Promise.all expects an array of values or promises'));
            return;
        }

        var remaining = values.length,
            i         = 0,
            length    = values.length,
            results   = [];

        function oneDone(index) {
            return function (value) {
                results[index] = value;

                remaining--;

                if (!remaining) {
                    resolve(results);
                }
            };
        }

        if (length < 1) {
            return resolve(results);
        }

        for (; i < length; i++) {
            Promise.resolve(values[i]).then(oneDone(i), reject);
        }
    });
};

/**
Returns a promise that is resolved or rejected when any of values is either
resolved or rejected. Can be used for providing early feedback in the UI
while other operations are still pending.

@method race
@param {Any[]} values An array of values or promises
@return {Promise}
@static
**/
Promise.race = function (values) {
    var Promise = this;
    return new Promise(function (resolve, reject) {
        if (!Lang.isArray(values)) {
            reject(new TypeError('Promise.race expects an array of values or promises'));
            return;
        }

        // just go through the list and resolve and reject at the first change
        // This abuses the fact that calling resolve/reject multiple times
        // doesn't change the state of the returned promise
        for (var i = 0, count = values.length; i < count; i++) {
            Promise.resolve(values[i]).then(resolve, reject);
        }
    });
};

Y.Promise = Promise;

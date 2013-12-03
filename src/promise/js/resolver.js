/**
Represents an asynchronous operation. Provides a
standard API for subscribing to the moment that the operation completes either
successfully (`fulfill()`) or unsuccessfully (`reject()`).

@class Promise.Resolver
@constructor
@param {Promise} promise The promise instance this resolver will be handling
**/
function Resolver(promise) {
    /**
    List of success callbacks

    @property _callbacks
    @type Array
    @private
    **/
    this._callbacks = [];

    /**
    List of failure callbacks

    @property _errbacks
    @type Array
    @private
    **/
    this._errbacks = [];

    /**
    The promise for this Resolver.

    @property promise
    @type Promise
    @deprecated
    **/
    this.promise = promise;

    /**
    The status of the operation. This property may take only one of the following
    values: 'pending', 'fulfilled' or 'rejected'.

    @property _status
    @type String
    @default 'pending'
    @private
    **/
    this._status = 'pending';

    /**
    This value that this promise represents.

    @property _result
    @type Any
    @private
    **/
    this._result = null;
}

Y.mix(Resolver.prototype, {
    /**
    Resolves the promise, signaling successful completion of the
    represented operation. All "onFulfilled" subscriptions are executed and passed
    the value provided to this method. After calling `fulfill()`, `reject()` and
    `notify()` are disabled.

    @method fulfill
    @param {Any} value Value to pass along to the "onFulfilled" subscribers
    **/
    fulfill: function (value) {
        if (this._status === 'pending') {
            this._result = value;
            this._status = 'fulfilled';
        }

        if (this._status === 'fulfilled') {
            this._notify(this._callbacks, this._result);

            // Reset the callback list so that future calls to fulfill()
            // won't call the same callbacks again. Promises keep a list
            // of callbacks, they're not the same as events. In practice,
            // calls to fulfill() after the first one should not be made by
            // the user but by then()
            this._callbacks = [];

            // Once a promise gets fulfilled it can't be rejected, so
            // there is no point in keeping the list. Remove it to help
            // garbage collection
            this._errbacks = null;
        }
    },

    /**
    Resolves the promise, signaling *un*successful completion of the
    represented operation. All "onRejected" subscriptions are executed with
    the value provided to this method. After calling `reject()`, `resolve()`
    and `notify()` are disabled.

    @method reject
    @param {Any} value Value to pass along to the "reject" subscribers
    **/
    reject: function (reason) {
        if (this._status === 'pending') {
            this._result = reason;
            this._status = 'rejected';
        }

        if (this._status === 'rejected') {
            if (!this._errbacks.length) { Y.log('This promise was rejected but no error handlers were registered to it', 'info', NAME); }
            this._notify(this._errbacks, this._result);

            // See fulfill()
            this._callbacks = null;
            this._errbacks = [];
        }
    },

    /*
    Given a certain value A passed as a parameter, this method resolves the
    promise to the value A.

    If A is a promise, `resolve` will cause the resolver to adopt the state of A
    and once A is resolved, it will resolve the resolver's promise as well.
    This behavior "flattens" A by calling `then` recursively and essentially
    disallows promises-for-promises.

    This is the default algorithm used when using the function passed as the
    first argument to the promise initialization function. This means that
    the following code returns a promise for the value 'hello world':

        var promise1 = new Y.Promise(function (resolve) {
            resolve('hello world');
        });
        var promise2 = new Y.Promise(function (resolve) {
            resolve(promise1);
        });
        promise2.then(function (value) {
            assert(value === 'hello world'); // true
        });

    @method resolve
    @param [Any] value A regular JS value or a promise
    */
    resolve: function (value) {
        var self = this;

        if (Promise.isPromise(value)) {
            value.then(function (value) {
                self.resolve(value);
            }, function (reason) {
                self.reject(reason);
            });
        } else {
            this.fulfill(value);
        }
    },

    /**
    Schedule execution of a callback to either or both of "resolve" and
    "reject" resolutions for the Resolver.  The callbacks
    are wrapped in a new Resolver and that Resolver's corresponding promise
    is returned.  This allows operation chaining ala
    `functionA().then(functionB).then(functionC)` where `functionA` returns
    a promise, and `functionB` and `functionC` _may_ return promises.

    @method then
    @param {Function} [callback] function to execute if the Resolver
                resolves successfully
    @param {Function} [errback] function to execute if the Resolver
                resolves unsuccessfully
    @return {Promise} The promise of a new Resolver wrapping the resolution
                of either "resolve" or "reject" callback
    @deprecated
    **/
    then: function (callback, errback) {
        return this.promise.then(callback, errback);
    },

    /**
    Schedule execution of a callback to either or both of "resolve" and
    "reject" resolutions of this resolver. If the resolver is not pending,
    the correct callback gets called automatically.

    @method addCallbacks
    @param {Function} [callback] function to execute if the Resolver
                resolves successfully
    @param {Function} [errback] function to execute if the Resolver
                resolves unsuccessfully
    **/
    addCallbacks: function (callback, errback) {
        var callbackList = this._callbacks,
            errbackList  = this._errbacks,
            status       = this._status,
            result       = this._result;

        // Because the callback and errback are represented by a Resolver, it
        // must be fulfilled or rejected to propagate through the then() chain.
        // The same logic applies to resolve() and reject() for fulfillment.
        if (callbackList) {
            callbackList.push(callback);
        }
        if (errbackList) {
            errbackList.push(errback);
        }

        // If a promise is already fulfilled or rejected, notify the newly added
        // callbacks by calling fulfill() or reject()
        if (status === 'fulfilled') {
            this.fulfill(result);
        } else if (status === 'rejected') {
            this.reject(result);
        }
    },

    /**
    Wraps the callback in Y.soon to guarantee its asynchronous execution. It
    also catches exceptions to turn them into rejections and links promises
    returned from the `then` callback.

    @method _wrap
    @param {Function} thenFulfill Fulfillment function of the resolver that
                        handles this promise
    @param {Function} thenReject Rejection function of the resolver that
                        handles this promise
    @param {Function} fn Callback to wrap
    @return {Function}
    @private
    **/
    _wrap: function (thenFulfill, thenReject, fn) {
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
                // calling return only to stop here
                return thenReject(e);
            }

            if (Promise.isPromise(result)) {
                // Returning a promise from a callback makes the current
                // promise sync up with the returned promise
                result.then(thenFulfill, thenReject);
            } else {
                // Non-promise return values always trigger resolve()
                // because callback is affirmative, and errback is
                // recovery.  To continue on the rejection path, errbacks
                // must return rejected promises or throw.
                thenFulfill(result);
            }
        };
    },

    /**
    Returns the current status of the Resolver as a string "pending",
    "fulfilled", or "rejected".

    @method getStatus
    @return {String}
    @deprecated
    **/
    getStatus: function () {
        Y.log('resolver.getStatus() will be removed in the future', 'warn', NAME);
        return this._status;
    },

    /**
    Executes an array of callbacks from a specified context, passing a set of
    arguments.

    @method _notify
    @param {Function[]} subs The array of subscriber callbacks
    @param {Any} result Value to pass the callbacks
    @protected
    **/
    _notify: function (subs, result) {
        // Since callback lists are reset synchronously, the subs list never
        // changes after _notify() receives it. Avoid calling Y.soon() for
        // an empty list
        if (subs.length) {
            // Calling all callbacks after Y.soon to guarantee
            // asynchronicity. Because setTimeout can cause unnecessary
            // delays that *can* become noticeable in some situations
            // (especially in Node.js)
            Y.soon(function () {
                var i, len;

                for (i = 0, len = subs.length; i < len; ++i) {
                    subs[i](result);
                }
            });
        }
    }

}, true);

Y.Promise.Resolver = Resolver;

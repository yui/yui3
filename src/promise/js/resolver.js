/**
Represents an asynchronous operation. Provides a
standard API for subscribing to the moment that the operation completes either
successfully (`fulfill()`) or unsuccessfully (`reject()`).

@class Promise.Resolver
@constructor
**/
function Resolver() {
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

    /**
    The status of the operation. This property may take only one of the following
    values: 'pending', 'fulfilled' or 'rejected'.

    @property _status
    @type String
    @default 'pending'
    @private
    **/
    this._status = 'pending';
}

Y.mix(Resolver.prototype, {
    /**
    Resolves the promise, signaling successful completion of the
    represented operation. All "onFulfilled" subscriptions are executed and passed
    the value provided to this method. After calling `fulfill()`, `reject()` is
    disabled.

    @method fulfill
    @param {Any} value Value to pass along to the "onFulfilled" subscribers
    **/
    fulfill: function (value) {
        if (this._status === 'pending') {
            this._result = value;
        }

        if (this._status !== 'rejected') {
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

            this._status = 'fulfilled';
        }
    },

    /**
    Resolves the promise with the provided value. If the value is a promise
    `resolve()` will call its `then()` method to adopt its state.

    @method resolve
    @param {Any} value Either a promise or a value. If value is a promise,
                    `resolve()` will adopt its state
    **/
    resolve: function (value) {
        var self = this;

        // If the resolver is already resolved, return early to avoid
        // unnecessary calls to isPromise() and then().
        // It is safe to return early only because then() does not call
        // resolve() to notify callbacks when already resolved (it uses
        // fulfill() instead)
        if (this._status !== 'pending') {
            return;
        }

        if (Promise.isPromise(value)) {
            value.then(function (x) {
                // This essentially makes the process recursive, flattening
                // promises for promises. This is still a topic of discussion
                // in the community
                self.resolve(x);
            }, function (e) {
                self.reject(e);
            });
        } else {
            this.fulfill(value);
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
        }

        if (this._status !== 'fulfilled') {
            this._notify(this._errbacks, this._result);

            // See fulfill()
            this._callbacks = null;
            this._errbacks = [];

            this._status = 'rejected';
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
    **/
    then: function (callback, errback) {
        var self = this,
            callbackList = this._callbacks || [],
            errbackList  = this._errbacks  || [],
            status       = this._status,
            result       = this._result;

        // When the current promise is fulfilled or rejected, either the
        // callback or errback will be executed via the function pushed onto
        // this._callbacks or this._errbacks.  However, to allow then()
        // chaining, it must return a new promise
        return new Promise(function (resolve, reject) {
            // Because the callback and errback are represented by a Resolver, it
            // must be fulfilled or rejected to propagate through the then() chain.
            // The same logic applies to resolve() and reject() for fulfillment.
            callbackList.push(typeof callback === 'function' ?
                self._wrap(resolve, reject, callback) : resolve);
            errbackList.push(typeof errback === 'function' ?
                self._wrap(resolve, reject, errback) : reject);

            // If a promise is already fulfilled or rejected, notify the newly added
            // callbacks by calling fulfill() or reject()
            if (status === 'fulfilled') {
                self.fulfill(result);
            } else if (status === 'rejected') {
                self.reject(result);
            }
        });
    },

    /**
    Wraps the callback in Y.soon to guarantee its asynchronous execution. It
    also catches exceptions to turn them into rejections and links promises
    returned from the `then` callback.

    @method _wrap
    @param {Function} thenResolve `resolve()` function of the resolver that
                        handles this promise
    @param {Function} thenReject Rejection function of the resolver that
                        handles this promise
    @param {Function} fn Callback to wrap
    @return {Function}
    @private
    **/
    _wrap: function (thenResolve, thenReject, fn) {
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

            // resolve() checks if the result is a promise or a thenable and
            // adopts it or assimilates it
            thenResolve(result);
        };
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

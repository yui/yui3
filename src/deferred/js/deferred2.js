/**
Wraps the execution of synchronous or asynchronous operations, providing a
promise object that can be used to subscribe to the various ways the operation
may terminate.

When the operation completes successfully, call the Deferred's `resolve()`
method, passing any relevant response data for subscribers.  If the operation
encounters an error or is unsuccessful in some way, call `reject()`, again
passing any relevant data for subscribers.

The Deferred object should be shared only with the code resposible for
resolving or rejecting it. Public access for the Deferred is through its
_promise_, which is returned from the Deferred's `promise()` method. While both
Deferred and promise allow subscriptions to the Deferred's state changes, the
promise may be exposed to non-controlling code. It is the preferable interface
for adding subscriptions.

Subscribe to state changes in the Deferred with the promise's
`then(callback, errback)` method.  `then()` wraps the passed callbacks in a
new Deferred and returns the corresponding promise, allowing chaining of
asynchronous or synchronous operations. E.g.
`promise.then(someAsyncFunc).then(anotherAsyncFunc)`

@module deferred
@since 3.7.0
**/
var slice = [].slice,
    
/**
The public API for a Deferred.  Used to subscribe to the notification events for
resolution or progress of the operation represented by the Deferred.

@class Promise
@constructor
@param {Deferred} deferred The Deferred object that the promise represents
**/
Y.Promise = function (deferred) {
    this._deferred = deferred;
};

/**
Schedule execution of a callback to either or both of "resolve" and
"reject" resolutions for the associated Deferred.  The callbacks
are wrapped in a new Deferred and that Deferred's corresponding promise
is returned.  This allows operation chaining ala
`functionA().then(functionB).then(functionC)` where `functionA` returns
a promise, and `functionB` and `functionC` _may_ return promises.

@method then
@param {Function} [callback] function to execute if the Deferred
            resolves successfully
@param {Function} [errback] function to execute if the Deferred
            resolves unsuccessfully
@return {Promise} The promise of a new Deferred wrapping the resolution
            of either "resolve" or "reject" callback
**/
Y.Promise.prototype.then = function (callback, errback) {
    var deferred = this._deferred;
    return deferred.then.apply(deferred, arguments);
};

/**
Returns this promise.  Meta, or narcissistic?  Useful to test if an object is a
Deferred or Promise when the intention is to call its `then()` or `on()` method.

@method promise
@return {Promise} This.
**/
Y.Promise.prototype.promise = function () {
    return this;
};



/**
Represents an operation that may be synchronous or asynchronous.  Provides a
standard API for subscribing to the moment that the operation completes either
successfully (`resolve()`) or unsuccessfully (`reject()`).

@class Deferred
@constructor
**/
Y.Deferred = function () {
    this._subs = {
        resolve: [],
        reject : []
    };

    this._promise = new Y.Promise(this);

    this._status = 'in progress';

    this._result;
};

Y.mix(Y.Deferred.prototype, {
    /**
    Returns the promise for this Deferred.

    @method promise
    @return {Promise}
    **/
    promise: function () {
        return this._promise;
    },

    /**
    Resolves the Deferred, signaling successful completion of the
    represented operation. All "resolve" subscriptions are executed with
    all arguments passed in. Future "resolve" subscriptions will be
    executed immediately with the same arguments. `reject()` and `notify()`
    are disabled.

    @method resolve
    @param {Any} arg* Any data to pass along to the "resolve" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    resolve: function () {
        this._result = slice.call(arguments);

        this._notify(this._subs.resolve, this.promise(), this._result);

        this._subs = { resolve: [] };

        this._status = 'resolved';

        return this;
    },

    /**
    Resolves the Deferred, signaling *un*successful completion of the
    represented operation. All "reject" subscriptions are executed with
    all arguments passed in. Future "reject" subscriptions will be
    executed immediately with the same arguments. `resolve()` and `notify()`
    are disabled.

    @method reject
    @param {Any} arg* Any data to pass along to the "reject" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    reject: function () {
        this._result = slice.call(arguments);

        this._notify(this._subs.reject, this.promise(), this._result);

        this._subs = { reject: [] };

        this._status = 'rejected';

        return this;
    },

    /**
    Schedule execution of a callback to either or both of "resolve" and
    "reject" resolutions for the Deferred.  The callbacks
    are wrapped in a new Deferred and that Deferred's corresponding promise
    is returned.  This allows operation chaining ala
    `functionA().then(functionB).then(functionC)` where `functionA` returns
    a promise, and `functionB` and `functionC` _may_ return promises.

    @method then
    @param {Function} [callback] function to execute if the Deferred
                resolves successfully
    @param {Function} [errback] function to execute if the Deferred
                resolves unsuccessfully
    @return {Promise} The promise of a new Deferred wrapping the resolution
                of either "resolve" or "reject" callback
    **/
    then: function (callback, errback) {
        var then    = new Y.Deferred(),
            promise = this.promise(),
            resolveSubs = this._subs.resolve || [],
            rejectSubs  = this._subs.reject  || [],
            resolveFn, rejectFn;

        resolveSubs.push((typeof callback === 'function') ?
            function () {
                var result = callback.apply(promise, arguments);

                if (result && typeof result.promise === 'function') {
                    result.promise().then(then.resolve, then.reject);
                } else {
                    then.resolve.apply(promise, result);
                }
            } :
            then.resolve);

        rejectSubs.push((typeof errback === 'function') ?
            function () {
                var result = errback.apply(promise, arguments);

                if (result && typeof result.promise === 'function') {
                    result.promise().then(then.resolve, then.reject);
                } else {
                    then.reject.apply(promise, result);
                }
            } :
            then.reject);

        if (this._status === 'resolved') {
            this.resolve.apply(this, this._result);
        } else if (this._status === 'rejected') {
            this.reject.apply(this, this._result);
        }

        return then.promise();
    },

    /**
    Returns the current status of the Deferred as a string "in progress",
    "resolved", or "rejected".

    @method getStatus
    @return {String}
    **/
    getStatus: function () {
        return this._status;
    },

    /**
    Executes an array of callbacks from a specified context, passing a set of
    arguments.

    @method _notify
    @param {Function[]} subs The array of subscriber callbacks
    @param {Object} context The `this` object for the callbacks
    @param {Any[]} args Any arguments to pass the callbacks
    @protected
    **/
    _notify: function (subs, context, args) {
        var i, len;

        if (subs) {
            for (i = 0, len = subs.length; i < len; ++i) {
                subs[i].apply(context, args);
            }
        }
    }

}, true);

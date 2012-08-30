/**
Wraps the execution of synchronous or asynchronous operations, providing a
promise object that can be used to subscribe to the various ways the operation
may terminate.

When the operation completes successfully, call the Deferred's `resolve()`
method, passing any relevant response data for subscribers.  If the operation
encounters an error or is unsuccessful in some way, call `reject()`, again
passing any relevant data for subscribers.  If the operation can be monitored
in stages, call the Deferred's `notify()` method at these stages with the
relevant data.

The Deferred object should be shared only with the code resposible for
resolving or rejecting it. Public access for the Deferred is through its
_promise_, which is returned from the Deferred's `promise()` method. While both
Deferred and promise allow subscriptions to the Deferred's state changes, the
promise may be exposed to non-controlling code. It is the preferable interface
for adding subscriptions.

Subscriptions can be made against the promise or Deferred in one of two ways:

1. Using `promise.on("resolve", callback)` (and so for "reject" and "progress")
2. Using `promise.then(resolveCallback, rejectCallback)`

The difference between the two is that `then()` wraps the callbacks in a new
Deferred, allowing asynchronous operation chaining with
`promise.then(someAsyncFunc).then(anotherAsyncFunc)` etc.. Subscribing to a
state event directly does not wrap the callback execution. Also, `then()` does
not support subscribing to the "progress" event.

@module deferred
@since 3.7.0
**/
var slice = [].slice,
    RESOLVE = 'resolve',
    REJECT  = 'reject',
    FUNCTION = 'function',

    eventMap = {
        resolve : RESOLVE,
        resolved: RESOLVE,
        done    : RESOLVE,
        complete: RESOLVE,
        success : RESOLVE,

        reject  : REJECT,
        rejected: REJECT,
        fail    : REJECT,
        failed  : REJECT,
        failure : REJECT,

        progress: 'progress',
        notify  : 'progress'
    };

// Custom events are heavy and slow.  Let's keep this simple for now.
function notify(subs, context, args) {
    var i, len;

    if (subs) {
        for (i = 0, len = subs.length; i < len; ++i) {
            subs[i].apply(context, args);
        }
    }
}

/**
The public API for a Deferred.  Used to subscribe to the notification events for
resolution or progress of the operation represented by the Deferred.

This class is mainly a placeholder for type checking (if you're into that sort
of thing).  It has neither constructor logic, nor prototype methods. Each
Promise instance is manually created by the Deferred that it represents.

@class Promise
@constructor
**/
Y.Promise = function () {};

/**
Schedule execution of a callback to either or both of "resolve" and
"reject" resolutions for the associated Deferred.  Unlike `on()`, the callbacks
are wrapped in a new Deferred and that Deferred's corresponding promise
is returned.  This allows operation chaining ala
`functionA().then(functionB).then(functionC)` where `functionA` returns
a promise, and `functionB` and `functionC` _may_ return promises.

To subscribe to the progress of the operation wrapped by the current
Deferred, call `promise.on("progress", callback)`.

@method then
@param {Function} [resolveFn] function to execute if the Deferred
            resolves successfully
@param {Function} [rejectFn] function to execute if the Deferred
            resolves unsuccessfully
@return {Promise} The promise of a new Deferred wrapping the resolution
            of either "resolve" or "reject" callback
**/

/**
Subscribe to the Deferred's resolution events "resolve" and "reject", or
to a "progress" event for notifications during the life of the wrapped
operation (if that operation supports progress notification).

Supported aliases for event names are:

* "resolved"
* "done"
* "complete"
* "success"
* "rejected"
* "fail"
* "failed"
* "failure"
* "notify" (for "progress")

@method on
@param {String} when Any of the listed event names. Others are ignored.
@param {Function} callback Function to execute
@return {Promise} This promise
@chainable
**/

/**
Returns this promise.  Meta, or narcissistic?  Useful to test if an object is a
Deferred or Promise when the intention is to call its `then()` or `on()` method.

@method promise
@return {Promise} This.
**/



/**
Factory/Constructor method (can be used with or without `new`) for creating a
Deferred object and corresponding promise.

If an _executor_ function is provided, it will be called immediately with the
new Deferred object as its sole parameter. Ostensibly, this function is for
executing code in which the Deferred object is `resolve()`d or `reject()`ed.

@class Deferred
@constructor
@param {Function} [executor] Function to 
@return {Deferred}
**/
Y.Deferred = function (executor) {
    var _subs = {
            resolve : [],
            reject  : [],
            progress: []
        },

        status = 'in progress',

        deferred = Y.Object(Y.Deferred.prototype),
        promise  = new Y.Promise(),
        
        result;
    
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
    deferred.resolve = function () {
        result = slice.call(arguments);

        notify(_subs.resolve, promise, result);

        _subs = { resolve: [] };

        status = 'resolved';

        return deferred;
    };

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
    deferred.reject = function () {
        result = slice.call(arguments);

        notify(_subs.rejected, promise, result);

        _subs = { reject: [] };

        status = 'rejected';

        return deferred;
    };

    /**
    If the Deferred is still in progress (not resolved or rejected), this
    notifies "progress" subscribers with any data passed in.

    @method notify
    @param {Any} arg* Any data to pass along to the "progress" subscribers
    @return {Deferred} the instance
    @chainable
    **/
    deferred.notify = function () {
        if (status === 'in progress') {
            notify(_subs.progress, promise, arguments);
        }

        return deferred;
    };

    /**
    Subscribe to the Deferred's resolution events "resolve" and "reject", or
    to a "progress" event for notifications during the life of the wrapped
    operation (if that operation supports progress notification).

    Supported aliases for event names are:
    
    * "resolved"
    * "done"
    * "complete"
    * "success"
    * "rejected"
    * "fail"
    * "failed"
    * "failure"
    * "notify" (for "progress")

    @method on
    @param {String} when Any of the listed event names. Others are ignored.
    @param {Function} callback Function to execute
    @return {Promise} the Promise for this Deferred (not a new Deferred)
    **/
    deferred.on = function (when, callback) {
        var event = eventMap[when],
            subs  = event && _subs[event];

        switch (status) {
            case 'in progress':
                if (subs) {
                    subs.push(callback);
                } // else bogus value passed to when
                break;
            case 'resolved':
                if (event === 'resolve') {
                    notify([callback], promise, result);
                } // else subscribing to unreachable event
                break;
            case 'rejected':
                if (event === 'reject') {
                    notify([callback], promise, result);
                } // else subscribing to unreachable event
                break;
        }

        // I decided to return `this` instead of a new Deferred promise for
        // lighter runtime and because I'm going against spec and excluding
        // the progress callback from the then() implementation.
        return this;
    };

    /**
    Returns the promise for this Deferred.

    @method promise
    @return {Promise}
    **/
    deferred.promise = function () {
        return promise;
    };

    /**
    Schedule execution of a callback to either or both of "resolve" and
    "reject" resolutions for the Deferred.  Unlike `on()`, the callbacks
    are wrapped in a new Deferred and that Deferred's corresponding promise
    is returned.  This allows operation chaining ala
    `functionA().then(functionB).then(functionC)` where `functionA` returns
    a promise, and `functionB` and `functionC` _may_ return promises.

    To subscribe to the progress of the operation wrapped by the current
    Deferred, call `promise.on("progress", callback)`.

    @method then
    @param {Function} [resolveFn] function to execute if the Deferred
                resolves successfully
    @param {Function} [rejectFn] function to execute if the Deferred
                resolves unsuccessfully
    @return {Promise} The promise of a new Deferred wrapping the resolution
                of either "resolve" or "reject" callback
    **/
    deferred.then = function (resolveFn, rejectFn) {
        var then = new Y.Deferred();
        
        function wrap(callback) {
            return function () {
                var result = callback.apply(promise, arguments);
                
                if (result && (typeof result.promise === FUNCTION)) {
                    result.promise()
                          .on(RESOLVE, then.resolve)
                          .on(REJECT,  then.reject);
                } else {
                    then.resolve(result);
                }
            };
        }
        
        if (typeof resolveFn === FUNCTION) {
            deferred.on(RESOLVE, wrap(resolveFn));
        }

        if (typeof rejectFn === FUNCTION) {
            deferred.on(REJECT, wrap(rejectFn));
        }

        return then.promise();
    };

    // The promise API is limited to subscriptions. Resolution is under the
    // control of the creator of the Deferred. Passing the Deferred to other
    // functions should be avoided unless that function is specifically
    // responsible for resolving the Deferred.
    promise.on      = deferred.on;
    promise.then    = deferred.then;
    promise.promise = deferred.promise;

    // TODO: is this necessary? Seems more pure without it.  It's implementer
    // code one way or another.
    if (typeof executor === FUNCTION) {
        executor.call(promise, deferred);
    }

    return deferred;
};

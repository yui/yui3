/**
The public API for a Deferred.  Used to subscribe to the notification events for
resolution or progress of the operation represented by the Deferred.

@class Promise
@constructor
@param {Deferred} deferred The Deferred object that the promise represents
**/
function Promise(deferred) {
    this._deferred = deferred;
}

/**
Adds a method or array of methods to the Promise prototype to relay to the
so named method on the associated Deferred.

DO NOT use this expose the Deferred's `resolve` or `reject` methods on the
Promise.

@method addMethod
@param {String|String[]} methods String or array of string names of functions
                                 already defined on the Deferred to expose on
                                 the Promise prototype.
@static
**/
Promise.addMethod = function(methods) {
    if (!isArray(methods)) {
        methods = [methods];
    }

    Y.Array.each(methods, function (method) {
        Promise.prototype[method] = function () {
            return this._deferred[method].apply(this._deferred, arguments);
        };
    });
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

/**
Returns this promise.  Meta, or narcissistic?  Useful to test if an object
is a Deferred or Promise when the intention is to call its `then()`,
`getStatus()`, or `getResult()` method.

@method promise
@return {Promise} This.
**/

/**
Returns the current status of the Deferred. Possible results are
"in progress", "resolved", and "rejected".

@method getStatus
@return {String}
**/

/**
Returns the result of the Deferred.  Use `getStatus()` to test that the
promise is resolved before calling this.

@method getResult
@return {Any[]} Array of values passed to `resolve()` or `reject()`
**/
Promise.addMethod(['then', 'promise', 'getStatus', 'getResult']);

Y.Promise = Promise;

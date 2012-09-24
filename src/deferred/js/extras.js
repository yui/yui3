/**
Adds additional functionality to Y.Deferred and Y.Promise.

* `promise.onProgress(callback)` to register lifecycle status subscribers
* `deferred.notify(args*)` to notify progress subscribers
* `promise.wait(ms)` to insert a delay into a promise chain

@module deferred
@submodule deferred-extras
@since 3.7.0
@for Deferred
**/

var slice = [].slice,
    isFunction = Y.Lang.isFunction;

Y.mix(Y.Deferred.prototype, {
    /**
    Creates a Y.Deferred that will resolve in the specified amount of
    milliseconds.  Returns the Deferred's promise to allow sequential chaining
    of operations after the inserted pause.

    @method wait
    @param {Number} ms Number of milliseconds to wait before resolving
    @return {Promise}
    **/
    wait: function (ms) {
        var deferred = new Y.Deferred(),
            promise  = deferred.promise(),
            timeout;

        // || 0 catches 0 and NaN
        ms = Math.max(0, +ms || 0);

        this.then(function () {
            var args = slice.call(arguments);

            timeout = setTimeout(function () {
                deferred.resolve.apply(deferred, args);
            }, ms);
        });

        promise.cancel = function () {
            clearTimeout(timeout);
            deferred.reject.apply(deferred, arguments);
        };

        return promise;
    },

    /**
    Executes callbacks registered with `onProgress`, relaying all arguments.
    This will only work when the Deferred has not been resolved or rejected
    (the represented operation is still active).

    @method notify
    @param {Any} arg* Any arguments to pass to the callbacks
    @return {Deferred} This Deferred
    @chainable
    **/
    notify: function () {
        var subs    = this._subs.progress || [],
            promise = this.promise(),
            args    = slice.call(arguments),
            i, len;

        for (i = 0, len = subs.length; i < len; ++i) {
            subs[i].apply(promise, args);
        }

        return this;
    },

    /**
    Registers a callback to be executed with progress updates from the operation
    represented by this Deferred (if it can and does notify of progress).

    @method onProgress
    @param {Function} callback The callback to notify
    @return {Promise} The Deferred's promise
    **/
    onProgress: function (callback) {
        var subs = this._subs;

        // no-op subscribers after resolution
        if (this._status === 'in progress') {
            // First call, need to supplement the subs collection with an array
            // for progress listeners
            if (!subs.progress) {
                subs.progress = [];
            }

            subs.progress.push(callback);
        }

        return this.promise();
    },

    /**
    Returns `true` if the Deferred has been resolved.

    @method isResolved
    @return {Boolean}
    **/
    isResolved: function () {
        return this._status === 'resolved';
    },

    /**
    Returns `true` if the Deferred has been rejected.

    @method isRejected
    @return {Boolean}
    **/
    isRejected: function () {
        return this._status === 'rejected';
    },

    /**
    Returns `true` if the Deferred has not yet been resolved or rejected.

    @method isInProgress
    @return {Boolean}
    **/
    isInProgress: function () {
        return this._status === 'in progress';
    }

}, true);

/**
Registers a callback to be executed with progress updates from the operation
represented by this Deferred (if it can and does notify of progress).

@method onProgress
@param {Function} callback The callback to notify
@return {Promise} The Deferred's promise
@for Promise
**/

/**
Creates a Y.Deferred that will resolve in the specified amount of milliseconds.
Returns the Deferred's promise to allow sequential chaining of operations.

@method wait
@param {Number} ms Number of milliseconds to wait before resolving
@return {Promise}
**/

/**
Returns `true` if the Deferred has been resolved.

@method isResolved
@return {Boolean}
**/

/**
Returns `true` if the Deferred has been rejected.

@method isRejected
@return {Boolean}
**/

/**
Returns `true` if the Deferred has not yet been resolved or rejected.

@method isInProgress
@return {Boolean}
**/
Y.Promise.addMethod(
    ['wait', 'onProgress', 'isResolved', 'isRejected', 'isInProgress']);

Y.mix(Promise.Resolver.prototype, {
    /**
    Returns the current status of the Resolver as a string "pending",
    "fulfilled", or "rejected".

    @for Promise.Resolver
    @method getStatus
    @return {String} The status of the resolver
    **/
    getStatus: function () {
        return this._status;
    },

    /**
    Takes callbacks for the success and failure resolutions like `then()` but
    does not return a new promise and so thrown errors are not turned into
    rejections.

    @for Promise.Resolver
    @method _done
    @param {Function} [callback] Callback for the success case
    @param {Function} [errback] Callback for the failure case
    @private
    **/
    _done: function (callback, errback) {
        var callbackList = this._callbacks || [],
                errbackList  = this._errbacks  || [];
        
        if (typeof callback === 'function') {
            callbackList.push(callback);
        }
        errbackList.push(
            // if no errback is provided, we want done() to just throw
            typeof errback === 'function' ? errback : function (e) {
                throw e;
            }
        );
        
        if (this._status === 'fulfilled') {
            this.fulfill(this._result);
        }
        if (this._status === 'rejected') {
            this.reject(this._result);
        }
    }
});

Y.mix(Promise.prototype, {
    /**
    Takes callbacks for the success and failure resolutions like `then()` but
    does not return a new promise and so thrown errors are not turned into
    rejections.

    By default `done()` throws the rejection reason for the promise, so adding
    `.done()` without arguments at the end of your promise chain will turn
    rejections into a thrown exception.

    @for Promise
    @method done
    @param {Function} [callback] Callback for the success case
    @param {Function} [errback] Callback for the failure case
    @since @SINCE@
    **/
    done: function (callback, errback) {
        this._resolver._done(callback, errback);
    },
    /**
    Returns the current status of the operation. Possible results are
    "pending", "fulfilled", and "rejected".

    @for Promise
    @method getStatus
    @return {String}
    **/
    getStatus: function () {
        return this._resolver.getStatus();
    }
});

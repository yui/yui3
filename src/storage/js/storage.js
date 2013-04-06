Y.mix(Y.Promise.Resolver.prototype, {
    _makeAsync: function (fn) {
        return function () {
            var args = arguments;
            Y.soon(function () {
                fn.apply(undefined, args);
            });
        };
    },
    done: function (callback, errback) {
        var callbackList = this._callbacks || [],
                errbackList  = this._errbacks  || [];
        
        if (typeof callback === 'function') {
            callbackList.push(this._makeAsync(callback));
        }
        errbackList.push(this._makeAsync(
            typeof errback === 'function' ? errback : function (e) {
                throw e;
            }
        ));
        
        if (this._status === 'fulfilled') {
            this.fulfill(this._result);
        } else if (this._status === 'rejected') {
            this.reject(this._result);
        }
    }
});

Y.Promise.prototype.done = function (callback, errback) {
    return this._resolver.done(callback, errback);
};

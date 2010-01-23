(function() {

var M = function(Y) {
    var io = function() {
        io.superclass.constructor.apply(this, arguments);
    };

    io.NAME = 'io';
    io.NS = 'io';

    var proto = {
        initializer: function(config) {
        },
    
        request: function() {
            var self = this;
            this._request = Y.io.asyncRequest(
                    this.get('method'),
                    this.get('src'),
                    { success: function() { // TODO: move to events
                        self._onSuccess.apply(self, arguments)}
                    },
                    this.get('handler'),
                    this.get('postData')
            );
        },

        abort: function(callback, isTimeout) {
            Y.io.abort(this._request, callback, isTimeout);
        },

        _onComplete: function() {
            this.onComplete();
            this.fire('complete');
        },
        _onSuccess: function() {
            this.onSuccess.apply(this, arguments);
            this.fire('success');
        },
        _onFailure: function() {
            this.onFailure();
            this.fire('failure');
        },
        toString: function() {
            return 'io Plugin';
        },
        _request: null
    };

    io.ATTRS = {
        'src': {},
        'cacheRequest': {
            value: true
        },
        'timeout': {
            value: false
        },
        'method': {
            value: 'get'
        },
        'postData': {}

    };

    // Extend
    Y.lang.extend(io, Y.Plugin, proto);
    Y.IOPlugin = io;
};
YUI.add("ioplugin", M, "3.0.0");
})();

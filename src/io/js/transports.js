var _default,
    XHR = win && win.XMLHttpRequest,
    XDR = win && win.XDomainRequest;

Y.mix(Y.IO.prototype, {
    transports: {
        xhr: function () {
            return XHR ? new XMLHttpRequest() :
                ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : null;
        },
        xdr: function () {
            return XDR ? new XDomainRequest() : null;
        },
        iframe: {},
        flash: null,
        nodejs: null
    },
    defaultTransport: function(id) {
        if (id) {
            _default = id;
        }
        else {
            return {
                c: this.transports[_default](),
                notify: _default === 'xhr' ? false : true
            };
        }
    },
    customTransport: function(id) {
        var o = { c: this.transports[id]() };

        o[(id === 'xdr' || id === 'flash') ? 'xdr' : 'notify'] = true;
        return o;
    },
    notify: function(event, transaction, config) {
        var io = this;

        switch (event) {
            case 'timeout':
            case 'abort':
            case 'transport error':
                transaction.c = { status: 0, statusText: event };
                event = 'failure';
            default:
                io[event].apply(io, [transaction, config]);
        }
    }
});



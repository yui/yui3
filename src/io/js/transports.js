var XHR = win && win.XMLHttpRequest,
    XDR = win && win.XDomainRequest,
    AX = win && win.ActiveXObject,

    // Checks for the presence of the `withCredentials` in an XHR instance
    // object, which will be present if the environment supports CORS.
    SUPPORTS_CORS = XHR && 'withCredentials' in (new XMLHttpRequest());


Y.mix(Y.IO, {
    /**
    * The ID of the default IO transport, defaults to `xhr`
    * @property _default
    * @type {String}
    * @static
    */
    _default: 'xhr',
    /**
    *
    * @method defaultTransport
    * @static
    * @param {String} [id] The transport to set as the default, if empty a new transport is created.
    * @return {Object} The transport object with a `send` method
    */
    defaultTransport: function(id) {
        if (id) {
            Y.log('Setting default IO to: ' + id, 'info', 'io');
            Y.IO._default = id;
        } else {
            var o = {
                c: Y.IO.transports[Y.IO._default](),
                notify: Y.IO._default === 'xhr' ? false : true
            };
            Y.log('Creating default transport: ' + Y.IO._default, 'info', 'io');
            return o;
        }
    },
    /**
    * An object hash of custom transports available to IO
    * @property transports
    * @type {Object}
    * @static
    */
    transports: {
        xhr: function () {
            return XHR ? new XMLHttpRequest() :
                AX ? new ActiveXObject('Microsoft.XMLHTTP') : null;
        },
        xdr: function () {
            return XDR ? new XDomainRequest() : null;
        },
        iframe: function () { return {}; },
        flash: null,
        nodejs: null
    },
    /**
    * Create a custom transport of type and return it's object
    * @method customTransport
    * @param {String} id The id of the transport to create.
    * @static
    */
    customTransport: function(id) {
        var o = { c: Y.IO.transports[id]() };

        o[(id === 'xdr' || id === 'flash') ? 'xdr' : 'notify'] = true;
        return o;
    }
});

Y.mix(Y.IO.prototype, {
    /**
    * Fired from the notify method of the transport which in turn fires
    * the event on the IO object.
    * @method notify
    * @param {String} event The name of the event
    * @param {Object} transaction The transaction object
    * @param {Object} config The configuration object for this transaction
    */
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



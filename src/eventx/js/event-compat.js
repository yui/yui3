/**
Compatibility shim for Classes, properties, and methods from the original event
system.

`Y.EventFacade` that assigns properties directly onto
the facade rather than into its `data` collection.

@module eventx
@submodule eventx-compat
**/
var EFproto   = Y.EventFacade.prototype,
    isObject  = Y.Lang.isObject,
    blacklist = Y.mix(Y.Array.hash(Y.Object.keys(EFproto)), {
        data: true,
        details: true
    }),
    EventFacade;

// Aliases for partial back compat
Y.Subscriber = Y.EventHandle = Y.CustomEvent.Subscription;

// Replace the constructor for Y.EventFacade to mix payload properties directly
// onto the instance
Y.EventFacade =
Y.CustomEvent.FacadeEvent.Event =
EventFacade = function (type, target, payload) {
    var data, prop;

    this.type = type;

    if (payload) {
        this.details = payload;

        payload = payload[0];
        if (isObject(payload, true)) {
            data = (payload instanceof EventFacade) ? payload.data : payload;
            // If any prop has a ES5 setter, it will call set(prop, val),
            // which will assume this.data is set up.
            this.data = data;

            for (prop in data) {
                if (!blacklist[prop]) {
                    this[prop] = data[prop];
                }
            }
        }
    }

    this.data = data || {};
    this.data.target = target;
};

EventFacade.prototype = EFproto;

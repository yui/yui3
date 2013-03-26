/**
Backward compatibility shim for Y.Event.define.

@module eventx
@submodule eventx-synthetic
@for Y.Event
**/
var nodeMap = Y.Node._instances,
    DOMEvent = Y.Event.DOMEvent,
    NOOP = function () {};

function SynthSubscription() {
    DOMEvent.Subscription.apply(this, arguments);
}

Y.extend(SynthSubscription, DOMEvent.Subscription, {
    notify: function (args) {
        if (args[0] && args[0].type) {
            args[0].type = this.details.domType;
        }

        return DOMEvent.Subscription.prototype.notify.apply(this, arguments);
    },

    // To mock the notifier object from current synth infrastructure
    fire: function () {
        this.notify(arguments);
    }
});

Y.Event.SyntheticEvent = new Y.CustomEvent({
    parseSignature: function (target, args, details) {
        var extras;

        if (this.processArgs) {
            extras = this.processArgs(args, details.delegate);

            if (extras) {
                Y.mix(details, extras, true);
            }
        }
    },

    on: function (el, sub) {
        var details = sub.details,
            node    = Y.one(el),
            method  = (details.delegate && this._oldDelegate) ?
                        '_oldDelegate' : '_oldOn';

        details.nodeYuid = node._yuid;

        if (this[method]) {
            // Pass the filter even to _oldOn() because it's harmless, since
            // the signature is expecting only three args. Also, it should
            // allow some synths to remove their delegate config, since it
            // only relayed to on() anyway.
            this[method](node, sub, sub, details.filter);
        }
    },

    // Extract the filter only. Delegation logic is mostly deferred to
    // the forking to event._oldDelegate() from event.on()
    delegate: function (target, args, details) {
        details.filter = args.splice(2, 1)[0];

        if (!args[2]) {
            args[2] = this.thisObjFn;
        }
    },

    detach: function (target, sub) {
        var node;

        if (this._oldDetach) {
            // TODO: better default? I'd rather not store the Node instance
            node = nodeMap[sub.details.nodeYuid] || Y;

            this._oldDetach(node, sub, sub);
        }
    },

    thisObjFn: function (e) {
        return (e && e.get && e.get('currentTarget')) ||
                  nodeMap[this.details.nodeYuid]; // default to container?
    },

    Subscription: SynthSubscription,

    // No actual DOM sub is added directly by SyntheticEvent
    _addDOMSub   : NOOP,
    _removeDOMSub: NOOP
}, DOMEvent);

Y.Event.define = function (type, config, force) {
    if (force || !Y.Event.DOM_EVENTS[type]) {
        config = Y.merge(config);

        if (config.detach) {
            config._oldDetach = config.detach;
            // Don't override the SyntheticEvent's detach
            delete config.detach;
        }

        if (config.on) {
            config._oldOn = config.on;
            delete config.on;
        }

        if (config.delegate) {
            config._oldDelegate = config.delegate;
            delete config.delegate;
        }

        Y.Event.DOM_EVENTS[type] =
            new Y.CustomEvent(config, Y.Event.SyntheticEvent);
    }
};

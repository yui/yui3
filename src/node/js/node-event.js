var Node        = Y.Node,
    NodeProto   = Node.prototype,
    EventTarget = Y.EventTarget,
    superOn     = EventTarget.prototype.on,
    superDetach = EventTarget.prototype.detach,

    synths     = Y.Env.evt.plugins,
    DOM_EVENTS = Node.DOM_EVENTS,

    toArray = Y.Array;

// Step 1. slurp the EventTarget prototype
Y.mix(Node, EventTarget, true, null, 1);
// Step 2. set specific methods to trigger the EventTarget constructor
Y.augment(Node, EventTarget, true,
    ["getEvent", "fire", "_monitor", "publish", "_registerSub",
     "_getCategorySubs", "_unregisterSub"]);

// Step 3. overwrite specific methods to only trigger EventTarget
// constructor logic if necessary
NodeProto.on = function (type) {
    var args   = toArray(arguments, 0, true),
        // EventTarget on() calls parseType, which triggers the EventTarget
        // constructor via augment
        method = (typeof type === 'string' && (synths[type] || DOM_EVENTS[type])) ?
                    Y.on : superOn;

    args[2] || (args[2] = this);

    return method.apply(this, args);
};
NodeProto.detach = function (type) {
    if (type) {
        return Y.detach.apply(this, arguments);
    } else {
        if (this._yuievt) {
            superDetach.apply(this, arguments);
        }
        Y.Event.purgeElement(Node.getDOMNode(this));
    }
};

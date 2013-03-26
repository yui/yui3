/**
Adds EventTarget support to Node and NodeList.

@module eventx
@submodule eventx-node
@for Node
**/
// Use Y.Event's base and default events for Node and NodeList
var EventTarget  = Y.EventTarget,
    DEFAULT      = '@default',
    defaultEvent = Y._yuievt.events[DEFAULT];

// Manually replace the class events collection with a proto wrap of the
// Y.Event.DOM_EVENTS collection so added DOM events will be available, but
// events published on Y.Node won't pollute the shared DOM event collection.
Y.augment(Y.Node, EventTarget);
EventTarget.configure(Y.Node);
Y.Node.events = Y.Object(Y.Event.DOM_EVENTS);
Y.Node.events[DEFAULT] = defaultEvent;

// Manually replace the class events collection with a proto wrap of the
// Y.Event.DOM_EVENTS collection so added DOM events will be available, but
// events published on Y.NodeList won't pollute the shared DOM event collection.
// TODO: A separate proto wrap from Y.Node so custom events published on
// NodeList are specific to NodeList. Should they be shared?
Y.augment(Y.NodeList, EventTarget);
EventTarget.configure(Y.NodeList);
Y.NodeList.events = Y.Object(Y.Event.DOM_EVENTS);
Y.NodeList.events[DEFAULT] = defaultEvent;

Y.Node.prototype.purge = Y.NodeList.prototype.purge = function (recurse, type) {
    Y.Event.purgeElement(this, recurse, type);
};

Y.Node.prototype.detachAll = Y.NodeList.prototype.detachAll = function () {
    var types, i;
    // Not wrapped in the _yuievt test because the subscription may have come
    // from Y.on()
    Y.Event.purgeElement(this);

    if (this._yuievt) {
        types = Y.Object.keys(this._yuievt.subs);

        for (i = types.length - 1; i >= 0; --i) {
            this.detach(types[i]);
        }
    }
};

function getNode(name) {
    // Allow setters to populate e.data[name] with a DOM element.
    // Allowing set(...) to store DOM elements helps delegation performance.
    var node = this.data[name] || this._event[name];
    
    if (node && !(node instanceof Y.Node)) {
        node = this.data[name] = Y.one(node);
    }

    return node;
}

Y.mix(Y.Event.EventFacade.prototype._getter, {
    target: function (val) {
        var target = this.data.target;

        if (target && !(target instanceof Y.Node)) {
            while (target.nodeType === 3) {
                target = target.parentNode;
            }

            target = this.data.target = Y.one(target);
        }

        return target;
    },

    currentTarget: getNode,
    relatedTarget: getNode
}, true);

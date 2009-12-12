YUI.add('event-synthetic', function(Y) {

var Evt         = Y.Env.evt,
    DOMWrappers = Evt.dom_wrappers,
    DOMMap      = Evt.dom_map,
    EvtPlugins  = Evt.plugins,
    DOMEvents   = Y.Node.DOM_EVENTS,
    isFunction  = Y.Lang.isFunction;

Y.CustomEvent.prototype.getSubscriber = function (fn, ctx) {
    var subs   = this.subscribers,
        afters = this.afters,
        id, sub;

    for (id in subs) {
        if (subs.hasOwnProperty(id)) {
            sub = subs[id];
            if ((!fn || sub.fn === fn) && (!ctx || sub.context === ctx)) {
                return sub;
            }
        }
    }

    for (id in afters) {
        if (afters.hasOwnProperty(id)) {
            sub = afters[id];
            if ((!fn || sub.fn === fn) && (!ctx || sub.context === ctx)) {
                return sub;
            }
        }
    }

    return null;
};

function SyntheticEvent(cfg) {
    this._init(cfg);
}

SyntheticEvent.prototype = {
    _init: function (cfg) {
        this.type = cfg.type;
        this.impl = cfg;
        this._publishConfig = cfg.publishConfig || { emitFacade: true };
    },

    on: function (type, fn, el) {
        var args = Y.Array(arguments,0,true),
            self = DOMEvents[type], // event system calls on.apply(Y, ...)
            ce,       // Custom event published on node
            node,     // Node wrapper for el
            payload,  // extra info extracted from the args by implementation
            key, domGuid, // Ids for registering as a DOM event
            _handles, // Collection of detach handles for array subs
            handle;   // The detach handle for this subscription

        // Y.on normalizes Nodes to DOM nodes and NodeLists to an array of DOM
        // nodes.  Other possible value is a selector string.
        if (Y.Lang.isString(el)) {
            args[2] = Y.Selector.query(el);

            // If not found by query, trigger deferral.
            if (args[2].length) {
                el = args[2];
            } else {
                handle = Y.onAvailable(el, function () {
                    Y.mix(handle, Y.on.apply(Y, args), true);
                });
            }
        }

        // Array of elements get collection handle
        if (Y.Lang.isArray(el)) {
            _handles = [];
            Y.Array.each(el, function (n) {
                args[2] = n;
                _handles.push(Y.on.apply(Y, args));
            });

            // EventHandle can be constructed with an array of other handles
            handle = new Y.EventHandle(_handles);
        }

        // Single element subscription
        if (!handle) {
            // Allow the implementation to modify and/or extract extra data
            // from the subscription args
            payload = isFunction(self.impl.processArgs) ?
                self.impl.processArgs(args) : self._processArgs(args);

            args.shift(); // don't need type from here on out
            node = args[1] = Y.one(el);

            // Get or publish a custom event on the Node with the synthetic
            // event's name.
            ce = node._yuievt ? node._yuievt.events[self.type] : null;

            if (!ce) {
                ce = node.publish(self.type, self._publishConfig);

                // node.detach() with type missing doesn't reach adapter fork
                ce.detach = function (fn, context) {
                    return self.detach.call(Y, type, fn, context);
                };

                // Decorate and register like a DOM ce to support purgeElement
                domGuid = Y.stamp(el);
                key = 'event:' + Y.stamp(el) + self.type;

                // This will route through Y.Env.remove - the wrapper for
                // removeEventListener/detachEvent.  To avoid cross browser
                // issues, a real event name and dummy function are used to
                // make the DOM detach a noop
                Y.mix(ce, {
                    el     : el,
                    key    : key,
                    domkey : domGuid,
                    fn     : function () {},
                    capture: false
                });

                DOMMap[domGuid]  = DOMMap[domGuid] || {};
                DOMWrappers[key] = DOMMap[domGuid][key] = ce;
            }

            // Disallow duplicates.  
            if (!ce.getSubscriber(fn, el)) {
                // Subscribe to the hosted custom event
                handle = ce.on.apply(ce, args);
                // Override the handle's detach method to pass through to the
                // the this instance's detach method
                handle.detach = function () {
                    self.detach.call(Y, type, this.sub.fn, this.sub.context);
                };

                // Pass control to the implementation code
                if (isFunction(self.impl.on)) {
                    self.impl.on.call(self, node, handle.sub, ce, payload);
                }
            }
        }

        return handle;
    },

    detach: function (type, fn, el) {
        var args = Y.Array(arguments, 0, true),
            self = DOMEvents[type],
            ret  = 1, // To aggregate return values from detach multiple
            ce,       // The custom event published on the Node
            sub;      // The subscription tied to this fn and el

        // Detach doesn't normalize Node or NodeList
        if (el instanceof Y.Node) {
            el = el._node;
        } else if (el instanceof Y.NodeList) {
            el = el._nodes;
        } else if (Y.Lang.isString(el)) {
            el = Y.Selector.query(el);
        } else if (el && !Y.Array.test(el) && !el.tagName) {
            el = null;
        }

        if (el) {
            // Iterate detach by looping back for each item
            if (Y.Array.test(el)) {
                Y.Array.each(el, function (n, idx) {
                    args[2] = n;
                    ret += Y.detach.apply(Y, args);
                });

                return ret;
            }

            // Single element subscription detach.  Wrap in a Node because
            // that's how the subscription/context is enabled
            el = Y.one(el);

            // Get the custom event named for the synthetic event from the Node.
            // Node uses Y.augment(Node, EventTarget), so _yuievt won't be
            // present until an API method is called.
            // @TODO: do I need to do the object default?
            ce = (el._yuievt || {events:{}}).events[self.type];

            // Get the Subscriber object for this fn and context
            sub = ce ? ce.getSubscriber(fn, el) : null;

            if (sub) {
                // detach called without a fn = detach all subs
                // @TODO: this and the generic return should return an int
                if (!fn) {
                    while (sub) {
                        args[1] = sub.fn;
                        ret += Y.detach.apply(Y, args);
                        sub = ce.getSubscriber(fn, el);
                    }

                    return ret;
                }

                if (isFunction(self.impl.detach)) {
                    self.impl.detach.call(self, el, sub, ce);
                }

                // Standard detach cleanup
                ce._delete(sub);

                ret = 1;
            }

        }

        return ret;
    },

    _processArgs: function (args) {
        return args.slice(3);
    }
};

Y.SyntheticEvent = SyntheticEvent;

Y.Event.define = function (type, cfg) {
    var e = Y.Lang.isObject(type) ?
                type :
                Y.mix(Y.Object(cfg || {}), { type: type });

    // no redefinition allowed
    if (!DOMEvents[type]) {
        EvtPlugins[type] = DOMEvents[type] = new Y.SyntheticEvent(e);
    }
};


}, '@VERSION@' ,{requires:['node-base', 'event-custom']});

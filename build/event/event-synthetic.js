YUI.add('event-synthetic', function(Y) {

var DOMMap   = Y.Env.evt.dom_map,
    toArray  = Y.Array,
    YLang    = Y.Lang,
    isObject = YLang.isObject,
    isString = YLang.isString,
    noop     = function () {};

function Notifier(handle, emitFacade, delegate) {
    this.handle     = handle;
    this.emitFacade = emitFacade;
    this.delegate   = delegate;
}

Notifier.prototype.fire = function (e) {
    var args  = toArray(arguments, 0, true),
        ce    = this.handle.evt,
        event = e,
        mix;

    if (this.emitFacade) {
        mix = isObject(e) && !e.preventDefault;

        if (!e || !e.preventDefault) {
            ce.details = args.slice();
            event = ce._getFacade();
        }

        if (mix) {
            Y.mix(event, e, true);
            args[0] = event;
        } else {
            args.unshift(event);
        }

        event.type = ce.type;

        if (this.delegate) {
            event.container  = ce.host;
            ce.currentTarget = event.currentTarget;
        }
    }

    ce.fire.apply(ce, args);
};

function SyntheticEvent() {
    this._init.apply(this, arguments);
}

SyntheticEvent.prototype = {
    constructor: SyntheticEvent,

    _init: function () {
        if (!this.publishConfig) {
            this.publishConfig = {};
        }

        this.emitFacade = ('emitFacade' in this.publishConfig) ? 
                            this.publishConfig.emitFacade :
                            true;
    },

    /**
     * <p>Implement this function if the event supports a different subscription
     * signature.  This function is used by both on() and delegate().  The
     * second parameter indicates that the event is being subscribed via
     * delegate().</p>
     *
     * <p>Implementations must remove extra arguments from the args list before
     * returning.  The required args list order for on() subscriptions is</p>
     *
     * <pre><code>(type, callback, target, thisObj, argN...)</code></pre>
     *
     * <p>The required args list order for delegate() subscriptions is</p>
     *
     * <pre><code>(type, callback, target, filter, thisObj, argN...)</code></pre>
     *
     * <p>The return value from this function will be stored on the subscription
     * in the '_extra' property for reference elsewhere.</p>
     *
     * @method processArgs
     * @param args {Array} the parmeters passed to Y.on(..) or Y.delegate(..)
     * @param delegate {Boolean} true if the originating subscription is from
     *                           Y.delegate.
     * @return {any}
     */
    processArgs: noop,
    //allowDups  : false,

    on         : noop,
    detach     : noop,

    delegate       : noop,
    detachDelegate : noop,

    _subscribe: function (node, args, extra, delegate) {
        var el       = node._node,
            yuid     = Y.stamp(el),
            key      = 'event:' + yuid + this.type,
            events   = DOMMap[yuid],
            ce       = (events) ? events[key] : null,
            dispatcher = new Y.CustomEvent(this.type, this.publishConfig),
            handle     = dispatcher.on.apply(dispatcher, args),
            sub        = handle.sub;

        dispatcher._delete = Y.bind(this._deleteSub, this, dispatcher);
        dispatcher.emitFacade = false;   // Handled by the notifier
        dispatcher.host = node;          // I forget what this is for
        dispatcher.currentTarget = node; // for generating facades
        dispatcher.target = node;        // for generating facades
        dispatcher.el = el;              // For category detach
        if (delegate) {
            dispatcher.contextFn = this._delegateContextFn;
        }

        sub._extra  = extra;
        sub.node    = node;

        handle.notifier = new Notifier(handle, this.emitFacade, delegate);

        if (!ce) {
            if (!DOMMap[yuid]) {
                DOMMap[yuid] = {};
            }

            ce = DOMMap[yuid][key] = {
                type     : this.type,
                el       : el,
                key      : key,
                domkey   : yuid,
                fn       : noop,
                capture  : false,
                notifiers: [],

                detachAll: this._purge
            };
        }

        ce.notifiers.push(handle);

        return handle;
    },

    _on: function (args) {
        var handles  = [],
            selector = args[2],
            nodes    = Y.all(selector),
            handle;

        if (!nodes.size() && isString(selector)) {
            handle = Y.on('available', function () {
                Y.mix(handle, Y.on.apply(Y, args), true);
            }, selector);

            return handle;
        }

        nodes.each(function (node) {
            var subArgs  = args.slice(),
                extra    = this.processArgs(subArgs);

            // (type, fn, el, thisObj, ...) => (fn, thisObj, ...)
            subArgs.splice(0, 4, subArgs[1], subArgs[3] || node);

            handle = this._subscribe(node, subArgs, extra);

            this.on(node, handle.sub, handle.notifier);

            handles.push(handle);
        }, this);

        return (handles.length === 1) ?
            handles[0] :
            new Y.EventHandle(handles);
    },

    /*
    isDup: function (subs, fn, context) {
        var id, sub;

        for (id in subs) {
            if (subs.hasOwnProperty(id)) {
                sub = subs[id];
                if ((!fn      || sub.fn === fn) &&
                    (!context || sub.context === context)) {
                    return true;
                }
            }
        }

        return false;
    },
    */

    _detach: function (args) {
        var nodes = Y.all(args[2]),
            type  = this.type;
        
        // (type, fn, el, context, filter?) => (fn, context, filter?)
        args.splice(0, 3, args[1]);

        nodes.each(function (node) {
            var yuid   = Y.stamp(node._node),
                events = DOMMap[yuid],
                ce     = (events) ? events['event:' + yuid + type] : null,
                notifiers, i, handle;

            if (ce) {
                notifiers = ce.notifiers;
                for (i = notifiers.length - 1; i >= 0; --i) {
                    handle = notifiers[i];
                    if (this.subMatch(handle.sub, args)) {
                        handle.detach();
                        notifiers.splice(i, 1);
                    }
                }
            }
        }, this);
    },

    _deleteSub: function (notifier, sub) {
        if (sub && sub.fn) {
            notifier.subscribers = {};
            notifier.subCount = 0;

            if (sub.filter) {
                this.detachDelegate(sub.node, sub, notifier);
            } else {
                this.detach(sub.node, sub, notifier);
            }

            delete sub.fn;
            delete sub.node;
            delete sub.context;
        }
    },

    _purge: function () {
        var notifiers = this.notifiers,
            i = notifiers.length;

        while (--i >= 0) {
            notifiers[i].detach();
        }
    },

    subMatch: function (sub, args) {
        // Default detach cares only about the callback matching
        return !args[0] || sub.fn === args[0];
    },

    _delegate: function (args) {
        var el   = args[2],
            node = Y.all(el).item(0),
            extra, filter, handle, sub;

        if (!node && isString(el)) {
            handle = Y.on('available', function () {
                Y.mix(handle, Y.delegate.apply(Y, args), true);
            }, el);
        }

        if (!handle && node) {
            extra  = this.processArgs(args, true);
            filter = args[3];

            // (type, fn, el, filter, thisObj, ...) => (fn, thisObj, ...)
            args.splice(0, 5, args[1], args[4]);
            handle = this._subscribe(node, args, extra, true);

            sub = handle.sub;
            sub.filter = filter;

            this.delegate(node, handle.sub, handle.notifier, filter);
        }

        // Return an empty event handle to keep Y.on from falling back to
        // a custom event subscription.
        return handle || new Y.EventHandle();
    },

    // Called from custom events for delegate subscribers
    _delegateContextFn: function () {
        return this.currentTarget;
    }

};

Y.SyntheticEvent = SyntheticEvent;
Y.SyntheticEvent.Notifier = Notifier;

Y.Node.publish = Y.Event.define = function (type, config) {
    if (!config) {
        config = {};
    }

    var eventDef = (Y.Lang.isObject(type)) ?
                        type :
                        Y.merge({ type: type }, config),
        Impl, synth;

    if (!Y.Node.DOM_EVENTS[eventDef.type]) {
        Impl = function () {
            SyntheticEvent.apply(this, arguments);
        };
        Y.extend(Impl, SyntheticEvent, eventDef);
        synth = new Impl();

        type = synth.type;

        Y.Node.DOM_EVENTS[type] = Y.Env.evt.plugins[type] = {
            eventDef: synth,

            on: function () {
                return synth._on(toArray(arguments));
            },

            detach: function () {
                return synth._detach(toArray(arguments));
            },

            delegate: function () {
                return synth._delegate(toArray(arguments));
            }
        };

    }
};


}, '@VERSION@' ,{requires:['node-base', 'event-custom']});

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
    // first arg to delegate notifier should be an object with currentTarget
    var args    = toArray(arguments, 0, true),
        handle  = this.handle,
        ce      = handle.evt,
        sub     = handle.sub,
        thisObj = sub.context,
        event   = e || {};

    if (this.emitFacade) {
        if (!e || !e.preventDefault) {
            event = ce._getFacade();

            if (isObject(e) && !e.preventDefault) {
                Y.mix(event, e, true);
                args[0] = event;
            } else {
                args.unshift(event);
            }
        }

        event.type    = ce.type;
        event.details = args.slice();

        if (this.delegate) {
            event.container = ce.host;
        }
    } else if (this.delegate) {
        args.shift();
    }

    sub.context = thisObj || event.currentTarget || ce.host;
    ce.fire.apply(ce, args);
    sub.context = thisObj; // reset for future firing
};

function SyntheticEvent() {
    this._init.apply(this, arguments);
}

Y.mix(SyntheticEvent, {
    Notifier: Notifier,

    getRegistry: function (node, type, create) {
        var el     = node._node,
            yuid   = Y.stamp(el),
            key    = 'event:' + yuid + type,
            events = DOMMap[yuid] || (DOMMap[yuid] = {});

        if (!events[key] && create) {
            events[key] = {
                type      : '_synth_',
                fn        : noop,
                capture   : false,
                el        : el,
                key       : key,
                domkey    : yuid,
                notifiers : [],

                detachAll : function () {
                    var notifiers = this.notifiers,
                        i = notifiers.length;

                    while (--i >= 0) {
                        notifiers[i].detach();
                    }
                }
            };
        }

        return (events[key]) ? events[key].notifiers : null;
    },

    _deleteSub: function (sub) {
        if (sub && sub.fn) {
            var synth = this.eventDef,
                method = (sub.filter) ? 'detachDelegate' : 'detach';

            this.subscribers = {};
            this.subCount = 0;

            synth[method](sub.node, sub, this.notifier, sub.filter);
            synth._unregisterSub(sub);

            delete sub.fn;
            delete sub.node;
            delete sub.context;
        }
    },

    prototype: {
        constructor: SyntheticEvent,

        _init: function () {
            var config = this.publishConfig || (this.publishConfig = {});

            // The notification mechanism handles facade creation
            this.emitFacade = ('emitFacade' in config) ?
                                config.emitFacade :
                                true;
            config.emitFacade  = false;
        },

        /**
         * <p>Implement this function if the event supports a different
         * subscription signature.  This function is used by both on() and
         * delegate().  The second parameter indicates that the event is being
         * subscribed via delegate().</p>
         *
         * <p>Implementations must remove extra arguments from the args list
         * before returning.  The required args list order for on()
         * subscriptions is</p> <pre><code>(type, callback, target, thisObj,
         * argN...)</code></pre>
         *
         * <p>The required args list order for delegate() subscriptions is</p>
         *
         * <pre><code>(type, callback, target, filter, thisObj,
         * argN...)</code></pre>
         *
         * <p>The return value from this function will be stored on the
         * subscription in the '_extra' property for reference elsewhere.</p>
         *
         * @method processArgs
         * @param args {Array} parmeters passed to Y.on(..) or Y.delegate(..)
         * @param delegate {Boolean} true if the subscription is from Y.delegate
         * @return {any}
         */
        processArgs: noop,
        //allowDups  : false,

        on         : noop,
        detach     : noop,

        delegate       : noop,
        detachDelegate : noop,

        _on: function (args, delegate) {
            var handles  = [],
                selector = args[2],
                nodes    = Y.all(selector),
                method   = delegate ? 'delegate' : 'on',
                handle;

            if (!nodes.size() && isString(selector)) {
                handle = Y.on('available', function () {
                    Y.mix(handle, Y[method].apply(Y, args), true);
                }, selector);

                return handle;
            }

            nodes.each(function (node) {
                var subArgs = args.slice(),
                    extra   = this.processArgs(subArgs, delegate),
                    filter;

                if (delegate) {
                    filter = subArgs.splice(3, 1)[0];
                }

                // (type, fn, el, thisObj, ...) => (fn, thisObj, ...)
                subArgs.splice(0, 4, subArgs[1], subArgs[3]);

                if (this.allowDups || !this.getSubs(node, args, null, true)) {
                    handle = this._getNotifier(node, subArgs, extra, filter);

                    this[method](node, handle.sub, handle.notifier, filter);

                    handles.push(handle);
                }
            }, this);

            return (handles.length === 1) ?
                handles[0] :
                new Y.EventHandle(handles);
        },

        _getNotifier: function (node, args, extra, filter) {
            var dispatcher = new Y.CustomEvent(this.type, this.publishConfig),
                handle     = dispatcher.on.apply(dispatcher, args),
                notifier   = new Notifier(handle, this.emitFacade, filter),
                registry   = SyntheticEvent.getRegistry(node, this.type, true),
                sub        = handle.sub;

            handle.notifier   = notifier;

            sub.node   = node;
            sub.filter = filter;
            sub._extra = extra;

            Y.mix(dispatcher, {
                eventDef     : this,
                notifier     : notifier,
                host         : node,       // I forget what this is for
                currentTarget: node,       // for generating facades
                target       : node,       // for generating facades
                el           : node._node, // For category detach

                _delete      : SyntheticEvent._deleteSub
            }, true);

            registry.push(handle);

            return handle;
        },

        _unregisterSub: function (sub) {
            var notifiers = SyntheticEvent.getRegistry(sub.node, this.type),
                i;
                
            if (notifiers) {
                for (i = notifiers.length - 1; i >= 0; --i) {
                    if (notifiers[i].sub === sub) {
                        notifiers.splice(i, 1);
                        break;
                    }
                }
            }
        },

        _detach: function (args) {
            var nodes = Y.all(args[2]);
            
            // (type, fn, el, context, filter?) => (type, fn, context, filter?)
            args.splice(2, 1);

            nodes.each(function (node) {
                var handles = this.getSubs(node, args), i;

                if (handles) {
                    for (i = handles.length - 1; i >= 0; --i) {
                        handles[i].detach();
                    }
                }
            }, this);
        },

        getSubs: function (node, args, filter, first) {
            var notifiers = SyntheticEvent.getRegistry(node, this.type),
                handles = [],
                i, len, handle;

            if (notifiers) {
                if (!filter) {
                    filter = this.subMatch;
                }

                for (i = 0, len = notifiers.length; i < len; ++i) {
                    handle = notifiers[i];
                    if (filter.call(this, handle.sub, args)) {
                        if (first) {
                            return handle;
                        } else {
                            handles.push(notifiers[i]);
                        }
                    }
                }
            }

            return handles.length && handles;
        },

        subMatch: function (sub, args) {
            // Default detach cares only about the callback matching
            return !args[1] || sub.fn === args[1];
        }
    }
}, true);

Y.SyntheticEvent = SyntheticEvent;

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

            delegate: function () {
                return synth._on(toArray(arguments), true);
            },

            detach: function () {
                return synth._detach(toArray(arguments));
            }
        };

    }
};


}, '@VERSION@' ,{requires:['node-base', 'event-custom']});

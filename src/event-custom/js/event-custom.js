
/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */


// var onsubscribeType = "_event:onsub",
var AFTER = 'after',
    CONFIGS = [
        'broadcast',
        'monitored',
        'bubbles',
        'context',
        'contextFn',
        'currentTarget',
        'defaultFn',
        'defaultTargetOnly',
        'details',
        'emitFacade',
        'fireOnce',
        'async',
        'host',
        'preventable',
        'preventedFn',
        'queuable',
        'silent',
        'stoppedFn',
        'target',
        'type'
    ],

    YUI3_SIGNATURE = 9,
    YUI_LOG = 'yui:log';

/**
 * Return value from all subscribe operations
 * @class EventHandle
 * @constructor
 * @param {CustomEvent} evt the custom event.
 * @param {Subscriber} sub the subscriber.
 */
Y.EventHandle = function(evt, sub) {

    /**
     * The custom event
     * @type CustomEvent
     */
    this.evt = evt;

    /**
     * The subscriber object
     * @type Subscriber
     */
    this.sub = sub;
};

Y.EventHandle.prototype = {
    batch: function(f, c) {
        f.call(c || this, this);
        if (Y.Lang.isArray(this.evt)) {
            Y.Array.each(this.evt, function(h) {
                h.batch.call(c || h, f);
            });
        }
    },

    /**
     * Detaches this subscriber
     * @method detach
     * @return {int} the number of detached listeners
     */
    detach: function() {
        var evt = this.evt, detached = 0, i;
        if (evt) {
            // Y.log('EventHandle.detach: ' + this.sub, 'info', 'Event');
            if (Y.Lang.isArray(evt)) {
                for (i = 0; i < evt.length; i++) {
                    detached += evt[i].detach();
                }
            } else {
                evt._delete(this.sub);
                detached = 1;
            }

        }

        return detached;
    },

    /**
     * Monitor the event state for the subscribed event.  The first parameter
     * is what should be monitored, the rest are the normal parameters when
     * subscribing to an event.
     * @method monitor
     * @param what {string} what to monitor ('attach', 'detach', 'publish').
     * @return {EventHandle} return value from the monitor event subscription.
     */
    monitor: function(what) {
        return this.evt.monitor.apply(this.evt, arguments);
    }
};

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String} type The type of event, which is passed to the callback
 * when the event fires.
 * @param {object} o configuration object.
 * @class CustomEvent
 * @constructor
 */
Y.CustomEvent = function(type, o) {

    // if (arguments.length > 2) {
// this.log('CustomEvent context and silent are now in the config', 'warn', 'Event');
    // }

    o = o || {};

    this.id = Y.stamp(this);

    /**
     * The type of event, returned to subscribers when the event fires
     * @property type
     * @type string
     */
    this.type = type;

    /**
     * The context the the event will fire from by default.  Defaults to the YUI
     * instance.
     * @property context
     * @type object
     */
    this.context = Y;

    /**
     * Monitor when an event is attached or detached.
     *
     * @property monitored
     * @type boolean
     */
    // this.monitored = false;

    this.logSystem = (type == YUI_LOG);

    /**
     * If 0, this event does not broadcast.  If 1, the YUI instance is notified
     * every time this event fires.  If 2, the YUI instance and the YUI global
     * (if event is enabled on the global) are notified every time this event
     * fires.
     * @property broadcast
     * @type int
     */
    // this.broadcast = 0;

    /**
     * By default all custom events are logged in the debug build, set silent
     * to true to disable debug outpu for this event.
     * @property silent
     * @type boolean
     */
    this.silent = this.logSystem;

    /**
     * Specifies whether this event should be queued when the host is actively
     * processing an event.  This will effect exectution order of the callbacks
     * for the various events.
     * @property queuable
     * @type boolean
     * @default false
     */
    // this.queuable = false;

    /**
     * The subscribers to this event
     * @property subscribers
     * @type Subscriber {}
     */
    this.subscribers = {};

    /**
     * 'After' subscribers
     * @property afters
     * @type Subscriber {}
     */
    this.afters = {};

    /**
     * This event has fired if true
     *
     * @property fired
     * @type boolean
     * @default false;
     */
    // this.fired = false;

    /**
     * An array containing the arguments the custom event
     * was last fired with.
     * @property firedWith
     * @type Array
     */
    // this.firedWith;

    /**
     * This event should only fire one time if true, and if
     * it has fired, any new subscribers should be notified
     * immediately.
     *
     * @property fireOnce
     * @type boolean
     * @default false;
     */
    // this.fireOnce = false;

    /**
     * fireOnce listeners will fire syncronously unless async
     * is set to true
     * @property async
     * @type boolean
     * @default false
     */
    //this.async = false;

    /**
     * Flag for stopPropagation that is modified during fire()
     * 1 means to stop propagation to bubble targets.  2 means
     * to also stop additional subscribers on this target.
     * @property stopped
     * @type int
     */
    // this.stopped = 0;

    /**
     * Flag for preventDefault that is modified during fire().
     * if it is not 0, the default behavior for this event
     * @property prevented
     * @type int
     */
    // this.prevented = 0;

    /**
     * Specifies the host for this custom event.  This is used
     * to enable event bubbling
     * @property host
     * @type EventTarget
     */
    // this.host = null;

    /**
     * The default function to execute after event listeners
     * have fire, but only if the default action was not
     * prevented.
     * @property defaultFn
     * @type Function
     */
    // this.defaultFn = null;

    /**
     * The function to execute if a subscriber calls
     * stopPropagation or stopImmediatePropagation
     * @property stoppedFn
     * @type Function
     */
    // this.stoppedFn = null;

    /**
     * The function to execute if a subscriber calls
     * preventDefault
     * @property preventedFn
     * @type Function
     */
    // this.preventedFn = null;

    /**
     * Specifies whether or not this event's default function
     * can be cancelled by a subscriber by executing preventDefault()
     * on the event facade
     * @property preventable
     * @type boolean
     * @default true
     */
    this.preventable = true;

    /**
     * Specifies whether or not a subscriber can stop the event propagation
     * via stopPropagation(), stopImmediatePropagation(), or halt()
     *
     * Events can only bubble if emitFacade is true.
     *
     * @property bubbles
     * @type boolean
     * @default true
     */
    this.bubbles = true;

    /**
     * Supports multiple options for listener signatures in order to
     * port YUI 2 apps.
     * @property signature
     * @type int
     * @default 9
     */
    this.signature = YUI3_SIGNATURE;

    this.subCount = 0;
    this.afterCount = 0;

    // this.hasSubscribers = false;

    // this.hasAfters = false;

    /**
     * If set to true, the custom event will deliver an EventFacade object
     * that is similar to a DOM event object.
     * @property emitFacade
     * @type boolean
     * @default false
     */
    // this.emitFacade = false;

    this.applyConfig(o, true);

    // this.log("Creating " + this.type);

};

Y.CustomEvent.prototype = {

    hasSubs: function(when) {
        var s = this.subCount, a = this.afterCount, sib = this.sibling;

        if (sib) {
            s += sib.subCount;
            a += sib.afterCount;
        }

        if (when) {
            return (when == 'after') ? a : s;
        }

        return (s + a);
    },

    /**
     * Monitor the event state for the subscribed event.  The first parameter
     * is what should be monitored, the rest are the normal parameters when
     * subscribing to an event.
     * @method monitor
     * @param what {string} what to monitor ('detach', 'attach', 'publish').
     * @return {EventHandle} return value from the monitor event subscription.
     */
    monitor: function(what) {
        this.monitored = true;
        var type = this.id + '|' + this.type + '_' + what,
            args = Y.Array(arguments, 0, true);
        args[0] = type;
        return this.host.on.apply(this.host, args);
    },

    /**
     * Get all of the subscribers to this event and any sibling event
     * @method getSubs
     * @return {Array} first item is the on subscribers, second the after.
     */
    getSubs: function() {
        var s = Y.merge(this.subscribers), a = Y.merge(this.afters), sib = this.sibling;

        if (sib) {
            Y.mix(s, sib.subscribers);
            Y.mix(a, sib.afters);
        }

        return [s, a];
    },

    /**
     * Apply configuration properties.  Only applies the CONFIG whitelist
     * @method applyConfig
     * @param o hash of properties to apply.
     * @param force {boolean} if true, properties that exist on the event
     * will be overwritten.
     */
    applyConfig: function(o, force) {
        if (o) {
            Y.mix(this, o, force, CONFIGS);
        }
    },

    _on: function(fn, context, args, when) {

        if (!fn) {
            this.log('Invalid callback for CE: ' + this.type);
        }

        var s = new Y.Subscriber(fn, context, args, when);

        if (this.fireOnce && this.fired) {
            if (this.async) {
                setTimeout(Y.bind(this._notify, this, s, this.firedWith), 0);
            } else {
                this._notify(s, this.firedWith);
            }
        }

        if (when == AFTER) {
            this.afters[s.id] = s;
            this.afterCount++;
        } else {
            this.subscribers[s.id] = s;
            this.subCount++;
        }

        return new Y.EventHandle(this, s);

    },

    /**
     * Listen for this event
     * @method subscribe
     * @param {Function} fn The function to execute.
     * @return {EventHandle} Unsubscribe handle.
     * @deprecated use on.
     */
    subscribe: function(fn, context) {
        Y.log('ce.subscribe deprecated, use "on"', 'warn', 'deprecated');
        var a = (arguments.length > 2) ? Y.Array(arguments, 2, true) : null;
        return this._on(fn, context, a, true);
    },

    /**
     * Listen for this event
     * @method on
     * @param {Function} fn The function to execute.
     * @param {object} context optional execution context.
     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {EventHandle} An object with a detach method to detch the handler(s).
     */
    on: function(fn, context) {
        var a = (arguments.length > 2) ? Y.Array(arguments, 2, true) : null;
        if (this.host) {
            this.host._monitor('attach', this.type, {
                args: arguments
            });
        }
        return this._on(fn, context, a, true);
    },

    /**
     * Listen for this event after the normal subscribers have been notified and
     * the default behavior has been applied.  If a normal subscriber prevents the
     * default behavior, it also prevents after listeners from firing.
     * @method after
     * @param {Function} fn The function to execute.
     * @param {object} context optional execution context.
     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {EventHandle} handle Unsubscribe handle.
     */
    after: function(fn, context) {
        var a = (arguments.length > 2) ? Y.Array(arguments, 2, true) : null;
        return this._on(fn, context, a, AFTER);
    },

    /**
     * Detach listeners.
     * @method detach
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {int} returns the number of subscribers unsubscribed.
     */
    detach: function(fn, context) {
        // unsubscribe handle
        if (fn && fn.detach) {
            return fn.detach();
        }

        var i, s,
            found = 0,
            subs = Y.merge(this.subscribers, this.afters);

        for (i in subs) {
            if (subs.hasOwnProperty(i)) {
                s = subs[i];
                if (s && (!fn || fn === s.fn)) {
                    this._delete(s);
                    found++;
                }
            }
        }

        return found;
    },

    /**
     * Detach listeners.
     * @method unsubscribe
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {int|undefined} returns the number of subscribers unsubscribed.
     * @deprecated use detach.
     */
    unsubscribe: function() {
        return this.detach.apply(this, arguments);
    },

    /**
     * Notify a single subscriber
     * @method _notify
     * @param {Subscriber} s the subscriber.
     * @param {Array} args the arguments array to apply to the listener.
     * @private
     */
    _notify: function(s, args, ef) {

        this.log(this.type + '->' + 'sub: ' + s.id);

        var ret;

        ret = s.notify(args, this);

        if (false === ret || this.stopped > 1) {
            this.log(this.type + ' cancelled by subscriber');
            return false;
        }

        return true;
    },

    /**
     * Logger abstraction to centralize the application of the silent flag
     * @method log
     * @param {string} msg message to log.
     * @param {string} cat log category.
     */
    log: function(msg, cat) {
        if (!this.silent) {
            Y.log(this.id + ': ' + msg, cat || 'info', 'event');
        }
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the context specified when the event was created, and with the
     * following parameters:
     *   <ul>
     *   <li>The type of event</li>
     *   <li>All of the arguments fire() was executed with as an array</li>
     *   <li>The custom object (if any) that was passed into the subscribe()
     *       method</li>
     *   </ul>
     * @method fire
     * @param {Object*} arguments an arbitrary set of parameters to pass to
     *                            the handler.
     * @return {boolean} false if one of the subscribers returned false,
     *                   true otherwise.
     *
     */
    fire: function() {
        if (this.fireOnce && this.fired) {
            this.log('fireOnce event: ' + this.type + ' already fired');
            return true;
        } else {

            var args = Y.Array(arguments, 0, true);

            // this doesn't happen if the event isn't published
            // this.host._monitor('fire', this.type, args);

            this.fired = true;
            this.firedWith = args;

            if (this.emitFacade) {
                return this.fireComplex(args);
            } else {
                return this.fireSimple(args);
            }
        }
    },

    fireSimple: function(args) {
        this.stopped = 0;
        this.prevented = 0;
        if (this.hasSubs()) {
            // this._procSubs(Y.merge(this.subscribers, this.afters), args);
            var subs = this.getSubs();
            this._procSubs(subs[0], args);
            this._procSubs(subs[1], args);
        }
        this._broadcast(args);
        return this.stopped ? false : true;
    },

    // Requires the event-custom-complex module for full funcitonality.
    fireComplex: function(args) {
        Y.log('Missing event-custom-complex needed to emit a facade for: ' + this.type);
        args[0] = args[0] || {};
        return this.fireSimple(args);
    },

    _procSubs: function(subs, args, ef) {
        var s, i;
        for (i in subs) {
            if (subs.hasOwnProperty(i)) {
                s = subs[i];
                if (s && s.fn) {
                    if (false === this._notify(s, args, ef)) {
                        this.stopped = 2;
                    }
                    if (this.stopped == 2) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    _broadcast: function(args) {
        if (!this.stopped && this.broadcast) {

            var a = Y.Array(args);
            a.unshift(this.type);

            if (this.host !== Y) {
                Y.fire.apply(Y, a);
            }

            if (this.broadcast == 2) {
                Y.Global.fire.apply(Y.Global, a);
            }
        }
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed.
     * @deprecated use detachAll.
     */
    unsubscribeAll: function() {
        return this.detachAll.apply(this, arguments);
    },

    /**
     * Removes all listeners
     * @method detachAll
     * @return {int} The number of listeners unsubscribed.
     */
    detachAll: function() {
        return this.detach();
    },

    /**
     * @method _delete
     * @param subscriber object.
     * @private
     */
    _delete: function(s) {
        if (s) {
            if (this.subscribers[s.id]) {
                delete this.subscribers[s.id];
                this.subCount--;
            }
            if (this.afters[s.id]) {
                delete this.afters[s.id];
                this.afterCount--;
            }
        }

        if (this.host) {
            this.host._monitor('detach', this.type, {
                ce: this,
                sub: s
            });
        }

        if (s) {
            // delete s.fn;
            // delete s.context;
            s.deleted = true;
        }
    }
};

/////////////////////////////////////////////////////////////////////

/**
 * Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The wrapped function to execute.
 * @param {Object}   context  The value of the keyword 'this' in the listener.
 * @param {Array} args*       0..n additional arguments to supply the listener.
 *
 * @class Subscriber
 * @constructor
 */
Y.Subscriber = function(fn, context, args) {

    /**
     * The callback that will be execute when the event fires
     * This is wrapped by Y.rbind if obj was supplied.
     * @property fn
     * @type Function
     */
    this.fn = fn;

    /**
     * Optional 'this' keyword for the listener
     * @property context
     * @type Object
     */
    this.context = context;

    /**
     * Unique subscriber id
     * @property id
     * @type String
     */
    this.id = Y.stamp(this);

    /**
     * Additional arguments to propagate to the subscriber
     * @property args
     * @type Array
     */
    this.args = args;

    /**
     * Custom events for a given fire transaction.
     * @property events
     * @type {EventTarget}
     */
    // this.events = null;

    /**
     * This listener only reacts to the event once
     * @property once
     */
    // this.once = false;

};

Y.Subscriber.prototype = {

    _notify: function(c, args, ce) {
        if (this.deleted && !this.postponed) {
            if (this.postponed) {
                delete this.fn;
                delete this.context;
            } else {
                delete this.postponed;
                return null;
            }
        }
        var a = this.args, ret;
        switch (ce.signature) {
            case 0:
                ret = this.fn.call(c, ce.type, args, c);
                break;
            case 1:
                ret = this.fn.call(c, args[0] || null, c);
                break;
            default:
                if (a || args) {
                    args = args || [];
                    a = (a) ? args.concat(a) : args;
                    ret = this.fn.apply(c, a);
                } else {
                    ret = this.fn.call(c);
                }
        }

        if (this.once) {
            ce._delete(this);
        }

        return ret;
    },

    /**
     * Executes the subscriber.
     * @method notify
     * @param args {Array} Arguments array for the subscriber.
     * @param ce {CustomEvent} The custom event that sent the notification.
     */
    notify: function(args, ce) {
        var c = this.context,
            ret = true;

        if (!c) {
            c = (ce.contextFn) ? ce.contextFn() : ce.context;
        }

        // only catch errors if we will not re-throw them.
        if (Y.config.throwFail) {
            ret = this._notify(c, args, ce);
        } else {
            try {
                ret = this._notify(c, args, ce);
            } catch (e) {
                Y.error(this + ' failed: ' + e.message, e);
            }
        }

        return ret;
    },

    /**
     * Returns true if the fn and obj match this objects properties.
     * Used by the unsubscribe method to match the right subscriber.
     *
     * @method contains
     * @param {Function} fn the function to execute.
     * @param {Object} context optional 'this' keyword for the listener.
     * @return {boolean} true if the supplied arguments match this
     *                   subscriber's signature.
     */
    contains: function(fn, context) {
        if (context) {
            return ((this.fn == fn) && this.context == context);
        } else {
            return (this.fn == fn);
        }
    }

};

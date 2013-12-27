
/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */


// var onsubscribeType = "_event:onsub",
var YArray = Y.Array,

    AFTER = 'after',
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

    CONFIGS_HASH = YArray.hash(CONFIGS),

    nativeSlice = Array.prototype.slice,

    YUI3_SIGNATURE = 9,
    YUI_LOG = 'yui:log',

    mixConfigs = function(r, s, ov) {
        var p;

        for (p in s) {
            if (CONFIGS_HASH[p] && (ov || !(p in r))) {
                r[p] = s[p];
            }
        }

        return r;
    };

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String} type The type of event, which is passed to the callback
 * when the event fires.
 * @param {object} defaults configuration object.
 * @class CustomEvent
 * @constructor
 */

 /**
 * The type of event, returned to subscribers when the event fires
 * @property type
 * @type string
 */

/**
 * By default all custom events are logged in the debug build, set silent
 * to true to disable debug outpu for this event.
 * @property silent
 * @type boolean
 */

Y.CustomEvent = function(type, defaults) {

    this._kds = Y.CustomEvent.keepDeprecatedSubs;

    this.id = Y.guid();

    this.type = type;
    this.silent = this.logSystem = (type === YUI_LOG);

    if (this._kds) {
        /**
         * The subscribers to this event
         * @property subscribers
         * @type Subscriber {}
         * @deprecated
         */

        /**
         * 'After' subscribers
         * @property afters
         * @type Subscriber {}
         * @deprecated
         */
        this.subscribers = {};
        this.afters = {};
    }

    if (defaults) {
        mixConfigs(this, defaults, true);
    }
};

/**
 * Static flag to enable population of the <a href="#property_subscribers">`subscribers`</a>
 * and  <a href="#property_subscribers">`afters`</a> properties held on a `CustomEvent` instance.
 *
 * These properties were changed to private properties (`_subscribers` and `_afters`), and
 * converted from objects to arrays for performance reasons.
 *
 * Setting this property to true will populate the deprecated `subscribers` and `afters`
 * properties for people who may be using them (which is expected to be rare). There will
 * be a performance hit, compared to the new array based implementation.
 *
 * If you are using these deprecated properties for a use case which the public API
 * does not support, please file an enhancement request, and we can provide an alternate
 * public implementation which doesn't have the performance cost required to maintiain the
 * properties as objects.
 *
 * @property keepDeprecatedSubs
 * @static
 * @for CustomEvent
 * @type boolean
 * @default false
 * @deprecated
 */
Y.CustomEvent.keepDeprecatedSubs = false;

Y.CustomEvent.mixConfigs = mixConfigs;

Y.CustomEvent.prototype = {

    constructor: Y.CustomEvent,

    /**
     * Monitor when an event is attached or detached.
     *
     * @property monitored
     * @type boolean
     */

    /**
     * If 0, this event does not broadcast.  If 1, the YUI instance is notified
     * every time this event fires.  If 2, the YUI instance and the YUI global
     * (if event is enabled on the global) are notified every time this event
     * fires.
     * @property broadcast
     * @type int
     */

    /**
     * Specifies whether this event should be queued when the host is actively
     * processing an event.  This will effect exectution order of the callbacks
     * for the various events.
     * @property queuable
     * @type boolean
     * @default false
     */

    /**
     * This event has fired if true
     *
     * @property fired
     * @type boolean
     * @default false;
     */

    /**
     * An array containing the arguments the custom event
     * was last fired with.
     * @property firedWith
     * @type Array
     */

    /**
     * This event should only fire one time if true, and if
     * it has fired, any new subscribers should be notified
     * immediately.
     *
     * @property fireOnce
     * @type boolean
     * @default false;
     */

    /**
     * fireOnce listeners will fire syncronously unless async
     * is set to true
     * @property async
     * @type boolean
     * @default false
     */

    /**
     * Flag for stopPropagation that is modified during fire()
     * 1 means to stop propagation to bubble targets.  2 means
     * to also stop additional subscribers on this target.
     * @property stopped
     * @type int
     */

    /**
     * Flag for preventDefault that is modified during fire().
     * if it is not 0, the default behavior for this event
     * @property prevented
     * @type int
     */

    /**
     * Specifies the host for this custom event.  This is used
     * to enable event bubbling
     * @property host
     * @type EventTarget
     */

    /**
     * The default function to execute after event listeners
     * have fire, but only if the default action was not
     * prevented.
     * @property defaultFn
     * @type Function
     */

    /**
     * Flag for the default function to execute only if the
     * firing event is the current target. This happens only
     * when using custom event delegation and setting the
     * flag to `true` mimics the behavior of event delegation
     * in the DOM.
     *
     * @property defaultTargetOnly
     * @type Boolean
     * @default false
     */

    /**
     * The function to execute if a subscriber calls
     * stopPropagation or stopImmediatePropagation
     * @property stoppedFn
     * @type Function
     */

    /**
     * The function to execute if a subscriber calls
     * preventDefault
     * @property preventedFn
     * @type Function
     */

    /**
     * The subscribers to this event
     * @property _subscribers
     * @type Subscriber []
     * @private
     */

    /**
     * 'After' subscribers
     * @property _afters
     * @type Subscriber []
     * @private
     */

    /**
     * If set to true, the custom event will deliver an EventFacade object
     * that is similar to a DOM event object.
     * @property emitFacade
     * @type boolean
     * @default false
     */

    /**
     * Supports multiple options for listener signatures in order to
     * port YUI 2 apps.
     * @property signature
     * @type int
     * @default 9
     */
    signature : YUI3_SIGNATURE,

    /**
     * The context the the event will fire from by default.  Defaults to the YUI
     * instance.
     * @property context
     * @type object
     */
    context : Y,

    /**
     * Specifies whether or not this event's default function
     * can be cancelled by a subscriber by executing preventDefault()
     * on the event facade
     * @property preventable
     * @type boolean
     * @default true
     */
    preventable : true,

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
    bubbles : true,

    /**
     * Returns the number of subscribers for this event as the sum of the on()
     * subscribers and after() subscribers.
     *
     * @method hasSubs
     * @return Number
     */
    hasSubs: function(when) {
        var s = 0,
            a = 0,
            subs = this._subscribers,
            afters = this._afters,
            sib = this.sibling;

        if (subs) {
            s = subs.length;
        }

        if (afters) {
            a = afters.length;
        }

        if (sib) {
            subs = sib._subscribers;
            afters = sib._afters;

            if (subs) {
                s += subs.length;
            }

            if (afters) {
                a += afters.length;
            }
        }

        if (when) {
            return (when === 'after') ? a : s;
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
            args = nativeSlice.call(arguments, 0);
        args[0] = type;
        return this.host.on.apply(this.host, args);
    },

    /**
     * Get all of the subscribers to this event and any sibling event
     * @method getSubs
     * @return {Array} first item is the on subscribers, second the after.
     */
    getSubs: function() {

        var sibling = this.sibling,
            subs = this._subscribers,
            afters = this._afters,
            siblingSubs,
            siblingAfters;

        if (sibling) {
            siblingSubs = sibling._subscribers;
            siblingAfters = sibling._afters;
        }

        if (siblingSubs) {
            if (subs) {
                subs = subs.concat(siblingSubs);
            } else {
                subs = siblingSubs.concat();
            }
        } else {
            if (subs) {
                subs = subs.concat();
            } else {
                subs = [];
            }
        }

        if (siblingAfters) {
            if (afters) {
                afters = afters.concat(siblingAfters);
            } else {
                afters = siblingAfters.concat();
            }
        } else {
            if (afters) {
                afters = afters.concat();
            } else {
                afters = [];
            }
        }

        return [subs, afters];
    },

    /**
     * Apply configuration properties.  Only applies the CONFIG whitelist
     * @method applyConfig
     * @param o hash of properties to apply.
     * @param force {boolean} if true, properties that exist on the event
     * will be overwritten.
     */
    applyConfig: function(o, force) {
        mixConfigs(this, o, force);
    },

    /**
     * Create the Subscription for subscribing function, context, and bound
     * arguments.  If this is a fireOnce event, the subscriber is immediately
     * notified.
     *
     * @method _on
     * @param fn {Function} Subscription callback
     * @param [context] {Object} Override `this` in the callback
     * @param [args] {Array} bound arguments that will be passed to the callback after the arguments generated by fire()
     * @param [when] {String} "after" to slot into after subscribers
     * @return {EventHandle}
     * @protected
     */
    _on: function(fn, context, args, when) {

        if (!fn) { this.log('Invalid callback for CE: ' + this.type); }

        var s = new Y.Subscriber(fn, context, args, when),
            firedWith;

        if (this.fireOnce && this.fired) {

            firedWith = this.firedWith;

            // It's a little ugly for this to know about facades,
            // but given the current breakup, not much choice without
            // moving a whole lot of stuff around.
            if (this.emitFacade && this._addFacadeToArgs) {
                this._addFacadeToArgs(firedWith);
            }

            if (this.async) {
                setTimeout(Y.bind(this._notify, this, s, firedWith), 0);
            } else {
                this._notify(s, firedWith);
            }
        }

        if (when === AFTER) {
            if (!this._afters) {
                this._afters = [];
            }
            this._afters.push(s);
        } else {
            if (!this._subscribers) {
                this._subscribers = [];
            }
            this._subscribers.push(s);
        }

        if (this._kds) {
            if (when === AFTER) {
                this.afters[s.id] = s;
            } else {
                this.subscribers[s.id] = s;
            }
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
        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
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
        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;

        if (this.monitored && this.host) {
            this.host._monitor('attach', this, {
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
        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
        return this._on(fn, context, a, AFTER);
    },

    /**
     * Detach listeners.
     * @method detach
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed.
     * @param {Object}   context The context object passed to subscribe.
     * @return {Number} returns the number of subscribers unsubscribed.
     */
    detach: function(fn, context) {
        // unsubscribe handle
        if (fn && fn.detach) {
            return fn.detach();
        }

        var i, s,
            found = 0,
            subs = this._subscribers,
            afters = this._afters;

        if (subs) {
            for (i = subs.length; i >= 0; i--) {
                s = subs[i];
                if (s && (!fn || fn === s.fn)) {
                    this._delete(s, subs, i);
                    found++;
                }
            }
        }

        if (afters) {
            for (i = afters.length; i >= 0; i--) {
                s = afters[i];
                if (s && (!fn || fn === s.fn)) {
                    this._delete(s, afters, i);
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
     * @protected
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
        if (!this.silent) { Y.log(this.id + ': ' + msg, cat || 'info', 'event'); }
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

        // push is the fastest way to go from arguments to arrays
        // for most browsers currently
        // http://jsperf.com/push-vs-concat-vs-slice/2

        var args = [];
        args.push.apply(args, arguments);

        return this._fire(args);
    },

    /**
     * Private internal implementation for `fire`, which is can be used directly by
     * `EventTarget` and other event module classes which have already converted from
     * an `arguments` list to an array, to avoid the repeated overhead.
     *
     * @method _fire
     * @private
     * @param {Array} args The array of arguments passed to be passed to handlers.
     * @return {boolean} false if one of the subscribers returned false, true otherwise.
     */
    _fire: function(args) {

        if (this.fireOnce && this.fired) {
            this.log('fireOnce event: ' + this.type + ' already fired');
            return true;
        } else {

            // this doesn't happen if the event isn't published
            // this.host._monitor('fire', this.type, args);

            this.fired = true;

            if (this.fireOnce) {
                this.firedWith = args;
            }

            if (this.emitFacade) {
                return this.fireComplex(args);
            } else {
                return this.fireSimple(args);
            }
        }
    },

    /**
     * Set up for notifying subscribers of non-emitFacade events.
     *
     * @method fireSimple
     * @param args {Array} Arguments passed to fire()
     * @return Boolean false if a subscriber returned false
     * @protected
     */
    fireSimple: function(args) {
        this.stopped = 0;
        this.prevented = 0;
        if (this.hasSubs()) {
            var subs = this.getSubs();
            this._procSubs(subs[0], args);
            this._procSubs(subs[1], args);
        }
        if (this.broadcast) {
            this._broadcast(args);
        }
        return this.stopped ? false : true;
    },

    // Requires the event-custom-complex module for full funcitonality.
    fireComplex: function(args) {
        this.log('Missing event-custom-complex needed to emit a facade for: ' + this.type);
        args[0] = args[0] || {};
        return this.fireSimple(args);
    },

    /**
     * Notifies a list of subscribers.
     *
     * @method _procSubs
     * @param subs {Array} List of subscribers
     * @param args {Array} Arguments passed to fire()
     * @param ef {}
     * @return Boolean false if a subscriber returns false or stops the event
     *              propagation via e.stopPropagation(),
     *              e.stopImmediatePropagation(), or e.halt()
     * @private
     */
    _procSubs: function(subs, args, ef) {
        var s, i, l;

        for (i = 0, l = subs.length; i < l; i++) {
            s = subs[i];
            if (s && s.fn) {
                if (false === this._notify(s, args, ef)) {
                    this.stopped = 2;
                }
                if (this.stopped === 2) {
                    return false;
                }
            }
        }

        return true;
    },

    /**
     * Notifies the YUI instance if the event is configured with broadcast = 1,
     * and both the YUI instance and Y.Global if configured with broadcast = 2.
     *
     * @method _broadcast
     * @param args {Array} Arguments sent to fire()
     * @private
     */
    _broadcast: function(args) {
        if (!this.stopped && this.broadcast) {

            var a = args.concat();
            a.unshift(this.type);

            if (this.host !== Y) {
                Y.fire.apply(Y, a);
            }

            if (this.broadcast === 2) {
                Y.Global.fire.apply(Y.Global, a);
            }
        }
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {Number} The number of listeners unsubscribed.
     * @deprecated use detachAll.
     */
    unsubscribeAll: function() {
        return this.detachAll.apply(this, arguments);
    },

    /**
     * Removes all listeners
     * @method detachAll
     * @return {Number} The number of listeners unsubscribed.
     */
    detachAll: function() {
        return this.detach();
    },

    /**
     * Deletes the subscriber from the internal store of on() and after()
     * subscribers.
     *
     * @method _delete
     * @param s subscriber object.
     * @param subs (optional) on or after subscriber array
     * @param index (optional) The index found.
     * @private
     */
    _delete: function(s, subs, i) {
        var when = s._when;

        if (!subs) {
            subs = (when === AFTER) ? this._afters : this._subscribers;
        }

        if (subs) {
            i = YArray.indexOf(subs, s, 0);

            if (s && subs[i] === s) {
                subs.splice(i, 1);
            }
        }

        if (this._kds) {
            if (when === AFTER) {
                delete this.afters[s.id];
            } else {
                delete this.subscribers[s.id];
            }
        }

        if (this.monitored && this.host) {
            this.host._monitor('detach', this, {
                ce: this,
                sub: s
            });
        }

        if (s) {
            s.deleted = true;
        }
    }
};

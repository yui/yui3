YUI.add('event-custom-base', function(Y) {

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 */

var AFTER = 'after',
    AFTER_PREFIX = '~AFTER~',
    PREFIX_DELIMITER = ':',
    CATEGORY_DELIMITER = '|',

    DO_BEFORE = 0,
    DO_AFTER = 1,

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
    YUI_LOG = 'yui:log',

    toArray    = Y.Array,
    Lang       = Y.Lang,
    isString   = Lang.isString,
    isArray    = Lang.isArray,
    isObject   = Lang.isObject,
    isFunction = Lang.isFunction,

    _wildType = Y.cached(function(type) {
        var i = type.indexOf(':');
        return (i > -1) ? '*' + type.slice(i) : type;
    }),

    /**
     * If the instance has a prefix attribute and the
     * event type is not prefixed, the instance prefix is
     * applied to the supplied type.
     * @method _getType
     * @private
     */
    _getType = Y.cached(function(type, pre) {

        if (!pre || !isString(type) || type.indexOf(PREFIX_DELIMITER) > -1) {
            return type;
        }

        return pre + PREFIX_DELIMITER + type;
    }),

    synths          = {},
    categoryHandles = {},

    proto,
    eventTargetOn,
    eventTargetDetach;


Y.Env.evt = {
    handles: categoryHandles,
    plugins: synths
};

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * Wrapper for a displaced method with aop enabled
 * @class Do.Method
 * @constructor
 * @param obj The object to operate on
 * @param sFn The name of the method to displace
 */
function DoMethod(obj, sFn) {
    this.obj = obj;
    this.methodName = sFn;
    this.method = obj[sFn];
    this.before = {};
    this.after = {};
}

DoMethod.prototype = {
    constructor: DoMethod,

    /**
     * Register a aop subscriber
     * @method register
     * @param sid {string} the subscriber id
     * @param fn {Function} the function to execute
     * @param when {string} when to execute the function
     */
    register: function (sid, fn, when) {
        if (when) {
            this.after[sid] = fn;
        } else {
            this.before[sid] = fn;
        }
    },

    /**
     * Unregister a aop subscriber
     * @method delete
     * @param sid {string} the subscriber id
     * @param fn {Function} the function to execute
     * @param when {string} when to execute the function
     */
    _delete: function (sid) {
        delete this.before[sid];
        delete this.after[sid];
    },

    /**
     * <p>Execute the wrapped method.  All arguments are passed into the wrapping
     * functions.  If any of the before wrappers return an instance of
     * <code>Y.Do.Halt</code> or <code>Y.Do.Prevent</code>, neither the wrapped
     * function nor any after phase subscribers will be executed.</p>
     *
     * <p>The return value will be the return value of the wrapped function or one
     * provided by a wrapper function via an instance of <code>Y.Do.Halt</code> or
     * <code>Y.Do.AlterReturn</code>.
     *
     * @method exec
     * @param arg* {any} Arguments are passed to the wrapping and wrapped functions
     * @return {any} Return value of wrapped function unless overwritten (see above)
     */
    exec: function () {
        var args = toArray(arguments, 0, true),
            i, ret, newRet,
            bf = this.before,
            af = this.after,
            prevented = false,
            DO = Y.Do;

        // execute before
        for (i in bf) {
            if (bf.hasOwnProperty(i)) {
                ret = bf[i].apply(this.obj, args);
                if (ret) {
                    switch (ret.constructor) {
                        case DO.Halt:
                            return ret.retVal;
                        case DO.AlterArgs:
                            args = ret.newArgs;
                            break;
                        case DO.Prevent:
                            prevented = true;
                            break;
                        default:
                    }
                }
            }
        }

        // execute method
        if (!prevented) {
            ret = this.method.apply(this.obj, args);
        }

        DO.originalRetVal = ret;
        DO.currentRetVal = ret;

        // execute after methods.
        for (i in af) {
            if (af.hasOwnProperty(i)) {
                newRet = af[i].apply(this.obj, args);
                // Stop processing if a Halt object is returned
                if (newRet && newRet.constructor == DO.Halt) {
                    return newRet.retVal;
                // Check for a new return value
                } else if (newRet && newRet.constructor == DO.AlterReturn) {
                    ret = newRet.newRetVal;
                    // Update the static retval state
                    DO.currentRetVal = ret;
                }
            }
        }

        return ret;
    }
};

/**
 * Allows for the insertion of methods that are executed before or after
 * a specified method
 * @class Do
 * @static
 */
Y.Do = {
    Method: DoMethod,

    /**
     * Return an AlterArgs object when you want to change the arguments that
     * were passed into the function.  Useful for Do.before subscribers.  An
     * example would be a service that scrubs out illegal characters prior to
     * executing the core business logic.
     * @class Do.AlterArgs
     * @constructor
     * @param msg {String} (optional) Explanation of the altered return value
     * @param newArgs {Array} Call parameters to be used for the original method
     *                        instead of the arguments originally passed in.
     */
    AlterArgs: function(msg, newArgs) {
        this.msg = msg;
        this.newArgs = newArgs;
    },

    /**
     * Return an AlterReturn object when you want to change the result returned
     * from the core method to the caller.  Useful for Do.after subscribers.
     * @class Do.AlterReturn
     * @constructor
     * @param msg {String} (optional) Explanation of the altered return value
     * @param newRetVal {any} Return value passed to code that invoked the
     *                      wrapped function.
     */
    AlterReturn: function(msg, newRetVal) {
        this.msg = msg;
        this.newRetVal = newRetVal;
    },

    /**
     * Return a Halt object when you want to terminate the execution
     * of all subsequent subscribers as well as the wrapped method
     * if it has not exectued yet.  Useful for Do.before subscribers.
     * @class Do.Halt
     * @constructor
     * @param [msg] {String} Explanation of why the termination was done
     * @param retVal {any} Return value passed to code that invoked the wrapped
     *                      function.
     */
    Halt: function(msg, retVal) {
        this.msg = msg;
        this.retVal = retVal;
    },

    /**
     * Return a Prevent object when you want to prevent the wrapped function
     * from executing, but want the remaining listeners to execute.  Useful
     * for Do.before subscribers.
     * @class Do.Prevent
     * @constructor
     * @param [msg] {String} Explanation of why the termination was done
     */
    Prevent: function(msg) {
        this.msg = msg;
    },

    /**
     * Contains the return value from the wrapped method, accessible
     * by 'after' event listeners.
     *
     * @property Do.originalRetVal
     * @static
     * @since 3.2.0
     */
    //originalRetVal: undefined,

    /**
     * Contains the current state of the return value, consumable by
     * 'after' event listeners, and updated if an after subscriber
     * changes the return value generated by the wrapped function.
     *
     * @property Do.currentRetVal
     * @static
     * @since 3.2.0
     */
    //currentRetVal: undefined,

    /**
     * Cache of objects touched by the utility
     * @property objs
     * @static
     */
    objs: {},

    /**
     * <p>Execute the supplied method before the specified function.  Wrapping
     * function may optionally return an instance of the following classes to
     * further alter runtime behavior:</p>
     * <dl>
     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>
     *         <dd>Immediatly stop execution and return
     *         <code>returnValue</code>.  No other wrapping functions will be
     *         executed.</dd>
     *     <dt></code>Y.Do.AlterArgs(message, newArgArray)</code></dt>
     *         <dd>Replace the arguments that the original function will be
     *         called with.</dd>
     *     <dt></code>Y.Do.Prevent(message)</code></dt>
     *         <dd>Don't execute the wrapped function.  Other before phase
     *         wrappers will be executed.</dd>
     * </dl>
     *
     * @method before
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * when the event fires.
     * @return {string} handle for the subscription
     * @static
     */
    before: function(fn, obj, sFn, c) {
        var f = fn, a;
        if (c) {
            a = [fn, c].concat(toArray(arguments, 4, true));
            f = Y.rbind.apply(Y, a);
        }

        return this._inject(DO_BEFORE, f, obj, sFn);
    },

    /**
     * <p>Execute the supplied method after the specified function.  Wrapping
     * function may optionally return an instance of the following classes to
     * further alter runtime behavior:</p>
     * <dl>
     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>
     *         <dd>Immediatly stop execution and return
     *         <code>returnValue</code>.  No other wrapping functions will be
     *         executed.</dd>
     *     <dt></code>Y.Do.AlterReturn(message, returnValue)</code></dt>
     *         <dd>Return <code>returnValue</code> instead of the wrapped
     *         method's original return value.  This can be further altered by
     *         other after phase wrappers.</dd>
     * </dl>
     *
     * <p>The static properties <code>Y.Do.originalRetVal</code> and
     * <code>Y.Do.currentRetVal</code> will be populated for reference.</p>
     *
     * @method after
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return {string} handle for the subscription
     * @static
     */
    after: function(fn, obj, sFn, c) {
        var f = fn, a;
        if (c) {
            a = [fn, c].concat(toArray(arguments, 4, true));
            f = Y.rbind.apply(Y, a);
        }

        return this._inject(DO_AFTER, f, obj, sFn);
    },

    /**
     * Execute the supplied method before or after the specified function.
     * Used by <code>before</code> and <code>after</code>.
     *
     * @method _inject
     * @param when {string} before or after
     * @param fn {Function} the function to execute
     * @param obj the object hosting the method to displace
     * @param sFn {string} the name of the method to displace
     * @param c The execution context for fn
     * @return {string} handle for the subscription
     * @private
     * @static
     */
    _inject: function(when, fn, obj, sFn) {

        // object id
        var id = Y.stamp(obj), o, sid;

        if (! this.objs[id]) {
            // create a map entry for the obj if it doesn't exist
            this.objs[id] = {};
        }

        o = this.objs[id];

        if (! o[sFn]) {
            // create a map entry for the method if it doesn't exist
            o[sFn] = new Y.Do.Method(obj, sFn);

            // re-route the method to our wrapper
            obj[sFn] =
                function() {
                    return o[sFn].exec.apply(o[sFn], arguments);
                };
        }

        // subscriber id
        sid = id + Y.stamp(fn) + sFn;

        // register the callback
        o[sFn].register(sid, fn, when);

        return new Y.EventHandle(o[sFn], sid);

    },

    /**
     * Detach a before or after subscription.
     *
     * @method detach
     * @param handle {string} the subscription handle
     * @static
     */
    detach: function(handle) {

        if (handle.detach) {
            handle.detach();
        }

    },

    _unload: function(e, me) {
        // TODO: Implement or remove?
    }
};

/**
 * Return an Error object when you want to terminate the execution
 * of all subsequent method calls.
 * @class Do.Error
 * @constructor
 * @param msg {String} (optional) Explanation of the altered return value
 * @param retVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 * @deprecated use Y.Do.Halt or Y.Do.Prevent
 */
Y.Do.Error = Y.Do.Halt;

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

// var onsubscribeType = "_event:onsub",
/**
 * Return value from all subscribe operations
 * @class EventHandle
 * @constructor
 * @param {CustomEvent} evt the custom event.
 * @param {Subscriber} sub the subscriber.
 */
function EventHandle(evt, sub) {

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
}

EventHandle.prototype = {
    batch: function(f, c) {
        f.call(c || this, this);
        if (Lang.isArray(this.evt)) {
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
            if (Lang.isArray(evt)) {
                for (i = 0; i < evt.length; i++) {
                    detached += evt[i].detach();
                }
            } else {
                evt._delete(this.sub);
                detached = 1;
            }

            // This is an incomplete and awkward solution.
            // Not all subscriptions are detached by handle, so there are
            // detach paths that can leave the category collection cluttered
            // with dead references.
            if (this.category && evt.host) {
                evt.host._unregisterSub(this.category, this);
                delete this.category;
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
Y.EventHandle = EventHandle;

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
function CustomEvent(type, o) {

    // if (arguments.length > 2) {
// this.log('CustomEvent context and silent are now in the config', 'warn', 'Event');
    // }

    var self = this;
    o = o || {};

    self.id = Y.stamp(self);

    /**
     * The type of event, returned to subscribers when the event fires
     * @property type
     * @type string
     */
    self.type = type;

    /**
     * The context the the event will fire from by default.  Defaults to the YUI
     * instance.
     * @property context
     * @type object
     */
    self.context = Y;

    /**
     * Monitor when an event is attached or detached.
     *
     * @property monitored
     * @type boolean
     */
    // this.monitored = false;

    self.logSystem = (type == YUI_LOG);

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
    self.silent = self.logSystem;

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
    self.subscribers = {};

    /**
     * 'After' subscribers
     * @property afters
     * @type Subscriber {}
     */
    self.afters = {};

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
    self.preventable = true;

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
    self.bubbles = true;

    /**
     * Supports multiple options for listener signatures in order to
     * port YUI 2 apps.
     * @property signature
     * @type int
     * @default 9
     */
    self.signature = YUI3_SIGNATURE;

    self.subCount = 0;
    self.afterCount = 0;

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

    self.applyConfig(o, true);

    // this.log("Creating " + this.type);

}

proto = {
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
        var self = this,
            type = self.id + '|' + self.type + '_' + what,
            args = toArray(arguments, 0, true);

        self.monitored = true;
        args[0] = type;
        return self.host.on.apply(self.host, args);
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


        var self = this,
            s = new Y.Subscriber(fn, context, args, when);

        if (self.fireOnce && self.fired) {
            if (self.async) {
                setTimeout(Y.bind(self._notify, self, s, self.firedWith), 0);
            } else {
                self._notify(s, self.firedWith);
            }
        }

        if (when == AFTER) {
            self.afters[s.id] = s;
            self.afterCount++;
        } else {
            self.subscribers[s.id] = s;
            self.subCount++;
        }

        return new Y.EventHandle(self, s);

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
        var a = (arguments.length > 2) ? toArray(arguments, 2, true) : null;
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
        var a = (arguments.length > 2) ? toArray(arguments, 2, true) : null;
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

    /**
     * Notify a single subscriber
     * @method _notify
     * @param {Subscriber} s the subscriber.
     * @param {Array} args the arguments array to apply to the listener.
     * @private
     */
    _notify: function(s, args, ef) {


        var self = this,
            ret;

        ret = s.notify(args, self);

        if (false === ret || self.stopped > 1) {
            return false;
        }

        return true;
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
        var self = this,
            method = (self.emitFacade) ? 'fireComplex' : 'fireSimple',
            args   = toArray(arguments, 0, true);

        if (self.fireOnce) {
            self.fired = true;
            self.firedWith = args;
            self.fire = self._fireImmediate;
        }

        // this doesn't happen if the event isn't published
        // this.host._monitor('fire', this.type, args);

        return self[method](args);
    },
    
    _fireImmediate: function () {
        return true;
    },

    fireSimple: function(args) {
        var self = this,
            subs;

        self.stopped = 0;
        self.prevented = 0;
        if (self.hasSubs()) {
            // this._procSubs(Y.merge(this.subscribers, this.afters), args);
            subs = self.getSubs();
            self._procSubs(subs[0], args);
            self._procSubs(subs[1], args);
        }
        self.broadcast && !self.stopped && self._broadcast(args);
        return self.stopped ? false : true;
    },

    // Requires the event-custom-complex module for full funcitonality.
    fireComplex: function(args) {
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
        var a = args.slice();
        a.unshift(this.type);

        if (this.host !== Y) {
            Y.fire.apply(Y, a);
        }

        if (this.broadcast == 2) {
            Y.Global.fire.apply(Y.Global, a);
        }
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed.
     * @deprecated use detachAll.
     */

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
        var self = this;
        if (s) {
            if (self.subscribers[s.id]) {
                delete self.subscribers[s.id];
                self.subCount--;
            }
            if (self.afters[s.id]) {
                delete self.afters[s.id];
                self.afterCount--;
            }
        }

        if (self.host) {
            self.host._monitor('detach', self.type, {
                ce: self,
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
proto.unsubscribe = proto.detach;
proto.unsubscribeAll = proto.detachAll;

CustomEvent.prototype = proto;
Y.CustomEvent = CustomEvent;

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
function Subscriber(fn, context, args) {
    var self = this;
    /**
     * The callback that will be execute when the event fires
     * This is wrapped by Y.rbind if obj was supplied.
     * @property fn
     * @type Function
     */
    self.fn = fn;

    /**
     * Optional 'this' keyword for the listener
     * @property context
     * @type Object
     */
    self.context = context;

    /**
     * Unique subscriber id
     * @property id
     * @type String
     */
    self.id = Y.stamp(self);

    /**
     * Additional arguments to propagate to the subscriber
     * @property args
     * @type Array
     */
    self.args = args;

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

}

Subscriber.prototype = {

    _notify: function(c, args, ce) {
        if (this.deleted && !this.postponed) {
            delete this.postponed;
            return null;
        }
        var a = this.args, callback = this.fn, ret;
        switch (ce.signature) {
            case 0:
                ret = callback.call(c, ce.type, args, c);
                break;
            case 1:
                ret = callback.call(c, args[0] || null, c);
                break;
            default:
                if (a || args) {
                    args = args || [];
                    a = (a) ? args.concat(a) : args;
                    ret = callback.apply(c, a);
                } else {
                    ret = callback.call(c);
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
Y.Subscriber = Subscriber;

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * EventTarget provides the implementation for any object to
 * publish, subscribe and fire to custom events, and also
 * alows other EventTargets to target the object with events
 * sourced from the other object.
 * EventTarget is designed to be used with Y.augment to wrap
 * EventCustom in an interface that allows events to be listened to
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 * @class EventTarget
 * @param opts a configuration object
 * @config emitFacade {boolean} if true, all events will emit event
 * facade payloads by default (default false)
 * @config prefix {string} the prefix to apply to non-prefixed event names
 * @config chain {boolean} if true, on/after/detach return the host to allow
 * chaining, otherwise they return an EventHandle (default false)
 */
function EventTarget(opts) {
    var o = (isObject(opts)) ? opts : {};

    this._yuievt = this._yuievt || {

        id: Y.guid(),

        events: {},

        targets: {},

        config: o,

        chain: ('chain' in o) ? o.chain : Y.config.chain,

        bubbling: false,

        defaults: {
            context: o.context || this,
            host: this,
            emitFacade: o.emitFacade,
            fireOnce: o.fireOnce,
            queuable: o.queuable,
            monitored: o.monitored,
            broadcast: o.broadcast,
            defaultTargetOnly: o.defaultTargetOnly,
            bubbles: ('bubbles' in o) ? o.bubbles : true
        }
    };
}

EventTarget.prototype = {
    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>on</code> except the
     * listener is immediatelly detached when it is executed.
     * @method once
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @param context {object} optional execution context.
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return the event target or a detach handle per 'chain' config
     */
    once: function() {
        var handle = this.on.apply(this, arguments);
        handle.batch(function(hand) {
            if (hand.sub) {
                hand.sub.once = true;
            }
        });
        return handle;
    },

    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>after</code> except the
     * listener is immediatelly detached when it is executed.
     * @method onceAfter
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @param context {object} optional execution context.
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return the event target or a detach handle per 'chain' config
     */
    onceAfter: function() {
        var handle = this.after.apply(this, arguments);
        handle.batch(function(hand) {
            if (hand.sub) {
                hand.sub.once = true;
            }
        });
        return handle;
    },

    /**
     * Takes the type parameter passed to 'on' and parses out the
     * various pieces that could be included in the type.  If the
     * event type is passed without a prefix, it will be expanded
     * to include the prefix one is supplied or the event target
     * is configured with a default prefix.
     *
     * @method parseType
     * @param {string} type the type
     * @param {string} [pre] the prefix
     * @since 3.3.0
     * @return {Array} an array containing:
     *  * the detach category, if supplied,
     *  * the prefixed event type,
     *  * whether or not this is an after listener,
     *  * the supplied event type
     */
    parseType: Y.cached(function(type, pre) {
        if (typeof type !== 'string') {
            return type;
        }

        var afterIndex = type.indexOf(AFTER_PREFIX),
            catIndex   = type.indexOf(CATEGORY_DELIMITER),
            i          = 0,
            after, cat;

        if (afterIndex > -1) {
            after = true;
            // "~AFTER~cat|prefix:name" shift start index from 0 to 7
            i = AFTER_PREFIX.length;
        }

        if (catIndex > -1) {
            // "~AFTER~cat|prefix:name" slice(0 or 7, index of |)
            cat = type.slice(i, catIndex);
            // shift start index to grab the |
            i = catIndex + 1;
        }

        // "~AFTER~cat|prefix:name" => "prefix:name"
        i && (type = type.slice(i));

        if (type === '*') {
            type = null;
        }

        // "~AFTER~cat|prefix:name"
        return [
            cat,   // "cat"
            _getType(type, pre), // "prefix:name"
            after, // true
            type   // "prefix:name" or "name" if "~AFTER~cat|name"
        ];
    }),

    /**
     * Subscribe to a custom event hosted by this object
     * @method on
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @param context {object} optional execution context.
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return the event target or a detach handle per 'chain' config
     */
    on: function(type, fn, context) {
        var parts = this.parseType(type, this._yuievt.config.prefix),
            category, args, isArr, handles, handle, after, ce;

        if (isObject(type)) {
            if (isFunction(type)) {
                return Y.Do.before.apply(Y.Do, arguments);
            }

            isArr = isArray(type);
            args = toArray(arguments, 0, true);
            handles = [];
            after = (type._after && (delete type._after)) ? AFTER_PREFIX : '';

            Y.Object.each(type, function(v, k) {

                if (isArr) {
                    args[0] = after + v;
                } else {
                    args[0] = after + k;
                    args[1] = v.fn || (isFunction(v) ? v : fn);
                    args[2] = v.context || context;
                }

                handles.push(this.on.apply(this, args));

            }, this);

            return new Y.EventHandle(handles);
        }

        category = parts[0];
        type     = parts[1];
        after    = parts[2];
        args     = (arguments.length > 3) ? toArray(arguments, 3, true) : null;

        // full name, args, detachcategory, after
        this._monitor('attach', type, {
            args: arguments,
            category: category,
            after: after
        });

        ce = this._yuievt.events[type] || this.publish(type);

        handle = ce._on(fn, context, args, (after) ? 'after' : true);

        category && this._registerSub(category, handle);

        return handle;
    },

    /**
     * subscribe to an event
     * @method subscribe
     * @deprecated use on
     */
    subscribe: function() {
        return this.on.apply(this, arguments);
    },

    /**
     * Detach one or more listeners the from the specified event
     * @method detach
     * @param type {string|Object}   Either the handle to the subscriber or the
     *                        type of event.  If the type
     *                        is not specified, it will attempt to remove
     *                        the listener from all hosted events.
     * @param fn   {Function} The subscribed function to unsubscribe, if not
     *                          supplied, all subscribers will be removed.
     * @param context  {Object}   The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {EventTarget} the host
     */
    detach: function(type, fn, context) {
        var evts, parts, category, handles, i, ce;

        if (!type) {
            evts = this._yuievt.events;

            for (i in evts) {
                if (evts.hasOwnProperty(i)) {
                    evts[i].detach(fn, context);
                }
            }
        } else if (isObject(type)) {
            type.detach && type.detach();
        } else {
            parts    = this.parseType(type, this._yuievt.config.prefix);
            category = parts[0];

            if (category) {
                handles = this._getCategorySubs(category, parts[3]);
                for (i = handles.length - 1; i >= 0; --i) {
                    handles[i].detach();
                }
            } else {
                ce = this._yuievt.events[parts[1]];
                ce && ce.detach(fn, context);
            }
        }

        return this;
    },

    /**
     * detach a listener
     * @method unsubscribe
     * @deprecated use detach
     */
    unsubscribe: function() {
        return this.detach.apply(this, arguments);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method detachAll
     * @param type {string}   The type, or name of the event
     */
    detachAll: function(type) {
        return this.detach(type);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method unsubscribeAll
     * @param type {string}   The type, or name of the event
     * @deprecated use detachAll
     */
    unsubscribeAll: function() {
        return this.detachAll.apply(this, arguments);
    },

    /**
     * Creates a new custom event of the specified type.  If a custom event
     * by that name already exists, it will not be re-created.  In either
     * case the custom event is returned.
     *
     * @method publish
     *
     * @param type {string} the type, or name of the event
     * @param opts {object} optional config params.  Valid properties are:
     *
     *  <ul>
     *    <li>
     *   'broadcast': whether or not the YUI instance and YUI global are notified when the event is fired (false)
     *    </li>
     *    <li>
     *   'bubbles': whether or not this event bubbles (true)
     *              Events can only bubble if emitFacade is true.
     *    </li>
     *    <li>
     *   'context': the default execution context for the listeners (this)
     *    </li>
     *    <li>
     *   'defaultFn': the default function to execute when this event fires if preventDefault was not called
     *    </li>
     *    <li>
     *   'emitFacade': whether or not this event emits a facade (false)
     *    </li>
     *    <li>
     *   'prefix': the prefix for this targets events, e.g., 'menu' in 'menu:click'
     *    </li>
     *    <li>
     *   'fireOnce': if an event is configured to fire once, new subscribers after
     *   the fire will be notified immediately.
     *    </li>
     *    <li>
     *   'async': fireOnce event listeners will fire synchronously if the event has already
     *    fired unless async is true.
     *    </li>
     *    <li>
     *   'preventable': whether or not preventDefault() has an effect (true)
     *    </li>
     *    <li>
     *   'preventedFn': a function that is executed when preventDefault is called
     *    </li>
     *    <li>
     *   'queuable': whether or not this event can be queued during bubbling (false)
     *    </li>
     *    <li>
     *   'silent': if silent is true, debug messages are not provided for this event.
     *    </li>
     *    <li>
     *   'stoppedFn': a function that is executed when stopPropagation is called
     *    </li>
     *
     *    <li>
     *   'monitored': specifies whether or not this event should send notifications about
     *   when the event has been attached, detached, or published.
     *    </li>
     *    <li>
     *   'type': the event type (valid option if not provided as the first parameter to publish)
     *    </li>
     *  </ul>
     *
     *  @return {CustomEvent} the custom event
     *
     */
    publish: function(type, opts) {
        var edata  = this._yuievt,
            pre    = edata.config.prefix,
            events = edata.events,
            config = edata.defaults,
            ret;

        type = (pre) ? _getType(type, pre) : type;

        this._monitor('publish', type, {
            args: arguments
        });

        if (!events[type]) {
            if (isObject(type)) {
                ret = {};
                Y.each(type, function(v, k) {
                    ret[k] = this.publish(k, v || opts);
                }, this);

                return ret;
            }

            // apply defaults
            opts && (config = Y.merge(config, opts));

            events[type] = new Y.CustomEvent(type, config);
        } else if (opts) {
            events[type].applyConfig(opts, true);
        }

        // make sure we turn the broadcast flag off if this
        // event was published as a result of bubbling
        // if (opts instanceof Y.CustomEvent) {
          //   events[type].broadcast = false;
        // }

        return events[type];
    },

    /**
     * This is the entry point for the event monitoring system.
     * You can monitor 'attach', 'detach', and 'fire'.
     * When configured, these events generate an event.  click ->
     * click_attach, click_detach, click_fire -- these can
     * be subscribed to like other events to monitor the event
     * system.  Individual published events can have monitoring
     * turned on or off (publish can't be turned off before it
     * it published) by setting the events 'monitor' config.
     *
     * @private
     */
    _monitor: function(what, type, o) {
        var monitorevt, ce = this.getEvent(type);
        if ((this._yuievt.config.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {
            monitorevt = type + '_' + what;
            o.monitored = what;
            this.fire.call(this, monitorevt, o);
        }
    },

   /**
     * Fire a custom event by name.  The callback functions will be executed
     * from the context specified when the event was created, and with the
     * following parameters.
     *
     * If the custom event object hasn't been created, then the event hasn't
     * been published and it has no subscribers.  For performance sake, we
     * immediate exit in this case.  This means the event won't bubble, so
     * if the intention is that a bubble target be notified, the event must
     * be published on this object first.
     *
     * The first argument is the event type, and any additional arguments are
     * passed to the listeners as parameters.  If the first of these is an
     * object literal, and the event is configured to emit an event facade,
     * that object is mixed into the event facade and the facade is provided
     * in place of the original object.
     *
     * @method fire
     * @param type {String|Object} The type of the event, or an object that contains
     * a 'type' property.
     * @param arguments {Object*} an arbitrary set of parameters to pass to
     * the handler.  If the first of these is an object literal and the event is
     * configured to emit an event facade, the event facade will replace that
     * parameter after the properties the object literal contains are copied to
     * the event facade.
     * @return {EventTarget} the event host
     *
     */
    fire: function(type) {

        var typeIncluded = (typeof type === 'string'),
            t = (typeIncluded) ? type : (type && type.type),
            ce, ret, pre = this._yuievt.config.prefix, ce2,
            args = (typeIncluded) ? toArray(arguments, 1, true) : arguments;

        t = (pre) ? _getType(t, pre) : t;

        this._monitor('fire', t, {
            args: args
        });

        ce = this.getEvent(t, true);
        ce2 = this.getSibling(t, ce);

        if (ce2 && !ce) {
            ce = this.publish(t);
        }

        // this event has not been published or subscribed to
        if (!ce) {
            if (this._yuievt.hasTargets) {
                return this.bubble({ type: t }, args, this);
            }

            // otherwise there is nothing to be done
            ret = true;
        } else {
            ce.sibling = ce2;
            ret = ce.fire.apply(ce, args);
        }

        return (this._yuievt.chain) ? this : ret;
    },

    getSibling: function(type, ce) {
        var ce2;
        // delegate to *:type events if there are subscribers
        if (type.indexOf(PREFIX_DELIMITER) > -1) {
            type = _wildType(type);
            ce2 = this.getEvent(type, true);
            if (ce2) {
                ce2.applyConfig(ce);
                ce2.bubbles = false;
                ce2.broadcast = 0;
            }
        }

        return ce2;
    },

    /**
     * Returns the custom event of the provided type has been created, a
     * falsy value otherwise
     * @method getEvent
     * @param type {string} the type, or name of the event
     * @param prefixed {string} if true, the type is prefixed already
     * @return {CustomEvent} the custom event or null
     */
    getEvent: function(type, prefixed) {
        var pre;
        if (!prefixed) {
            pre = this._yuievt.config.prefix;
            type = (pre) ? _getType(type, pre) : type;
        }
        return this._yuievt.events[type] || null;
    },

    /**
     * Subscribe to a custom event hosted by this object.  The
     * supplied callback will execute after any listeners add
     * via the subscribe method, and after the default function,
     * if configured for the event, has executed.
     * @method after
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @param context {object} optional execution context.
     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber
     * @return the event target or a detach handle per 'chain' config
     */
    after: function(type, fn) {

        var a = toArray(arguments, 0, true);

        switch (Lang.type(type)) {
            case 'function':
                return Y.Do.after.apply(Y.Do, arguments);
            case 'array':
            //     toArray.each(a[0], function(v) {
            //         v = AFTER_PREFIX + v;
            //     });
            //     break;
            case 'object':
                a[0]._after = true;
                break;
            default:
                a[0] = AFTER_PREFIX + type;
        }

        return this.on.apply(this, a);

    },

    /**
     * Executes the callback before a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.  For DOM and custom
     * events, this is an alias for Y.on.
     *
     * For DOM and custom events:
     * type, callback, context, 0-n arguments
     *
     * For methods:
     * callback, object (method host), methodName, context, 0-n arguments
     *
     * @method before
     * @return detach handle
     */
    before: function() {
        return this.on.apply(this, arguments);
    },

    /**
     * Registers a subscription handle with a detach category for this instance.
     *
     * @method _registerSub
     * @param category {String} the detach category
     * @param handle {EventHandle} the subscription handle
     * @protected
     */
    _registerSub: function (category, handle) {
        var store = this._yuievt;
        
        store = store.categories || (store.categories = {});
        store = store[category] || (store[category] = []);

        handle.category = category;
        store.push(handle);
    },

    /**
     * Gets subscription handles registered with a category, optionally also
     * matching a specific event type.
     *
     * @method _getCategorySubs
     * @param category {String} the detach category
     * @param [type] {String} the event type to limit the results
     * @return {EventHandle[]}
     */
    _getCategorySubs: function (category, type) {
        var store = this._yuievt.categories,
            handles, i, len;

        store && (store = store[category]);

        if (store && type) {
            handles = store;
            store = [];
            for (i = 0, len = handles.length; i < len; ++i) {
                if (handles[i].evt.type === type) {
                    store.push(handles[i]);
                }
            }
        }

        return store;
    },

    /**
     * Removes the registration for a subscription to a given detach category.
     *
     * @method _unregisterSub
     * @param category {String} the detach category
     * @param handle {EventHandle} the handle to unregister
     * @protected
     */
    _unregisterSub: function (category, handle) {
        var cats = this._yuievt.categories,
            store = cats && cats[category],
            i;

        if (store) {
            for (i = store.length - 1; i >= 0; --i) {
                if (store[i] === handle) {
                    // This is icky. It relies on both EventTarget and
                    // EventHandle to manage the category property.  The
                    // Object relationship is too complex.
                    delete handle.category;
                    store.splice(i, 1);
                }
            }
        }

        if (store && !store.length) {
            delete cats[category];
        }
    }
};

Y.EventTarget = EventTarget;
// Create shared global event target for cross-instance messaging
// @TODO implement a global namespace function on Y.Global?
if (!YUI.Env.globalEvents) {
    YUI.Env.globalEvents = new EventTarget({
        //prefix: 'global',
        bubbles: false
    });
}

/**
 * Hosts YUI page level events.  This is where events bubble to
 * when the broadcast config is set to 2.  This property is
 * only available if the custom event module is loaded.
 * @property Global
 * @type EventTarget
 * @for YUI
 */
Y.Global = YUI.Env.globalEvents;


proto = EventTarget.prototype;
eventTargetOn = proto.on;
eventTargetDetach = proto.detach;

// make Y an event target
Y.mix(Y, proto, true);
EventTarget.call(Y, {
    // this caused some tests in the test suite to fail, but I'm not sure if
    // they actually should be failing, given the test suite code.
    //prefix: 'y',
    bubbles: false
});

/**
 * <code>YUI</code>'s <code>on</code> method is a unified interface for subscribing to
 * most events exposed by YUI.  This includes custom events, DOM events, and
 * function events.  <code>detach</code> is also provided to remove listeners
 * serviced by this function.
 *
 * The signature that <code>on</code> accepts varies depending on the type
 * of event being consumed.  Refer to the specific methods that will
 * service a specific request for additional information about subscribing
 * to that type of event.
 *
 * <ul>
 * <li>Custom events.  These events are defined by various
 * modules in the library.  This type of event is delegated to
 * <code>EventTarget</code>'s <code>on</code> method.
 *   <ul>
 *     <li>The type of the event</li>
 *     <li>The callback to execute</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example:
 *   <code>Y.on('drag:drophit', function() { // start work });</code>
 * </li>
 * <li>DOM events.  These are moments reported by the browser related
 * to browser functionality and user interaction.
 * This type of event is delegated to <code>Event</code>'s
 * <code>attach</code> method.
 *   <ul>
 *     <li>The type of the event</li>
 *     <li>The callback to execute</li>
 *     <li>The specification for the Node(s) to attach the listener
 *     to.  This can be a selector, collections, or Node/Element
 *     refereces.</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example:
 *   <code>Y.on('click', function(e) { // something was clicked }, '#someelement');</code>
 * </li>
 * <li>Function events.  These events can be used to react before or after a
 * function is executed.  This type of event is delegated to <code>Event.Do</code>'s
 * <code>before</code> method.
 *   <ul>
 *     <li>The callback to execute</li>
 *     <li>The object that has the function that will be listened for.</li>
 *     <li>The name of the function to listen for.</li>
 *     <li>An optional context object</li>
 *     <li>0..n additional arguments to supply the callback.</li>
 *   </ul>
 *   Example <code>Y.on(function(arg1, arg2, etc) { // obj.methodname was executed }, obj 'methodname');</code>
 * </li>
 * </ul>
 *
 * <code>on</code> corresponds to the moment before any default behavior of
 * the event.  <code>after</code> works the same way, but these listeners
 * execute after the event's default behavior.  <code>before</code> is an
 * alias for <code>on</code>.
 *
 * @method on
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return {EventHandle} a detach handle for the subscription
 * @for YUI
 */
Y.on = function (type, fn, context) {
    var parts = this.parseType(type),
        Node  = Y.Node,
        name, domEvent, args, category, handle;

    name = parts[3];
    domEvent = synths[name] || (Node && Node.DOM_EVENTS[name]);

    // Y.on() should explicitly handle only synthetic and DOM events.
    // Custom events can be handled by EventTarget's prototype method.
    // Also, object, array, and function signatures can be routed through
    // EventTarget's prototype method to loop back here for individual
    // subscriptions.
    if (!isString(name) || !domEvent) {
        return eventTargetOn.apply(this, arguments);
    }

    // full name, args, detachcategory, after
    this._monitor('attach', parts[1], {
        args: arguments,
        category: parts[0],
        after: parts[2]
    });

    args = toArray(arguments, 0, true);
    category = parts[0];

    if (Node && isObject(context)) {
        if (Y.instanceOf(context, Y.NodeList)) {
            args[2] = Y.NodeList.getDOMNodes(context);
        } else if (Y.instanceOf(context, Node)) {
            args[2] = Node.getDOMNode(context);
        }
    }

    handle = (domEvent.on) ?
        domEvent.on.apply(Y, args) : // synthetic event subscription
        Y.Event._attach(args);       // DOM event subscription

    category && this._registerSub(category, handle);

    return handle;
};

/**
 * Listen for an event one time.  Equivalent to <code>on</code>, except that
 * the listener is immediately detached when executed.
 * @see on
 * @method once
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return {EventHandle} a detach handle for the subscription
 * @for YUI
 */

/**
 * after() is a unified interface for subscribing to
 * most events exposed by YUI.  This includes custom events,
 * DOM events, and AOP events.  This works the same way as
 * the on() function, only it operates after any default
 * behavior for the event has executed. @see <code>on</code> for more
 * information.
 * @method after
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return {EventHandle} a detach handle for the subscription
 * @for YUI
 */

/**
 * Listen for an event one time.  Equivalent to <code>after</code>, except that
 * the listener is immediately detached when executed.
 * @see after
 * @method onceAfter
 * @param type event type (this parameter does not apply for function events)
 * @param fn the callback
 * @param context optionally change the value of 'this' in the callback
 * @param args* 0..n additional arguments to pass to the callback.
 * @return {EventHandle} a detach handle for the subscription
 * @for YUI
 */

/**
 * Detaches an event subscription.
 * @method detach
 * @param type {string|Object}   Either the handle to the subscriber or the
 *                        type of event.  If the type
 *                        is not specified, it will attempt to remove
 *                        the listener from all hosted events.
 * @param fn   {Function} The subscribed function to unsubscribe, if not
 *                          supplied, all subscribers will be removed.
 * @param context  {Object}   The custom object passed to subscribe.  This is
 *                        optional, but if supplied will be used to
 *                        disambiguate multiple listeners that are the same
 *                        (e.g., you subscribe many object using a function
 *                        that lives on the prototype)
 * @return {YUI} the YUI instance
 * @for YUI
 */
Y.detach = function (type) {
    if (!type) {
        return this;
    }

    var parts    = this.parseType(type),
        Node     = Y.Node,
        category = parts[0],
        name     = !category && parts[3], // abort if detachcategory
        domEvent = name && (synths[name] || (Node && Node.DOM_EVENTS[name])),
        args;

    if (domEvent) {
        args = toArray(arguments, 0, true);
        args[0] = name;

        if (domEvent.detach) {
            domEvent.detach.apply(Y, args);
        } else {
            Y.Event.detach.apply(Y.Event, args);
        }
    } else {
        eventTargetDetach.apply(this, arguments);
    }

    return this;
};


}, '@VERSION@' ,{requires:['oop']});

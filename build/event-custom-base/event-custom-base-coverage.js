if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/event-custom-base/event-custom-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/event-custom-base/event-custom-base.js",
    code: []
};
_yuitest_coverage["/build/event-custom-base/event-custom-base.js"].code=["YUI.add('event-custom-base', function(Y) {","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event-custom"," */","","Y.Env.evt = {","    handles: {},","    plugins: {}","};","","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event-custom"," * @submodule event-custom-base"," */","","/**"," * Allows for the insertion of methods that are executed before or after"," * a specified method"," * @class Do"," * @static"," */","","var DO_BEFORE = 0,","    DO_AFTER = 1,","","DO = {","","    /**","     * Cache of objects touched by the utility","     * @property objs","     * @static","     * @deprecated Since 3.6.0. The `_yuiaop` property on the AOP'd object ","     * replaces the role of this property, but is considered to be private, and ","     * is only mentioned to provide a migration path.","     * ","     * If you have a use case which warrants migration to the _yuiaop property, ","     * please file a ticket to let us know what it's used for and we can see if ","     * we need to expose hooks for that functionality more formally.","     */","    objs: null,","","    /**","     * <p>Execute the supplied method before the specified function.  Wrapping","     * function may optionally return an instance of the following classes to","     * further alter runtime behavior:</p>","     * <dl>","     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>","     *         <dd>Immediatly stop execution and return","     *         <code>returnValue</code>.  No other wrapping functions will be","     *         executed.</dd>","     *     <dt></code>Y.Do.AlterArgs(message, newArgArray)</code></dt>","     *         <dd>Replace the arguments that the original function will be","     *         called with.</dd>","     *     <dt></code>Y.Do.Prevent(message)</code></dt>","     *         <dd>Don't execute the wrapped function.  Other before phase","     *         wrappers will be executed.</dd>","     * </dl>","     *","     * @method before","     * @param fn {Function} the function to execute","     * @param obj the object hosting the method to displace","     * @param sFn {string} the name of the method to displace","     * @param c The execution context for fn","     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber","     * when the event fires.","     * @return {string} handle for the subscription","     * @static","     */","    before: function(fn, obj, sFn, c) {","        var f = fn, a;","        if (c) {","            a = [fn, c].concat(Y.Array(arguments, 4, true));","            f = Y.rbind.apply(Y, a);","        }","","        return this._inject(DO_BEFORE, f, obj, sFn);","    },","","    /**","     * <p>Execute the supplied method after the specified function.  Wrapping","     * function may optionally return an instance of the following classes to","     * further alter runtime behavior:</p>","     * <dl>","     *     <dt></code>Y.Do.Halt(message, returnValue)</code></dt>","     *         <dd>Immediatly stop execution and return","     *         <code>returnValue</code>.  No other wrapping functions will be","     *         executed.</dd>","     *     <dt></code>Y.Do.AlterReturn(message, returnValue)</code></dt>","     *         <dd>Return <code>returnValue</code> instead of the wrapped","     *         method's original return value.  This can be further altered by","     *         other after phase wrappers.</dd>","     * </dl>","     *","     * <p>The static properties <code>Y.Do.originalRetVal</code> and","     * <code>Y.Do.currentRetVal</code> will be populated for reference.</p>","     *","     * @method after","     * @param fn {Function} the function to execute","     * @param obj the object hosting the method to displace","     * @param sFn {string} the name of the method to displace","     * @param c The execution context for fn","     * @param arg* {mixed} 0..n additional arguments to supply to the subscriber","     * @return {string} handle for the subscription","     * @static","     */","    after: function(fn, obj, sFn, c) {","        var f = fn, a;","        if (c) {","            a = [fn, c].concat(Y.Array(arguments, 4, true));","            f = Y.rbind.apply(Y, a);","        }","","        return this._inject(DO_AFTER, f, obj, sFn);","    },","","    /**","     * Execute the supplied method before or after the specified function.","     * Used by <code>before</code> and <code>after</code>.","     *","     * @method _inject","     * @param when {string} before or after","     * @param fn {Function} the function to execute","     * @param obj the object hosting the method to displace","     * @param sFn {string} the name of the method to displace","     * @param c The execution context for fn","     * @return {string} handle for the subscription","     * @private","     * @static","     */","    _inject: function(when, fn, obj, sFn) {","        // object id","        var id = Y.stamp(obj), o, sid;","","        if (!obj._yuiaop) {","            // create a map entry for the obj if it doesn't exist, to hold overridden methods","            obj._yuiaop = {};","        }","","        o = obj._yuiaop;","","        if (!o[sFn]) {","            // create a map entry for the method if it doesn't exist","            o[sFn] = new Y.Do.Method(obj, sFn);","","            // re-route the method to our wrapper","            obj[sFn] = function() {","                return o[sFn].exec.apply(o[sFn], arguments);","            };","        }","","        // subscriber id","        sid = id + Y.stamp(fn) + sFn;","","        // register the callback","        o[sFn].register(sid, fn, when);","","        return new Y.EventHandle(o[sFn], sid);","    },","","    /**","     * Detach a before or after subscription.","     *","     * @method detach","     * @param handle {string} the subscription handle","     * @static","     */","    detach: function(handle) {","        if (handle.detach) {","            handle.detach();","        }","    },","","    _unload: function(e, me) {","    }","};","","Y.Do = DO;","","//////////////////////////////////////////////////////////////////////////","","/**"," * Contains the return value from the wrapped method, accessible"," * by 'after' event listeners."," *"," * @property originalRetVal"," * @static"," * @since 3.2.0"," */","","/**"," * Contains the current state of the return value, consumable by"," * 'after' event listeners, and updated if an after subscriber"," * changes the return value generated by the wrapped function."," *"," * @property currentRetVal"," * @static"," * @since 3.2.0"," */","","//////////////////////////////////////////////////////////////////////////","","/**"," * Wrapper for a displaced method with aop enabled"," * @class Do.Method"," * @constructor"," * @param obj The object to operate on"," * @param sFn The name of the method to displace"," */","DO.Method = function(obj, sFn) {","    this.obj = obj;","    this.methodName = sFn;","    this.method = obj[sFn];","    this.before = {};","    this.after = {};","};","","/**"," * Register a aop subscriber"," * @method register"," * @param sid {string} the subscriber id"," * @param fn {Function} the function to execute"," * @param when {string} when to execute the function"," */","DO.Method.prototype.register = function (sid, fn, when) {","    if (when) {","        this.after[sid] = fn;","    } else {","        this.before[sid] = fn;","    }","};","","/**"," * Unregister a aop subscriber"," * @method delete"," * @param sid {string} the subscriber id"," * @param fn {Function} the function to execute"," * @param when {string} when to execute the function"," */","DO.Method.prototype._delete = function (sid) {","    delete this.before[sid];","    delete this.after[sid];","};","","/**"," * <p>Execute the wrapped method.  All arguments are passed into the wrapping"," * functions.  If any of the before wrappers return an instance of"," * <code>Y.Do.Halt</code> or <code>Y.Do.Prevent</code>, neither the wrapped"," * function nor any after phase subscribers will be executed.</p>"," *"," * <p>The return value will be the return value of the wrapped function or one"," * provided by a wrapper function via an instance of <code>Y.Do.Halt</code> or"," * <code>Y.Do.AlterReturn</code>."," *"," * @method exec"," * @param arg* {any} Arguments are passed to the wrapping and wrapped functions"," * @return {any} Return value of wrapped function unless overwritten (see above)"," */","DO.Method.prototype.exec = function () {","","    var args = Y.Array(arguments, 0, true),","        i, ret, newRet,","        bf = this.before,","        af = this.after,","        prevented = false;","","    // execute before","    for (i in bf) {","        if (bf.hasOwnProperty(i)) {","            ret = bf[i].apply(this.obj, args);","            if (ret) {","                switch (ret.constructor) {","                    case DO.Halt:","                        return ret.retVal;","                    case DO.AlterArgs:","                        args = ret.newArgs;","                        break;","                    case DO.Prevent:","                        prevented = true;","                        break;","                    default:","                }","            }","        }","    }","","    // execute method","    if (!prevented) {","        ret = this.method.apply(this.obj, args);","    }","","    DO.originalRetVal = ret;","    DO.currentRetVal = ret;","","    // execute after methods.","    for (i in af) {","        if (af.hasOwnProperty(i)) {","            newRet = af[i].apply(this.obj, args);","            // Stop processing if a Halt object is returned","            if (newRet && newRet.constructor == DO.Halt) {","                return newRet.retVal;","            // Check for a new return value","            } else if (newRet && newRet.constructor == DO.AlterReturn) {","                ret = newRet.newRetVal;","                // Update the static retval state","                DO.currentRetVal = ret;","            }","        }","    }","","    return ret;","};","","//////////////////////////////////////////////////////////////////////////","","/**"," * Return an AlterArgs object when you want to change the arguments that"," * were passed into the function.  Useful for Do.before subscribers.  An"," * example would be a service that scrubs out illegal characters prior to"," * executing the core business logic."," * @class Do.AlterArgs"," * @constructor"," * @param msg {String} (optional) Explanation of the altered return value"," * @param newArgs {Array} Call parameters to be used for the original method"," *                        instead of the arguments originally passed in."," */","DO.AlterArgs = function(msg, newArgs) {","    this.msg = msg;","    this.newArgs = newArgs;","};","","/**"," * Return an AlterReturn object when you want to change the result returned"," * from the core method to the caller.  Useful for Do.after subscribers."," * @class Do.AlterReturn"," * @constructor"," * @param msg {String} (optional) Explanation of the altered return value"," * @param newRetVal {any} Return value passed to code that invoked the wrapped"," *                      function."," */","DO.AlterReturn = function(msg, newRetVal) {","    this.msg = msg;","    this.newRetVal = newRetVal;","};","","/**"," * Return a Halt object when you want to terminate the execution"," * of all subsequent subscribers as well as the wrapped method"," * if it has not exectued yet.  Useful for Do.before subscribers."," * @class Do.Halt"," * @constructor"," * @param msg {String} (optional) Explanation of why the termination was done"," * @param retVal {any} Return value passed to code that invoked the wrapped"," *                      function."," */","DO.Halt = function(msg, retVal) {","    this.msg = msg;","    this.retVal = retVal;","};","","/**"," * Return a Prevent object when you want to prevent the wrapped function"," * from executing, but want the remaining listeners to execute.  Useful"," * for Do.before subscribers."," * @class Do.Prevent"," * @constructor"," * @param msg {String} (optional) Explanation of why the termination was done"," */","DO.Prevent = function(msg) {","    this.msg = msg;","};","","/**"," * Return an Error object when you want to terminate the execution"," * of all subsequent method calls."," * @class Do.Error"," * @constructor"," * @param msg {String} (optional) Explanation of the altered return value"," * @param retVal {any} Return value passed to code that invoked the wrapped"," *                      function."," * @deprecated use Y.Do.Halt or Y.Do.Prevent"," */","DO.Error = DO.Halt;","","","//////////////////////////////////////////////////////////////////////////","","// Y[\"Event\"] && Y.Event.addListener(window, \"unload\", Y.Do._unload, Y.Do);","","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event-custom"," * @submodule event-custom-base"," */","","","// var onsubscribeType = \"_event:onsub\",","var YArray = Y.Array,","","    AFTER = 'after',","    CONFIGS = [","        'broadcast',","        'monitored',","        'bubbles',","        'context',","        'contextFn',","        'currentTarget',","        'defaultFn',","        'defaultTargetOnly',","        'details',","        'emitFacade',","        'fireOnce',","        'async',","        'host',","        'preventable',","        'preventedFn',","        'queuable',","        'silent',","        'stoppedFn',","        'target',","        'type'","    ],","","    CONFIGS_HASH = YArray.hash(CONFIGS),","","    nativeSlice = Array.prototype.slice, ","","    YUI3_SIGNATURE = 9,","    YUI_LOG = 'yui:log',","","    mixConfigs = function(r, s, ov) {","        var p;","","        for (p in s) {","            if (CONFIGS_HASH[p] && (ov || !(p in r))) { ","                r[p] = s[p];","            }","        }","","        return r;","    };","","/**"," * The CustomEvent class lets you define events for your application"," * that can be subscribed to by one or more independent component."," *"," * @param {String} type The type of event, which is passed to the callback"," * when the event fires."," * @param {object} o configuration object."," * @class CustomEvent"," * @constructor"," */","Y.CustomEvent = function(type, o) {","","    this._kds = Y.CustomEvent.keepDeprecatedSubs;","","    o = o || {};","","    this.id = Y.stamp(this);","","    /**","     * The type of event, returned to subscribers when the event fires","     * @property type","     * @type string","     */","    this.type = type;","","    /**","     * The context the the event will fire from by default.  Defaults to the YUI","     * instance.","     * @property context","     * @type object","     */","    this.context = Y;","","    /**","     * Monitor when an event is attached or detached.","     *","     * @property monitored","     * @type boolean","     */","    // this.monitored = false;","","    this.logSystem = (type == YUI_LOG);","","    /**","     * If 0, this event does not broadcast.  If 1, the YUI instance is notified","     * every time this event fires.  If 2, the YUI instance and the YUI global","     * (if event is enabled on the global) are notified every time this event","     * fires.","     * @property broadcast","     * @type int","     */","    // this.broadcast = 0;","","    /**","     * By default all custom events are logged in the debug build, set silent","     * to true to disable debug outpu for this event.","     * @property silent","     * @type boolean","     */","    this.silent = this.logSystem;","","    /**","     * Specifies whether this event should be queued when the host is actively","     * processing an event.  This will effect exectution order of the callbacks","     * for the various events.","     * @property queuable","     * @type boolean","     * @default false","     */","    // this.queuable = false;","","    /**","     * The subscribers to this event","     * @property subscribers","     * @type Subscriber {}","     * @deprecated","     */","    if (this._kds) {","        this.subscribers = {};","    }","","    /**","     * The subscribers to this event","     * @property _subscribers","     * @type Subscriber []","     * @private","     */","    this._subscribers = [];","","    /**","     * 'After' subscribers","     * @property afters","     * @type Subscriber {}","     */","    if (this._kds) {","        this.afters = {};","    }","","    /**","     * 'After' subscribers","     * @property _afters","     * @type Subscriber []","     * @private","     */","    this._afters = [];","","    /**","     * This event has fired if true","     *","     * @property fired","     * @type boolean","     * @default false;","     */","    // this.fired = false;","","    /**","     * An array containing the arguments the custom event","     * was last fired with.","     * @property firedWith","     * @type Array","     */","    // this.firedWith;","","    /**","     * This event should only fire one time if true, and if","     * it has fired, any new subscribers should be notified","     * immediately.","     *","     * @property fireOnce","     * @type boolean","     * @default false;","     */","    // this.fireOnce = false;","","    /**","     * fireOnce listeners will fire syncronously unless async","     * is set to true","     * @property async","     * @type boolean","     * @default false","     */","    //this.async = false;","","    /**","     * Flag for stopPropagation that is modified during fire()","     * 1 means to stop propagation to bubble targets.  2 means","     * to also stop additional subscribers on this target.","     * @property stopped","     * @type int","     */","    // this.stopped = 0;","","    /**","     * Flag for preventDefault that is modified during fire().","     * if it is not 0, the default behavior for this event","     * @property prevented","     * @type int","     */","    // this.prevented = 0;","","    /**","     * Specifies the host for this custom event.  This is used","     * to enable event bubbling","     * @property host","     * @type EventTarget","     */","    // this.host = null;","","    /**","     * The default function to execute after event listeners","     * have fire, but only if the default action was not","     * prevented.","     * @property defaultFn","     * @type Function","     */","    // this.defaultFn = null;","","    /**","     * The function to execute if a subscriber calls","     * stopPropagation or stopImmediatePropagation","     * @property stoppedFn","     * @type Function","     */","    // this.stoppedFn = null;","","    /**","     * The function to execute if a subscriber calls","     * preventDefault","     * @property preventedFn","     * @type Function","     */","    // this.preventedFn = null;","","    /**","     * Specifies whether or not this event's default function","     * can be cancelled by a subscriber by executing preventDefault()","     * on the event facade","     * @property preventable","     * @type boolean","     * @default true","     */","    this.preventable = true;","","    /**","     * Specifies whether or not a subscriber can stop the event propagation","     * via stopPropagation(), stopImmediatePropagation(), or halt()","     *","     * Events can only bubble if emitFacade is true.","     *","     * @property bubbles","     * @type boolean","     * @default true","     */","    this.bubbles = true;","","    /**","     * Supports multiple options for listener signatures in order to","     * port YUI 2 apps.","     * @property signature","     * @type int","     * @default 9","     */","    this.signature = YUI3_SIGNATURE;","","    // this.subCount = 0;","    // this.afterCount = 0;","","    // this.hasSubscribers = false;","    // this.hasAfters = false;","","    /**","     * If set to true, the custom event will deliver an EventFacade object","     * that is similar to a DOM event object.","     * @property emitFacade","     * @type boolean","     * @default false","     */","    // this.emitFacade = false;","","    this.applyConfig(o, true);","","    // this.log(\"Creating \" + this.type);","","};","","/**"," * Static flag to enable population of the <a href=\"#property_subscribers\">`subscribers`</a>"," * and  <a href=\"#property_subscribers\">`afters`</a> properties held on a `CustomEvent` instance."," * "," * These properties were changed to private properties (`_subscribers` and `_afters`), and "," * converted from objects to arrays for performance reasons. "," *"," * Setting this property to true will populate the deprecated `subscribers` and `afters` "," * properties for people who may be using them (which is expected to be rare). There will"," * be a performance hit, compared to the new array based implementation."," *"," * If you are using these deprecated properties for a use case which the public API"," * does not support, please file an enhancement request, and we can provide an alternate "," * public implementation which doesn't have the performance cost required to maintiain the"," * properties as objects."," *"," * @property keepDeprecatedSubs"," * @static"," * @for CustomEvent"," * @type boolean"," * @default false"," * @deprecated"," */","Y.CustomEvent.keepDeprecatedSubs = false;","","Y.CustomEvent.mixConfigs = mixConfigs;","","Y.CustomEvent.prototype = {","","    constructor: Y.CustomEvent,","","    /**","     * Returns the number of subscribers for this event as the sum of the on()","     * subscribers and after() subscribers.","     *","     * @method hasSubs","     * @return Number","     */","    hasSubs: function(when) {","        var s = this._subscribers.length, a = this._afters.length, sib = this.sibling;","","        if (sib) {","            s += sib._subscribers.length;","            a += sib._afters.length;","        }","","        if (when) {","            return (when == 'after') ? a : s;","        }","","        return (s + a);","    },","","    /**","     * Monitor the event state for the subscribed event.  The first parameter","     * is what should be monitored, the rest are the normal parameters when","     * subscribing to an event.","     * @method monitor","     * @param what {string} what to monitor ('detach', 'attach', 'publish').","     * @return {EventHandle} return value from the monitor event subscription.","     */","    monitor: function(what) {","        this.monitored = true;","        var type = this.id + '|' + this.type + '_' + what,","            args = nativeSlice.call(arguments, 0);","        args[0] = type;","        return this.host.on.apply(this.host, args);","    },","","    /**","     * Get all of the subscribers to this event and any sibling event","     * @method getSubs","     * @return {Array} first item is the on subscribers, second the after.","     */","    getSubs: function() {","        var s = this._subscribers, a = this._afters, sib = this.sibling;","","        s = (sib) ? s.concat(sib._subscribers) : s.concat();","        a = (sib) ? a.concat(sib._afters) : a.concat();","","        return [s, a];","    },","","    /**","     * Apply configuration properties.  Only applies the CONFIG whitelist","     * @method applyConfig","     * @param o hash of properties to apply.","     * @param force {boolean} if true, properties that exist on the event","     * will be overwritten.","     */","    applyConfig: function(o, force) {","        mixConfigs(this, o, force);","    },","","    /**","     * Create the Subscription for subscribing function, context, and bound","     * arguments.  If this is a fireOnce event, the subscriber is immediately ","     * notified.","     *","     * @method _on","     * @param fn {Function} Subscription callback","     * @param [context] {Object} Override `this` in the callback","     * @param [args] {Array} bound arguments that will be passed to the callback after the arguments generated by fire()","     * @param [when] {String} \"after\" to slot into after subscribers","     * @return {EventHandle}","     * @protected","     */","    _on: function(fn, context, args, when) {","","        if (!fn) {","            this.log('Invalid callback for CE: ' + this.type);","        }","","        var s = new Y.Subscriber(fn, context, args, when);","","        if (this.fireOnce && this.fired) {","            if (this.async) {","                setTimeout(Y.bind(this._notify, this, s, this.firedWith), 0);","            } else {","                this._notify(s, this.firedWith);","            }","        }","","        if (when == AFTER) {","            this._afters.push(s);","        } else {","            this._subscribers.push(s);","        }","","        if (this._kds) {","            if (when == AFTER) {","                this.afters[s.id] = s;","            } else {","                this.subscribers[s.id] = s;","            }","        }","","        return new Y.EventHandle(this, s);","    },","","    /**","     * Listen for this event","     * @method subscribe","     * @param {Function} fn The function to execute.","     * @return {EventHandle} Unsubscribe handle.","     * @deprecated use on.","     */","    subscribe: function(fn, context) {","        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;","        return this._on(fn, context, a, true);","    },","","    /**","     * Listen for this event","     * @method on","     * @param {Function} fn The function to execute.","     * @param {object} context optional execution context.","     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber","     * when the event fires.","     * @return {EventHandle} An object with a detach method to detch the handler(s).","     */","    on: function(fn, context) {","        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;","        if (this.host) {","            this.host._monitor('attach', this.type, {","                args: arguments","            });","        }","        return this._on(fn, context, a, true);","    },","","    /**","     * Listen for this event after the normal subscribers have been notified and","     * the default behavior has been applied.  If a normal subscriber prevents the","     * default behavior, it also prevents after listeners from firing.","     * @method after","     * @param {Function} fn The function to execute.","     * @param {object} context optional execution context.","     * @param {mixed} arg* 0..n additional arguments to supply to the subscriber","     * when the event fires.","     * @return {EventHandle} handle Unsubscribe handle.","     */","    after: function(fn, context) {","        var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;","        return this._on(fn, context, a, AFTER);","    },","","    /**","     * Detach listeners.","     * @method detach","     * @param {Function} fn  The subscribed function to remove, if not supplied","     *                       all will be removed.","     * @param {Object}   context The context object passed to subscribe.","     * @return {int} returns the number of subscribers unsubscribed.","     */","    detach: function(fn, context) {","        // unsubscribe handle","        if (fn && fn.detach) {","            return fn.detach();","        }","        ","        var i, s,","            found = 0,","            subs = this._subscribers,","            afters = this._afters;","","        for (i = subs.length; i >= 0; i--) {","            s = subs[i];","            if (s && (!fn || fn === s.fn)) {","                this._delete(s, subs, i);","                found++;","            }","        }","","        for (i = afters.length; i >= 0; i--) {","            s = afters[i];","            if (s && (!fn || fn === s.fn)) {","                this._delete(s, afters, i);","                found++;","            }","        }","","        return found;","    },","","    /**","     * Detach listeners.","     * @method unsubscribe","     * @param {Function} fn  The subscribed function to remove, if not supplied","     *                       all will be removed.","     * @param {Object}   context The context object passed to subscribe.","     * @return {int|undefined} returns the number of subscribers unsubscribed.","     * @deprecated use detach.","     */","    unsubscribe: function() {","        return this.detach.apply(this, arguments);","    },","","    /**","     * Notify a single subscriber","     * @method _notify","     * @param {Subscriber} s the subscriber.","     * @param {Array} args the arguments array to apply to the listener.","     * @protected","     */","    _notify: function(s, args, ef) {","","        this.log(this.type + '->' + 'sub: ' + s.id);","","        var ret;","","        ret = s.notify(args, this);","","        if (false === ret || this.stopped > 1) {","            this.log(this.type + ' cancelled by subscriber');","            return false;","        }","","        return true;","    },","","    /**","     * Logger abstraction to centralize the application of the silent flag","     * @method log","     * @param {string} msg message to log.","     * @param {string} cat log category.","     */","    log: function(msg, cat) {","        if (!this.silent) {","        }","    },","","    /**","     * Notifies the subscribers.  The callback functions will be executed","     * from the context specified when the event was created, and with the","     * following parameters:","     *   <ul>","     *   <li>The type of event</li>","     *   <li>All of the arguments fire() was executed with as an array</li>","     *   <li>The custom object (if any) that was passed into the subscribe()","     *       method</li>","     *   </ul>","     * @method fire","     * @param {Object*} arguments an arbitrary set of parameters to pass to","     *                            the handler.","     * @return {boolean} false if one of the subscribers returned false,","     *                   true otherwise.","     *","     */","    fire: function() {","        if (this.fireOnce && this.fired) {","            this.log('fireOnce event: ' + this.type + ' already fired');","            return true;","        } else {","","            var args = nativeSlice.call(arguments, 0);","","            // this doesn't happen if the event isn't published","            // this.host._monitor('fire', this.type, args);","","            this.fired = true;","","            if (this.fireOnce) {","                this.firedWith = args;","            }","","            if (this.emitFacade) {","                return this.fireComplex(args);","            } else {","                return this.fireSimple(args);","            }","        }","    },","","    /**","     * Set up for notifying subscribers of non-emitFacade events.","     *","     * @method fireSimple","     * @param args {Array} Arguments passed to fire()","     * @return Boolean false if a subscriber returned false","     * @protected","     */","    fireSimple: function(args) {","        this.stopped = 0;","        this.prevented = 0;","        if (this.hasSubs()) {","            var subs = this.getSubs();","            this._procSubs(subs[0], args);","            this._procSubs(subs[1], args);","        }","        this._broadcast(args);","        return this.stopped ? false : true;","    },","","    // Requires the event-custom-complex module for full funcitonality.","    fireComplex: function(args) {","        args[0] = args[0] || {};","        return this.fireSimple(args);","    },","","    /**","     * Notifies a list of subscribers.","     *","     * @method _procSubs","     * @param subs {Array} List of subscribers","     * @param args {Array} Arguments passed to fire()","     * @param ef {}","     * @return Boolean false if a subscriber returns false or stops the event","     *              propagation via e.stopPropagation(),","     *              e.stopImmediatePropagation(), or e.halt()","     * @private","     */","    _procSubs: function(subs, args, ef) {","        var s, i, l;","","        for (i = 0, l = subs.length; i < l; i++) {","            s = subs[i];","            if (s && s.fn) {","                if (false === this._notify(s, args, ef)) {","                    this.stopped = 2;","                }","                if (this.stopped == 2) {","                    return false;","                }","            }","        }","","        return true;","    },","","    /**","     * Notifies the YUI instance if the event is configured with broadcast = 1,","     * and both the YUI instance and Y.Global if configured with broadcast = 2.","     *","     * @method _broadcast","     * @param args {Array} Arguments sent to fire()","     * @private","     */","    _broadcast: function(args) {","        if (!this.stopped && this.broadcast) {","","            var a = args.concat();","            a.unshift(this.type);","","            if (this.host !== Y) {","                Y.fire.apply(Y, a);","            }","","            if (this.broadcast == 2) {","                Y.Global.fire.apply(Y.Global, a);","            }","        }","    },","","    /**","     * Removes all listeners","     * @method unsubscribeAll","     * @return {int} The number of listeners unsubscribed.","     * @deprecated use detachAll.","     */","    unsubscribeAll: function() {","        return this.detachAll.apply(this, arguments);","    },","","    /**","     * Removes all listeners","     * @method detachAll","     * @return {int} The number of listeners unsubscribed.","     */","    detachAll: function() {","        return this.detach();","    },","","    /**","     * Deletes the subscriber from the internal store of on() and after()","     * subscribers.","     *","     * @method _delete","     * @param s subscriber object.","     * @param subs (optional) on or after subscriber array","     * @param index (optional) The index found.","     * @private","     */","    _delete: function(s, subs, i) {","        var when = s._when;","","        if (!subs) {","            subs = (when === AFTER) ? this._afters : this._subscribers; ","            i = YArray.indexOf(subs, s, 0);","        }","","        if (s && subs[i] === s) {","            subs.splice(i, 1);","        }","","        if (this._kds) {","            if (when === AFTER) {","                delete this.afters[s.id];","            } else {","                delete this.subscribers[s.id];","            }","        }","","        if (this.host) {","            this.host._monitor('detach', this.type, {","                ce: this,","                sub: s","            });","        }","","        if (s) {","            s.deleted = true;","        }","    }","};","/**"," * Stores the subscriber information to be used when the event fires."," * @param {Function} fn       The wrapped function to execute."," * @param {Object}   context  The value of the keyword 'this' in the listener."," * @param {Array} args*       0..n additional arguments to supply the listener."," *"," * @class Subscriber"," * @constructor"," */","Y.Subscriber = function(fn, context, args, when) {","","    /**","     * The callback that will be execute when the event fires","     * This is wrapped by Y.rbind if obj was supplied.","     * @property fn","     * @type Function","     */","    this.fn = fn;","","    /**","     * Optional 'this' keyword for the listener","     * @property context","     * @type Object","     */","    this.context = context;","","    /**","     * Unique subscriber id","     * @property id","     * @type String","     */","    this.id = Y.stamp(this);","","    /**","     * Additional arguments to propagate to the subscriber","     * @property args","     * @type Array","     */","    this.args = args;","","    this._when = when;","","    /**","     * Custom events for a given fire transaction.","     * @property events","     * @type {EventTarget}","     */","    // this.events = null;","","    /**","     * This listener only reacts to the event once","     * @property once","     */","    // this.once = false;","","};","","Y.Subscriber.prototype = {","    constructor: Y.Subscriber,","","    _notify: function(c, args, ce) {","        if (this.deleted && !this.postponed) {","            if (this.postponed) {","                delete this.fn;","                delete this.context;","            } else {","                delete this.postponed;","                return null;","            }","        }","        var a = this.args, ret;","        switch (ce.signature) {","            case 0:","                ret = this.fn.call(c, ce.type, args, c);","                break;","            case 1:","                ret = this.fn.call(c, args[0] || null, c);","                break;","            default:","                if (a || args) {","                    args = args || [];","                    a = (a) ? args.concat(a) : args;","                    ret = this.fn.apply(c, a);","                } else {","                    ret = this.fn.call(c);","                }","        }","","        if (this.once) {","            ce._delete(this);","        }","","        return ret;","    },","","    /**","     * Executes the subscriber.","     * @method notify","     * @param args {Array} Arguments array for the subscriber.","     * @param ce {CustomEvent} The custom event that sent the notification.","     */","    notify: function(args, ce) {","        var c = this.context,","            ret = true;","","        if (!c) {","            c = (ce.contextFn) ? ce.contextFn() : ce.context;","        }","","        // only catch errors if we will not re-throw them.","        if (Y.config && Y.config.throwFail) {","            ret = this._notify(c, args, ce);","        } else {","            try {","                ret = this._notify(c, args, ce);","            } catch (e) {","                Y.error(this + ' failed: ' + e.message, e);","            }","        }","","        return ret;","    },","","    /**","     * Returns true if the fn and obj match this objects properties.","     * Used by the unsubscribe method to match the right subscriber.","     *","     * @method contains","     * @param {Function} fn the function to execute.","     * @param {Object} context optional 'this' keyword for the listener.","     * @return {boolean} true if the supplied arguments match this","     *                   subscriber's signature.","     */","    contains: function(fn, context) {","        if (context) {","            return ((this.fn == fn) && this.context == context);","        } else {","            return (this.fn == fn);","        }","    },","    ","    valueOf : function() {","        return this.id;","    }","","};","/**"," * Return value from all subscribe operations"," * @class EventHandle"," * @constructor"," * @param {CustomEvent} evt the custom event."," * @param {Subscriber} sub the subscriber."," */","Y.EventHandle = function(evt, sub) {","","    /**","     * The custom event","     *","     * @property evt","     * @type CustomEvent","     */","    this.evt = evt;","","    /**","     * The subscriber object","     *","     * @property sub","     * @type Subscriber","     */","    this.sub = sub;","};","","Y.EventHandle.prototype = {","    batch: function(f, c) {","        f.call(c || this, this);","        if (Y.Lang.isArray(this.evt)) {","            Y.Array.each(this.evt, function(h) {","                h.batch.call(c || h, f);","            });","        }","    },","","    /**","     * Detaches this subscriber","     * @method detach","     * @return {int} the number of detached listeners","     */","    detach: function() {","        var evt = this.evt, detached = 0, i;","        if (evt) {","            if (Y.Lang.isArray(evt)) {","                for (i = 0; i < evt.length; i++) {","                    detached += evt[i].detach();","                }","            } else {","                evt._delete(this.sub);","                detached = 1;","            }","","        }","","        return detached;","    },","","    /**","     * Monitor the event state for the subscribed event.  The first parameter","     * is what should be monitored, the rest are the normal parameters when","     * subscribing to an event.","     * @method monitor","     * @param what {string} what to monitor ('attach', 'detach', 'publish').","     * @return {EventHandle} return value from the monitor event subscription.","     */","    monitor: function(what) {","        return this.evt.monitor.apply(this.evt, arguments);","    }","};","","/**"," * Custom event engine, DOM event listener abstraction layer, synthetic DOM"," * events."," * @module event-custom"," * @submodule event-custom-base"," */","","/**"," * EventTarget provides the implementation for any object to"," * publish, subscribe and fire to custom events, and also"," * alows other EventTargets to target the object with events"," * sourced from the other object."," * EventTarget is designed to be used with Y.augment to wrap"," * EventCustom in an interface that allows events to be listened to"," * and fired by name.  This makes it possible for implementing code to"," * subscribe to an event that either has not been created yet, or will"," * not be created at all."," * @class EventTarget"," * @param opts a configuration object"," * @config emitFacade {boolean} if true, all events will emit event"," * facade payloads by default (default false)"," * @config prefix {String} the prefix to apply to non-prefixed event names"," */","","var L = Y.Lang,","    PREFIX_DELIMITER = ':',","    CATEGORY_DELIMITER = '|',","    AFTER_PREFIX = '~AFTER~',","    WILD_TYPE_RE = /(.*?)(:)(.*?)/,","","    _wildType = Y.cached(function(type) {","        return type.replace(WILD_TYPE_RE, \"*$2$3\");","    }),","","    /**","     * If the instance has a prefix attribute and the","     * event type is not prefixed, the instance prefix is","     * applied to the supplied type.","     * @method _getType","     * @private","     */","    _getType = Y.cached(function(type, pre) {","","        if (!pre || !L.isString(type) || type.indexOf(PREFIX_DELIMITER) > -1) {","            return type;","        }","","        return pre + PREFIX_DELIMITER + type;","    }),","","    /**","     * Returns an array with the detach key (if provided),","     * and the prefixed event name from _getType","     * Y.on('detachcategory| menu:click', fn)","     * @method _parseType","     * @private","     */","    _parseType = Y.cached(function(type, pre) {","","        var t = type, detachcategory, after, i;","","        if (!L.isString(t)) {","            return t;","        }","","        i = t.indexOf(AFTER_PREFIX);","","        if (i > -1) {","            after = true;","            t = t.substr(AFTER_PREFIX.length);","        }","","        i = t.indexOf(CATEGORY_DELIMITER);","","        if (i > -1) {","            detachcategory = t.substr(0, (i));","            t = t.substr(i+1);","            if (t == '*') {","                t = null;","            }","        }","","        // detach category, full type with instance prefix, is this an after listener, short type","        return [detachcategory, (pre) ? _getType(t, pre) : t, after, t];","    }),","","    ET = function(opts) {","","","        var o = (L.isObject(opts)) ? opts : {};","","        this._yuievt = this._yuievt || {","","            id: Y.guid(),","","            events: {},","","            targets: {},","","            config: o,","","            chain: ('chain' in o) ? o.chain : Y.config.chain,","","            bubbling: false,","","            defaults: {","                context: o.context || this,","                host: this,","                emitFacade: o.emitFacade,","                fireOnce: o.fireOnce,","                queuable: o.queuable,","                monitored: o.monitored,","                broadcast: o.broadcast,","                defaultTargetOnly: o.defaultTargetOnly,","                bubbles: ('bubbles' in o) ? o.bubbles : true","            }","        };","","    };","","","ET.prototype = {","    constructor: ET,","","    /**","     * Listen to a custom event hosted by this object one time.","     * This is the equivalent to <code>on</code> except the","     * listener is immediatelly detached when it is executed.","     * @method once","     * @param {String} type The name of the event","     * @param {Function} fn The callback to execute in response to the event","     * @param {Object} [context] Override `this` object in callback","     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","     * @return {EventHandle} A subscription handle capable of detaching the","     *                       subscription","     */","    once: function() {","        var handle = this.on.apply(this, arguments);","        handle.batch(function(hand) {","            if (hand.sub) {","                hand.sub.once = true;","            }","        });","        return handle;","    },","","    /**","     * Listen to a custom event hosted by this object one time.","     * This is the equivalent to <code>after</code> except the","     * listener is immediatelly detached when it is executed.","     * @method onceAfter","     * @param {String} type The name of the event","     * @param {Function} fn The callback to execute in response to the event","     * @param {Object} [context] Override `this` object in callback","     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","     * @return {EventHandle} A subscription handle capable of detaching that","     *                       subscription","     */","    onceAfter: function() {","        var handle = this.after.apply(this, arguments);","        handle.batch(function(hand) {","            if (hand.sub) {","                hand.sub.once = true;","            }","        });","        return handle;","    },","","    /**","     * Takes the type parameter passed to 'on' and parses out the","     * various pieces that could be included in the type.  If the","     * event type is passed without a prefix, it will be expanded","     * to include the prefix one is supplied or the event target","     * is configured with a default prefix.","     * @method parseType","     * @param {String} type the type","     * @param {String} [pre=this._yuievt.config.prefix] the prefix","     * @since 3.3.0","     * @return {Array} an array containing:","     *  * the detach category, if supplied,","     *  * the prefixed event type,","     *  * whether or not this is an after listener,","     *  * the supplied event type","     */","    parseType: function(type, pre) {","        return _parseType(type, pre || this._yuievt.config.prefix);","    },","","    /**","     * Subscribe a callback function to a custom event fired by this object or","     * from an object that bubbles its events to this object.","     *","     * Callback functions for events published with `emitFacade = true` will","     * receive an `EventFacade` as the first argument (typically named \"e\").","     * These callbacks can then call `e.preventDefault()` to disable the","     * behavior published to that event's `defaultFn`.  See the `EventFacade`","     * API for all available properties and methods. Subscribers to","     * non-`emitFacade` events will receive the arguments passed to `fire()`","     * after the event name.","     *","     * To subscribe to multiple events at once, pass an object as the first","     * argument, where the key:value pairs correspond to the eventName:callback,","     * or pass an array of event names as the first argument to subscribe to","     * all listed events with the same callback.","     *","     * Returning `false` from a callback is supported as an alternative to","     * calling `e.preventDefault(); e.stopPropagation();`.  However, it is","     * recommended to use the event methods whenever possible.","     *","     * @method on","     * @param {String} type The name of the event","     * @param {Function} fn The callback to execute in response to the event","     * @param {Object} [context] Override `this` object in callback","     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","     * @return {EventHandle} A subscription handle capable of detaching that","     *                       subscription","     */","    on: function(type, fn, context) {","","        var parts = _parseType(type, this._yuievt.config.prefix), f, c, args, ret, ce,","            detachcategory, handle, store = Y.Env.evt.handles, after, adapt, shorttype,","            Node = Y.Node, n, domevent, isArr;","","        // full name, args, detachcategory, after","        this._monitor('attach', parts[1], {","            args: arguments,","            category: parts[0],","            after: parts[2]","        });","","        if (L.isObject(type)) {","","            if (L.isFunction(type)) {","                return Y.Do.before.apply(Y.Do, arguments);","            }","","            f = fn;","            c = context;","            args = nativeSlice.call(arguments, 0);","            ret = [];","","            if (L.isArray(type)) {","                isArr = true;","            }","","            after = type._after;","            delete type._after;","","            Y.each(type, function(v, k) {","","                if (L.isObject(v)) {","                    f = v.fn || ((L.isFunction(v)) ? v : f);","                    c = v.context || c;","                }","","                var nv = (after) ? AFTER_PREFIX : '';","","                args[0] = nv + ((isArr) ? v : k);","                args[1] = f;","                args[2] = c;","","                ret.push(this.on.apply(this, args));","","            }, this);","","            return (this._yuievt.chain) ? this : new Y.EventHandle(ret);","","        }","","        detachcategory = parts[0];","        after = parts[2];","        shorttype = parts[3];","","        // extra redirection so we catch adaptor events too.  take a look at this.","        if (Node && Y.instanceOf(this, Node) && (shorttype in Node.DOM_EVENTS)) {","            args = nativeSlice.call(arguments, 0);","            args.splice(2, 0, Node.getDOMNode(this));","            return Y.on.apply(Y, args);","        }","","        type = parts[1];","","        if (Y.instanceOf(this, YUI)) {","","            adapt = Y.Env.evt.plugins[type];","            args  = nativeSlice.call(arguments, 0);","            args[0] = shorttype;","","            if (Node) {","                n = args[2];","","                if (Y.instanceOf(n, Y.NodeList)) {","                    n = Y.NodeList.getDOMNodes(n);","                } else if (Y.instanceOf(n, Node)) {","                    n = Node.getDOMNode(n);","                }","","                domevent = (shorttype in Node.DOM_EVENTS);","","                // Captures both DOM events and event plugins.","                if (domevent) {","                    args[2] = n;","                }","            }","","            // check for the existance of an event adaptor","            if (adapt) {","                handle = adapt.on.apply(Y, args);","            } else if ((!type) || domevent) {","                handle = Y.Event._attach(args);","            }","","        }","","        if (!handle) {","            ce = this._yuievt.events[type] || this.publish(type);","            handle = ce._on(fn, context, (arguments.length > 3) ? nativeSlice.call(arguments, 3) : null, (after) ? 'after' : true);","        }","","        if (detachcategory) {","            store[detachcategory] = store[detachcategory] || {};","            store[detachcategory][type] = store[detachcategory][type] || [];","            store[detachcategory][type].push(handle);","        }","","        return (this._yuievt.chain) ? this : handle;","","    },","","    /**","     * subscribe to an event","     * @method subscribe","     * @deprecated use on","     */","    subscribe: function() {","        return this.on.apply(this, arguments);","    },","","    /**","     * Detach one or more listeners the from the specified event","     * @method detach","     * @param type {string|Object}   Either the handle to the subscriber or the","     *                        type of event.  If the type","     *                        is not specified, it will attempt to remove","     *                        the listener from all hosted events.","     * @param fn   {Function} The subscribed function to unsubscribe, if not","     *                          supplied, all subscribers will be removed.","     * @param context  {Object}   The custom object passed to subscribe.  This is","     *                        optional, but if supplied will be used to","     *                        disambiguate multiple listeners that are the same","     *                        (e.g., you subscribe many object using a function","     *                        that lives on the prototype)","     * @return {EventTarget} the host","     */","    detach: function(type, fn, context) {","        var evts = this._yuievt.events, i,","            Node = Y.Node, isNode = Node && (Y.instanceOf(this, Node));","","        // detachAll disabled on the Y instance.","        if (!type && (this !== Y)) {","            for (i in evts) {","                if (evts.hasOwnProperty(i)) {","                    evts[i].detach(fn, context);","                }","            }","            if (isNode) {","                Y.Event.purgeElement(Node.getDOMNode(this));","            }","","            return this;","        }","","        var parts = _parseType(type, this._yuievt.config.prefix),","        detachcategory = L.isArray(parts) ? parts[0] : null,","        shorttype = (parts) ? parts[3] : null,","        adapt, store = Y.Env.evt.handles, detachhost, cat, args,","        ce,","","        keyDetacher = function(lcat, ltype, host) {","            var handles = lcat[ltype], ce, i;","            if (handles) {","                for (i = handles.length - 1; i >= 0; --i) {","                    ce = handles[i].evt;","                    if (ce.host === host || ce.el === host) {","                        handles[i].detach();","                    }","                }","            }","        };","","        if (detachcategory) {","","            cat = store[detachcategory];","            type = parts[1];","            detachhost = (isNode) ? Y.Node.getDOMNode(this) : this;","","            if (cat) {","                if (type) {","                    keyDetacher(cat, type, detachhost);","                } else {","                    for (i in cat) {","                        if (cat.hasOwnProperty(i)) {","                            keyDetacher(cat, i, detachhost);","                        }","                    }","                }","","                return this;","            }","","        // If this is an event handle, use it to detach","        } else if (L.isObject(type) && type.detach) {","            type.detach();","            return this;","        // extra redirection so we catch adaptor events too.  take a look at this.","        } else if (isNode && ((!shorttype) || (shorttype in Node.DOM_EVENTS))) {","            args = nativeSlice.call(arguments, 0);","            args[2] = Node.getDOMNode(this);","            Y.detach.apply(Y, args);","            return this;","        }","","        adapt = Y.Env.evt.plugins[shorttype];","","        // The YUI instance handles DOM events and adaptors","        if (Y.instanceOf(this, YUI)) {","            args = nativeSlice.call(arguments, 0);","            // use the adaptor specific detach code if","            if (adapt && adapt.detach) {","                adapt.detach.apply(Y, args);","                return this;","            // DOM event fork","            } else if (!type || (!adapt && Node && (type in Node.DOM_EVENTS))) {","                args[0] = type;","                Y.Event.detach.apply(Y.Event, args);","                return this;","            }","        }","","        // ce = evts[type];","        ce = evts[parts[1]];","        if (ce) {","            ce.detach(fn, context);","        }","","        return this;","    },","","    /**","     * detach a listener","     * @method unsubscribe","     * @deprecated use detach","     */","    unsubscribe: function() {","        return this.detach.apply(this, arguments);","    },","","    /**","     * Removes all listeners from the specified event.  If the event type","     * is not specified, all listeners from all hosted custom events will","     * be removed.","     * @method detachAll","     * @param type {String}   The type, or name of the event","     */","    detachAll: function(type) {","        return this.detach(type);","    },","","    /**","     * Removes all listeners from the specified event.  If the event type","     * is not specified, all listeners from all hosted custom events will","     * be removed.","     * @method unsubscribeAll","     * @param type {String}   The type, or name of the event","     * @deprecated use detachAll","     */","    unsubscribeAll: function() {","        return this.detachAll.apply(this, arguments);","    },","","    /**","     * Creates a new custom event of the specified type.  If a custom event","     * by that name already exists, it will not be re-created.  In either","     * case the custom event is returned.","     *","     * @method publish","     *","     * @param type {String} the type, or name of the event","     * @param opts {object} optional config params.  Valid properties are:","     *","     *  <ul>","     *    <li>","     *   'broadcast': whether or not the YUI instance and YUI global are notified when the event is fired (false)","     *    </li>","     *    <li>","     *   'bubbles': whether or not this event bubbles (true)","     *              Events can only bubble if emitFacade is true.","     *    </li>","     *    <li>","     *   'context': the default execution context for the listeners (this)","     *    </li>","     *    <li>","     *   'defaultFn': the default function to execute when this event fires if preventDefault was not called","     *    </li>","     *    <li>","     *   'emitFacade': whether or not this event emits a facade (false)","     *    </li>","     *    <li>","     *   'prefix': the prefix for this targets events, e.g., 'menu' in 'menu:click'","     *    </li>","     *    <li>","     *   'fireOnce': if an event is configured to fire once, new subscribers after","     *   the fire will be notified immediately.","     *    </li>","     *    <li>","     *   'async': fireOnce event listeners will fire synchronously if the event has already","     *    fired unless async is true.","     *    </li>","     *    <li>","     *   'preventable': whether or not preventDefault() has an effect (true)","     *    </li>","     *    <li>","     *   'preventedFn': a function that is executed when preventDefault is called","     *    </li>","     *    <li>","     *   'queuable': whether or not this event can be queued during bubbling (false)","     *    </li>","     *    <li>","     *   'silent': if silent is true, debug messages are not provided for this event.","     *    </li>","     *    <li>","     *   'stoppedFn': a function that is executed when stopPropagation is called","     *    </li>","     *","     *    <li>","     *   'monitored': specifies whether or not this event should send notifications about","     *   when the event has been attached, detached, or published.","     *    </li>","     *    <li>","     *   'type': the event type (valid option if not provided as the first parameter to publish)","     *    </li>","     *  </ul>","     *","     *  @return {CustomEvent} the custom event","     *","     */","    publish: function(type, opts) {","        var events, ce, ret, defaults,","            edata    = this._yuievt,","            pre      = edata.config.prefix;","","        if (L.isObject(type)) {","            ret = {};","            Y.each(type, function(v, k) {","                ret[k] = this.publish(k, v || opts);","            }, this);","","            return ret;","        }","","        type = (pre) ? _getType(type, pre) : type;","","        this._monitor('publish', type, {","            args: arguments","        });","","        events = edata.events;","        ce = events[type];","","        if (ce) {","            // ce.log(\"publish applying new config to published event: '\"+type+\"' exists\", 'info', 'event');","            if (opts) {","                ce.applyConfig(opts, true);","            }","        } else {","            // TODO: Lazy publish goes here.","            defaults = edata.defaults;","","            // apply defaults","            ce = new Y.CustomEvent(type, defaults);","            if (opts) {","                ce.applyConfig(opts, true);","            }","","            events[type] = ce;","        }","","        // make sure we turn the broadcast flag off if this","        // event was published as a result of bubbling","        // if (opts instanceof Y.CustomEvent) {","          //   events[type].broadcast = false;","        // }","","        return events[type];","    },","","    /**","     * This is the entry point for the event monitoring system.","     * You can monitor 'attach', 'detach', 'fire', and 'publish'.","     * When configured, these events generate an event.  click ->","     * click_attach, click_detach, click_publish -- these can","     * be subscribed to like other events to monitor the event","     * system.  Inividual published events can have monitoring","     * turned on or off (publish can't be turned off before it","     * it published) by setting the events 'monitor' config.","     *","     * @method _monitor","     * @param what {String} 'attach', 'detach', 'fire', or 'publish'","     * @param type {String} Name of the event being monitored","     * @param o {Object} Information about the event interaction, such as","     *                  fire() args, subscription category, publish config","     * @private","     */","    _monitor: function(what, type, o) {","        var monitorevt, ce = this.getEvent(type);","        if ((this._yuievt.config.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {","            monitorevt = type + '_' + what;","            o.monitored = what;","            this.fire.call(this, monitorevt, o);","        }","    },","","   /**","     * Fire a custom event by name.  The callback functions will be executed","     * from the context specified when the event was created, and with the","     * following parameters.","     *","     * If the custom event object hasn't been created, then the event hasn't","     * been published and it has no subscribers.  For performance sake, we","     * immediate exit in this case.  This means the event won't bubble, so","     * if the intention is that a bubble target be notified, the event must","     * be published on this object first.","     *","     * The first argument is the event type, and any additional arguments are","     * passed to the listeners as parameters.  If the first of these is an","     * object literal, and the event is configured to emit an event facade,","     * that object is mixed into the event facade and the facade is provided","     * in place of the original object.","     *","     * @method fire","     * @param type {String|Object} The type of the event, or an object that contains","     * a 'type' property.","     * @param arguments {Object*} an arbitrary set of parameters to pass to","     * the handler.  If the first of these is an object literal and the event is","     * configured to emit an event facade, the event facade will replace that","     * parameter after the properties the object literal contains are copied to","     * the event facade.","     * @return {EventTarget} the event host","     *","     */","    fire: function(type) {","","        var typeIncluded = L.isString(type),","            t = (typeIncluded) ? type : (type && type.type),","            ce, ret, pre = this._yuievt.config.prefix, ce2,","            args = (typeIncluded) ? nativeSlice.call(arguments, 1) : arguments;","","        t = (pre) ? _getType(t, pre) : t;","","        this._monitor('fire', t, {","            args: args","        });","","        ce = this.getEvent(t, true);","        ce2 = this.getSibling(t, ce);","","        if (ce2 && !ce) {","            ce = this.publish(t);","        }","","        // this event has not been published or subscribed to","        if (!ce) {","            if (this._yuievt.hasTargets) {","                return this.bubble({ type: t }, args, this);","            }","","            // otherwise there is nothing to be done","            ret = true;","        } else {","            ce.sibling = ce2;","            ret = ce.fire.apply(ce, args);","        }","","        return (this._yuievt.chain) ? this : ret;","    },","","    getSibling: function(type, ce) {","        var ce2;","        // delegate to *:type events if there are subscribers","        if (type.indexOf(PREFIX_DELIMITER) > -1) {","            type = _wildType(type);","            // console.log(type);","            ce2 = this.getEvent(type, true);","            if (ce2) {","                // console.log(\"GOT ONE: \" + type);","                ce2.applyConfig(ce);","                ce2.bubbles = false;","                ce2.broadcast = 0;","                // ret = ce2.fire.apply(ce2, a);","            }","        }","","        return ce2;","    },","","    /**","     * Returns the custom event of the provided type has been created, a","     * falsy value otherwise","     * @method getEvent","     * @param type {String} the type, or name of the event","     * @param prefixed {String} if true, the type is prefixed already","     * @return {CustomEvent} the custom event or null","     */","    getEvent: function(type, prefixed) {","        var pre, e;","        if (!prefixed) {","            pre = this._yuievt.config.prefix;","            type = (pre) ? _getType(type, pre) : type;","        }","        e = this._yuievt.events;","        return e[type] || null;","    },","","    /**","     * Subscribe to a custom event hosted by this object.  The","     * supplied callback will execute after any listeners add","     * via the subscribe method, and after the default function,","     * if configured for the event, has executed.","     *","     * @method after","     * @param {String} type The name of the event","     * @param {Function} fn The callback to execute in response to the event","     * @param {Object} [context] Override `this` object in callback","     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber","     * @return {EventHandle} A subscription handle capable of detaching the","     *                       subscription","     */","    after: function(type, fn) {","","        var a = nativeSlice.call(arguments, 0);","","        switch (L.type(type)) {","            case 'function':","                return Y.Do.after.apply(Y.Do, arguments);","            case 'array':","            //     YArray.each(a[0], function(v) {","            //         v = AFTER_PREFIX + v;","            //     });","            //     break;","            case 'object':","                a[0]._after = true;","                break;","            default:","                a[0] = AFTER_PREFIX + type;","        }","","        return this.on.apply(this, a);","","    },","","    /**","     * Executes the callback before a DOM event, custom event","     * or method.  If the first argument is a function, it","     * is assumed the target is a method.  For DOM and custom","     * events, this is an alias for Y.on.","     *","     * For DOM and custom events:","     * type, callback, context, 0-n arguments","     *","     * For methods:","     * callback, object (method host), methodName, context, 0-n arguments","     *","     * @method before","     * @return detach handle","     */","    before: function() {","        return this.on.apply(this, arguments);","    }","","};","","Y.EventTarget = ET;","","// make Y an event target","Y.mix(Y, ET.prototype);","ET.call(Y, { bubbles: false });","","YUI.Env.globalEvents = YUI.Env.globalEvents || new ET();","","/**"," * Hosts YUI page level events.  This is where events bubble to"," * when the broadcast config is set to 2.  This property is"," * only available if the custom event module is loaded."," * @property Global"," * @type EventTarget"," * @for YUI"," */","Y.Global = YUI.Env.globalEvents;","","// @TODO implement a global namespace function on Y.Global?","","/**","`Y.on()` can do many things:","","<ul>","    <li>Subscribe to custom events `publish`ed and `fire`d from Y</li>","    <li>Subscribe to custom events `publish`ed with `broadcast` 1 or 2 and","        `fire`d from any object in the YUI instance sandbox</li>","    <li>Subscribe to DOM events</li>","    <li>Subscribe to the execution of a method on any object, effectively","    treating that method as an event</li>","</ul>","","For custom event subscriptions, pass the custom event name as the first argument and callback as the second. The `this` object in the callback will be `Y` unless an override is passed as the third argument.","","    Y.on('io:complete', function () {","        Y.MyApp.updateStatus('Transaction complete');","    });","","To subscribe to DOM events, pass the name of a DOM event as the first argument","and a CSS selector string as the third argument after the callback function.","Alternately, the third argument can be a `Node`, `NodeList`, `HTMLElement`,","array, or simply omitted (the default is the `window` object).","","    Y.on('click', function (e) {","        e.preventDefault();","","        // proceed with ajax form submission","        var url = this.get('action');","        ...","    }, '#my-form');","","The `this` object in DOM event callbacks will be the `Node` targeted by the CSS","selector or other identifier.","","`on()` subscribers for DOM events or custom events `publish`ed with a","`defaultFn` can prevent the default behavior with `e.preventDefault()` from the","event object passed as the first parameter to the subscription callback.","","To subscribe to the execution of an object method, pass arguments corresponding to the call signature for ","<a href=\"../classes/Do.html#methods_before\">`Y.Do.before(...)`</a>.","","NOTE: The formal parameter list below is for events, not for function","injection.  See `Y.Do.before` for that signature.","","@method on","@param {String} type DOM or custom event name","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [arg*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching the","                      subscription","@see Do.before","@for YUI","**/","","/**","Listen for an event one time.  Equivalent to `on()`, except that","the listener is immediately detached when executed.","","See the <a href=\"#methods_on\">`on()` method</a> for additional subscription","options.","","@see on","@method once","@param {String} type DOM or custom event name","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [arg*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching the","                      subscription","@for YUI","**/","","/**","Listen for an event one time.  Equivalent to `once()`, except, like `after()`,","the subscription callback executes after all `on()` subscribers and the event's","`defaultFn` (if configured) have executed.  Like `after()` if any `on()` phase","subscriber calls `e.preventDefault()`, neither the `defaultFn` nor the `after()`","subscribers will execute.","","The listener is immediately detached when executed.","","See the <a href=\"#methods_on\">`on()` method</a> for additional subscription","options.","","@see once","@method onceAfter","@param {String} type The custom event name","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [arg*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching the","                      subscription","@for YUI","**/","","/**","Like `on()`, this method creates a subscription to a custom event or to the","execution of a method on an object.","","For events, `after()` subscribers are executed after the event's","`defaultFn` unless `e.preventDefault()` was called from an `on()` subscriber.","","See the <a href=\"#methods_on\">`on()` method</a> for additional subscription","options.","","NOTE: The subscription signature shown is for events, not for function","injection.  See <a href=\"../classes/Do.html#methods_after\">`Y.Do.after`</a>","for that signature.","","@see on","@see Do.after","@method after","@param {String} type The custom event name","@param {Function} fn The callback to execute in response to the event","@param {Object} [context] Override `this` object in callback","@param {Any} [args*] 0..n additional arguments to supply to the subscriber","@return {EventHandle} A subscription handle capable of detaching the","                      subscription","@for YUI","**/","","","}, '@VERSION@' ,{requires:['oop']});"];
_yuitest_coverage["/build/event-custom-base/event-custom-base.js"].lines = {"1":0,"9":0,"29":0,"76":0,"77":0,"78":0,"79":0,"82":0,"113":0,"114":0,"115":0,"116":0,"119":0,"138":0,"140":0,"142":0,"145":0,"147":0,"149":0,"152":0,"153":0,"158":0,"161":0,"163":0,"174":0,"175":0,"183":0,"215":0,"216":0,"217":0,"218":0,"219":0,"220":0,"230":0,"231":0,"232":0,"234":0,"245":0,"246":0,"247":0,"264":0,"266":0,"273":0,"274":0,"275":0,"276":0,"277":0,"279":0,"281":0,"282":0,"284":0,"285":0,"293":0,"294":0,"297":0,"298":0,"301":0,"302":0,"303":0,"305":0,"306":0,"308":0,"309":0,"311":0,"316":0,"332":0,"333":0,"334":0,"346":0,"347":0,"348":0,"361":0,"362":0,"363":0,"374":0,"375":0,"388":0,"405":0,"439":0,"441":0,"442":0,"443":0,"447":0,"460":0,"462":0,"464":0,"466":0,"473":0,"481":0,"491":0,"509":0,"527":0,"528":0,"537":0,"544":0,"545":0,"554":0,"651":0,"663":0,"672":0,"689":0,"718":0,"720":0,"722":0,"734":0,"736":0,"737":0,"738":0,"741":0,"742":0,"745":0,"757":0,"758":0,"760":0,"761":0,"770":0,"772":0,"773":0,"775":0,"786":0,"804":0,"805":0,"808":0,"810":0,"811":0,"812":0,"814":0,"818":0,"819":0,"821":0,"824":0,"825":0,"826":0,"828":0,"832":0,"843":0,"844":0,"857":0,"858":0,"859":0,"863":0,"878":0,"879":0,"892":0,"893":0,"896":0,"901":0,"902":0,"903":0,"904":0,"905":0,"909":0,"910":0,"911":0,"912":0,"913":0,"917":0,"930":0,"942":0,"944":0,"946":0,"948":0,"949":0,"950":0,"953":0,"963":0,"985":0,"986":0,"987":0,"990":0,"995":0,"997":0,"998":0,"1001":0,"1002":0,"1004":0,"1018":0,"1019":0,"1020":0,"1021":0,"1022":0,"1023":0,"1025":0,"1026":0,"1031":0,"1032":0,"1048":0,"1050":0,"1051":0,"1052":0,"1053":0,"1054":0,"1056":0,"1057":0,"1062":0,"1074":0,"1076":0,"1077":0,"1079":0,"1080":0,"1083":0,"1084":0,"1096":0,"1105":0,"1119":0,"1121":0,"1122":0,"1123":0,"1126":0,"1127":0,"1130":0,"1131":0,"1132":0,"1134":0,"1138":0,"1139":0,"1145":0,"1146":0,"1159":0,"1167":0,"1174":0,"1181":0,"1188":0,"1190":0,"1207":0,"1211":0,"1212":0,"1213":0,"1214":0,"1216":0,"1217":0,"1220":0,"1221":0,"1223":0,"1224":0,"1226":0,"1227":0,"1229":0,"1230":0,"1231":0,"1232":0,"1234":0,"1238":0,"1239":0,"1242":0,"1252":0,"1255":0,"1256":0,"1260":0,"1261":0,"1263":0,"1264":0,"1266":0,"1270":0,"1284":0,"1285":0,"1287":0,"1292":0,"1303":0,"1311":0,"1319":0,"1322":0,"1324":0,"1325":0,"1326":0,"1327":0,"1338":0,"1339":0,"1340":0,"1341":0,"1342":0,"1345":0,"1346":0,"1351":0,"1363":0,"1391":0,"1398":0,"1410":0,"1411":0,"1414":0,"1426":0,"1428":0,"1429":0,"1432":0,"1434":0,"1435":0,"1436":0,"1439":0,"1441":0,"1442":0,"1443":0,"1444":0,"1445":0,"1450":0,"1456":0,"1458":0,"1488":0,"1504":0,"1505":0,"1506":0,"1507":0,"1510":0,"1526":0,"1527":0,"1528":0,"1529":0,"1532":0,"1552":0,"1586":0,"1591":0,"1597":0,"1599":0,"1600":0,"1603":0,"1604":0,"1605":0,"1606":0,"1608":0,"1609":0,"1612":0,"1613":0,"1615":0,"1617":0,"1618":0,"1619":0,"1622":0,"1624":0,"1625":0,"1626":0,"1628":0,"1632":0,"1636":0,"1637":0,"1638":0,"1641":0,"1642":0,"1643":0,"1644":0,"1647":0,"1649":0,"1651":0,"1652":0,"1653":0,"1655":0,"1656":0,"1658":0,"1659":0,"1660":0,"1661":0,"1664":0,"1667":0,"1668":0,"1673":0,"1674":0,"1675":0,"1676":0,"1681":0,"1682":0,"1683":0,"1686":0,"1687":0,"1688":0,"1689":0,"1692":0,"1702":0,"1722":0,"1726":0,"1727":0,"1728":0,"1729":0,"1732":0,"1733":0,"1736":0,"1739":0,"1746":0,"1747":0,"1748":0,"1749":0,"1750":0,"1751":0,"1757":0,"1759":0,"1760":0,"1761":0,"1763":0,"1764":0,"1765":0,"1767":0,"1768":0,"1769":0,"1774":0,"1778":0,"1779":0,"1780":0,"1782":0,"1783":0,"1784":0,"1785":0,"1786":0,"1789":0,"1792":0,"1793":0,"1795":0,"1796":0,"1797":0,"1799":0,"1800":0,"1801":0,"1802":0,"1807":0,"1808":0,"1809":0,"1812":0,"1821":0,"1832":0,"1844":0,"1914":0,"1918":0,"1919":0,"1920":0,"1921":0,"1924":0,"1927":0,"1929":0,"1933":0,"1934":0,"1936":0,"1938":0,"1939":0,"1943":0,"1946":0,"1947":0,"1948":0,"1951":0,"1960":0,"1981":0,"1982":0,"1983":0,"1984":0,"1985":0,"2019":0,"2024":0,"2026":0,"2030":0,"2031":0,"2033":0,"2034":0,"2038":0,"2039":0,"2040":0,"2044":0,"2046":0,"2047":0,"2050":0,"2054":0,"2056":0,"2057":0,"2059":0,"2060":0,"2062":0,"2063":0,"2064":0,"2069":0,"2081":0,"2082":0,"2083":0,"2084":0,"2086":0,"2087":0,"2106":0,"2108":0,"2110":0,"2117":0,"2118":0,"2120":0,"2123":0,"2143":0,"2148":0,"2151":0,"2152":0,"2154":0,"2164":0};
_yuitest_coverage["/build/event-custom-base/event-custom-base.js"].functions = {"before:75":0,"after:112":0,"]:152":0,"_inject:136":0,"detach:173":0,"Method:215":0,"register:230":0,"_delete:245":0,"exec:264":0,"AlterArgs:332":0,"AlterReturn:346":0,"Halt:361":0,"Prevent:374":0,"mixConfigs:438":0,"CustomEvent:460":0,"hasSubs:733":0,"monitor:756":0,"getSubs:769":0,"applyConfig:785":0,"_on:802":0,"subscribe:842":0,"on:856":0,"after:877":0,"detach:890":0,"unsubscribe:929":0,"_notify:940":0,"log:962":0,"fire:984":0,"fireSimple:1017":0,"fireComplex:1030":0,"_procSubs:1047":0,"_broadcast:1073":0,"unsubscribeAll:1095":0,"detachAll:1104":0,"_delete:1118":0,"Subscriber:1159":0,"_notify:1210":0,"notify:1251":0,"contains:1283":0,"valueOf:1291":0,"EventHandle:1303":0,"(anonymous 2):1326":0,"batch:1323":0,"detach:1337":0,"monitor:1362":0,"(anonymous 3):1397":0,"(anonymous 4):1408":0,"(anonymous 5):1424":0,"ET:1453":0,"(anonymous 6):1505":0,"once:1503":0,"(anonymous 7):1527":0,"onceAfter:1525":0,"parseType:1551":0,"(anonymous 8):1615":0,"on:1584":0,"subscribe:1701":0,"keyDetacher:1745":0,"detach:1721":0,"unsubscribe:1820":0,"detachAll:1831":0,"unsubscribeAll:1843":0,"(anonymous 9):1920":0,"publish:1913":0,"_monitor:1980":0,"fire:2017":0,"getSibling:2053":0,"getEvent:2080":0,"after:2104":0,"before:2142":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/event-custom-base/event-custom-base.js"].coveredLines = 482;
_yuitest_coverage["/build/event-custom-base/event-custom-base.js"].coveredFunctions = 71;
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1);
YUI.add('event-custom-base', function(Y) {

/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 */

_yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 9);
Y.Env.evt = {
    handles: {},
    plugins: {}
};


/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */

/**
 * Allows for the insertion of methods that are executed before or after
 * a specified method
 * @class Do
 * @static
 */

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 29);
var DO_BEFORE = 0,
    DO_AFTER = 1,

DO = {

    /**
     * Cache of objects touched by the utility
     * @property objs
     * @static
     * @deprecated Since 3.6.0. The `_yuiaop` property on the AOP'd object 
     * replaces the role of this property, but is considered to be private, and 
     * is only mentioned to provide a migration path.
     * 
     * If you have a use case which warrants migration to the _yuiaop property, 
     * please file a ticket to let us know what it's used for and we can see if 
     * we need to expose hooks for that functionality more formally.
     */
    objs: null,

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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "before", 75);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 76);
var f = fn, a;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 77);
if (c) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 78);
a = [fn, c].concat(Y.Array(arguments, 4, true));
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 79);
f = Y.rbind.apply(Y, a);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 82);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "after", 112);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 113);
var f = fn, a;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 114);
if (c) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 115);
a = [fn, c].concat(Y.Array(arguments, 4, true));
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 116);
f = Y.rbind.apply(Y, a);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 119);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_inject", 136);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 138);
var id = Y.stamp(obj), o, sid;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 140);
if (!obj._yuiaop) {
            // create a map entry for the obj if it doesn't exist, to hold overridden methods
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 142);
obj._yuiaop = {};
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 145);
o = obj._yuiaop;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 147);
if (!o[sFn]) {
            // create a map entry for the method if it doesn't exist
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 149);
o[sFn] = new Y.Do.Method(obj, sFn);

            // re-route the method to our wrapper
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 152);
obj[sFn] = function() {
                _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "]", 152);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 153);
return o[sFn].exec.apply(o[sFn], arguments);
            };
        }

        // subscriber id
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 158);
sid = id + Y.stamp(fn) + sFn;

        // register the callback
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 161);
o[sFn].register(sid, fn, when);

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 163);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "detach", 173);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 174);
if (handle.detach) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 175);
handle.detach();
        }
    },

    _unload: function(e, me) {
    }
};

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 183);
Y.Do = DO;

//////////////////////////////////////////////////////////////////////////

/**
 * Contains the return value from the wrapped method, accessible
 * by 'after' event listeners.
 *
 * @property originalRetVal
 * @static
 * @since 3.2.0
 */

/**
 * Contains the current state of the return value, consumable by
 * 'after' event listeners, and updated if an after subscriber
 * changes the return value generated by the wrapped function.
 *
 * @property currentRetVal
 * @static
 * @since 3.2.0
 */

//////////////////////////////////////////////////////////////////////////

/**
 * Wrapper for a displaced method with aop enabled
 * @class Do.Method
 * @constructor
 * @param obj The object to operate on
 * @param sFn The name of the method to displace
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 215);
DO.Method = function(obj, sFn) {
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "Method", 215);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 216);
this.obj = obj;
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 217);
this.methodName = sFn;
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 218);
this.method = obj[sFn];
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 219);
this.before = {};
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 220);
this.after = {};
};

/**
 * Register a aop subscriber
 * @method register
 * @param sid {string} the subscriber id
 * @param fn {Function} the function to execute
 * @param when {string} when to execute the function
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 230);
DO.Method.prototype.register = function (sid, fn, when) {
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "register", 230);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 231);
if (when) {
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 232);
this.after[sid] = fn;
    } else {
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 234);
this.before[sid] = fn;
    }
};

/**
 * Unregister a aop subscriber
 * @method delete
 * @param sid {string} the subscriber id
 * @param fn {Function} the function to execute
 * @param when {string} when to execute the function
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 245);
DO.Method.prototype._delete = function (sid) {
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_delete", 245);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 246);
delete this.before[sid];
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 247);
delete this.after[sid];
};

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
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 264);
DO.Method.prototype.exec = function () {

    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "exec", 264);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 266);
var args = Y.Array(arguments, 0, true),
        i, ret, newRet,
        bf = this.before,
        af = this.after,
        prevented = false;

    // execute before
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 273);
for (i in bf) {
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 274);
if (bf.hasOwnProperty(i)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 275);
ret = bf[i].apply(this.obj, args);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 276);
if (ret) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 277);
switch (ret.constructor) {
                    case DO.Halt:
                        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 279);
return ret.retVal;
                    case DO.AlterArgs:
                        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 281);
args = ret.newArgs;
                        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 282);
break;
                    case DO.Prevent:
                        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 284);
prevented = true;
                        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 285);
break;
                    default:
                }
            }
        }
    }

    // execute method
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 293);
if (!prevented) {
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 294);
ret = this.method.apply(this.obj, args);
    }

    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 297);
DO.originalRetVal = ret;
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 298);
DO.currentRetVal = ret;

    // execute after methods.
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 301);
for (i in af) {
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 302);
if (af.hasOwnProperty(i)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 303);
newRet = af[i].apply(this.obj, args);
            // Stop processing if a Halt object is returned
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 305);
if (newRet && newRet.constructor == DO.Halt) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 306);
return newRet.retVal;
            // Check for a new return value
            } else {_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 308);
if (newRet && newRet.constructor == DO.AlterReturn) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 309);
ret = newRet.newRetVal;
                // Update the static retval state
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 311);
DO.currentRetVal = ret;
            }}
        }
    }

    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 316);
return ret;
};

//////////////////////////////////////////////////////////////////////////

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
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 332);
DO.AlterArgs = function(msg, newArgs) {
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "AlterArgs", 332);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 333);
this.msg = msg;
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 334);
this.newArgs = newArgs;
};

/**
 * Return an AlterReturn object when you want to change the result returned
 * from the core method to the caller.  Useful for Do.after subscribers.
 * @class Do.AlterReturn
 * @constructor
 * @param msg {String} (optional) Explanation of the altered return value
 * @param newRetVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 346);
DO.AlterReturn = function(msg, newRetVal) {
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "AlterReturn", 346);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 347);
this.msg = msg;
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 348);
this.newRetVal = newRetVal;
};

/**
 * Return a Halt object when you want to terminate the execution
 * of all subsequent subscribers as well as the wrapped method
 * if it has not exectued yet.  Useful for Do.before subscribers.
 * @class Do.Halt
 * @constructor
 * @param msg {String} (optional) Explanation of why the termination was done
 * @param retVal {any} Return value passed to code that invoked the wrapped
 *                      function.
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 361);
DO.Halt = function(msg, retVal) {
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "Halt", 361);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 362);
this.msg = msg;
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 363);
this.retVal = retVal;
};

/**
 * Return a Prevent object when you want to prevent the wrapped function
 * from executing, but want the remaining listeners to execute.  Useful
 * for Do.before subscribers.
 * @class Do.Prevent
 * @constructor
 * @param msg {String} (optional) Explanation of why the termination was done
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 374);
DO.Prevent = function(msg) {
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "Prevent", 374);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 375);
this.msg = msg;
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
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 388);
DO.Error = DO.Halt;


//////////////////////////////////////////////////////////////////////////

// Y["Event"] && Y.Event.addListener(window, "unload", Y.Do._unload, Y.Do);


/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 * @submodule event-custom-base
 */


// var onsubscribeType = "_event:onsub",
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 405);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "mixConfigs", 438);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 439);
var p;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 441);
for (p in s) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 442);
if (CONFIGS_HASH[p] && (ov || !(p in r))) { 
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 443);
r[p] = s[p];
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 447);
return r;
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
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 460);
Y.CustomEvent = function(type, o) {

    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "CustomEvent", 460);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 462);
this._kds = Y.CustomEvent.keepDeprecatedSubs;

    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 464);
o = o || {};

    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 466);
this.id = Y.stamp(this);

    /**
     * The type of event, returned to subscribers when the event fires
     * @property type
     * @type string
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 473);
this.type = type;

    /**
     * The context the the event will fire from by default.  Defaults to the YUI
     * instance.
     * @property context
     * @type object
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 481);
this.context = Y;

    /**
     * Monitor when an event is attached or detached.
     *
     * @property monitored
     * @type boolean
     */
    // this.monitored = false;

    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 491);
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
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 509);
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
     * @deprecated
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 527);
if (this._kds) {
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 528);
this.subscribers = {};
    }

    /**
     * The subscribers to this event
     * @property _subscribers
     * @type Subscriber []
     * @private
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 537);
this._subscribers = [];

    /**
     * 'After' subscribers
     * @property afters
     * @type Subscriber {}
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 544);
if (this._kds) {
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 545);
this.afters = {};
    }

    /**
     * 'After' subscribers
     * @property _afters
     * @type Subscriber []
     * @private
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 554);
this._afters = [];

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
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 651);
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
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 663);
this.bubbles = true;

    /**
     * Supports multiple options for listener signatures in order to
     * port YUI 2 apps.
     * @property signature
     * @type int
     * @default 9
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 672);
this.signature = YUI3_SIGNATURE;

    // this.subCount = 0;
    // this.afterCount = 0;

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

    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 689);
this.applyConfig(o, true);

    // this.log("Creating " + this.type);

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
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 718);
Y.CustomEvent.keepDeprecatedSubs = false;

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 720);
Y.CustomEvent.mixConfigs = mixConfigs;

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 722);
Y.CustomEvent.prototype = {

    constructor: Y.CustomEvent,

    /**
     * Returns the number of subscribers for this event as the sum of the on()
     * subscribers and after() subscribers.
     *
     * @method hasSubs
     * @return Number
     */
    hasSubs: function(when) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "hasSubs", 733);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 734);
var s = this._subscribers.length, a = this._afters.length, sib = this.sibling;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 736);
if (sib) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 737);
s += sib._subscribers.length;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 738);
a += sib._afters.length;
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 741);
if (when) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 742);
return (when == 'after') ? a : s;
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 745);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "monitor", 756);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 757);
this.monitored = true;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 758);
var type = this.id + '|' + this.type + '_' + what,
            args = nativeSlice.call(arguments, 0);
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 760);
args[0] = type;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 761);
return this.host.on.apply(this.host, args);
    },

    /**
     * Get all of the subscribers to this event and any sibling event
     * @method getSubs
     * @return {Array} first item is the on subscribers, second the after.
     */
    getSubs: function() {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "getSubs", 769);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 770);
var s = this._subscribers, a = this._afters, sib = this.sibling;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 772);
s = (sib) ? s.concat(sib._subscribers) : s.concat();
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 773);
a = (sib) ? a.concat(sib._afters) : a.concat();

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 775);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "applyConfig", 785);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 786);
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

        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_on", 802);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 804);
if (!fn) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 805);
this.log('Invalid callback for CE: ' + this.type);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 808);
var s = new Y.Subscriber(fn, context, args, when);

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 810);
if (this.fireOnce && this.fired) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 811);
if (this.async) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 812);
setTimeout(Y.bind(this._notify, this, s, this.firedWith), 0);
            } else {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 814);
this._notify(s, this.firedWith);
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 818);
if (when == AFTER) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 819);
this._afters.push(s);
        } else {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 821);
this._subscribers.push(s);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 824);
if (this._kds) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 825);
if (when == AFTER) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 826);
this.afters[s.id] = s;
            } else {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 828);
this.subscribers[s.id] = s;
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 832);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "subscribe", 842);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 843);
var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 844);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "on", 856);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 857);
var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 858);
if (this.host) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 859);
this.host._monitor('attach', this.type, {
                args: arguments
            });
        }
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 863);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "after", 877);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 878);
var a = (arguments.length > 2) ? nativeSlice.call(arguments, 2) : null;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 879);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "detach", 890);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 892);
if (fn && fn.detach) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 893);
return fn.detach();
        }
        
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 896);
var i, s,
            found = 0,
            subs = this._subscribers,
            afters = this._afters;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 901);
for (i = subs.length; i >= 0; i--) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 902);
s = subs[i];
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 903);
if (s && (!fn || fn === s.fn)) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 904);
this._delete(s, subs, i);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 905);
found++;
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 909);
for (i = afters.length; i >= 0; i--) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 910);
s = afters[i];
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 911);
if (s && (!fn || fn === s.fn)) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 912);
this._delete(s, afters, i);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 913);
found++;
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 917);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "unsubscribe", 929);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 930);
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

        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_notify", 940);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 942);
this.log(this.type + '->' + 'sub: ' + s.id);

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 944);
var ret;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 946);
ret = s.notify(args, this);

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 948);
if (false === ret || this.stopped > 1) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 949);
this.log(this.type + ' cancelled by subscriber');
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 950);
return false;
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 953);
return true;
    },

    /**
     * Logger abstraction to centralize the application of the silent flag
     * @method log
     * @param {string} msg message to log.
     * @param {string} cat log category.
     */
    log: function(msg, cat) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "log", 962);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 963);
if (!this.silent) {
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "fire", 984);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 985);
if (this.fireOnce && this.fired) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 986);
this.log('fireOnce event: ' + this.type + ' already fired');
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 987);
return true;
        } else {

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 990);
var args = nativeSlice.call(arguments, 0);

            // this doesn't happen if the event isn't published
            // this.host._monitor('fire', this.type, args);

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 995);
this.fired = true;

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 997);
if (this.fireOnce) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 998);
this.firedWith = args;
            }

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1001);
if (this.emitFacade) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1002);
return this.fireComplex(args);
            } else {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1004);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "fireSimple", 1017);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1018);
this.stopped = 0;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1019);
this.prevented = 0;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1020);
if (this.hasSubs()) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1021);
var subs = this.getSubs();
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1022);
this._procSubs(subs[0], args);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1023);
this._procSubs(subs[1], args);
        }
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1025);
this._broadcast(args);
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1026);
return this.stopped ? false : true;
    },

    // Requires the event-custom-complex module for full funcitonality.
    fireComplex: function(args) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "fireComplex", 1030);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1031);
args[0] = args[0] || {};
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1032);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_procSubs", 1047);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1048);
var s, i, l;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1050);
for (i = 0, l = subs.length; i < l; i++) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1051);
s = subs[i];
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1052);
if (s && s.fn) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1053);
if (false === this._notify(s, args, ef)) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1054);
this.stopped = 2;
                }
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1056);
if (this.stopped == 2) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1057);
return false;
                }
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1062);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_broadcast", 1073);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1074);
if (!this.stopped && this.broadcast) {

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1076);
var a = args.concat();
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1077);
a.unshift(this.type);

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1079);
if (this.host !== Y) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1080);
Y.fire.apply(Y, a);
            }

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1083);
if (this.broadcast == 2) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1084);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "unsubscribeAll", 1095);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1096);
return this.detachAll.apply(this, arguments);
    },

    /**
     * Removes all listeners
     * @method detachAll
     * @return {int} The number of listeners unsubscribed.
     */
    detachAll: function() {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "detachAll", 1104);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1105);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_delete", 1118);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1119);
var when = s._when;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1121);
if (!subs) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1122);
subs = (when === AFTER) ? this._afters : this._subscribers; 
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1123);
i = YArray.indexOf(subs, s, 0);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1126);
if (s && subs[i] === s) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1127);
subs.splice(i, 1);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1130);
if (this._kds) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1131);
if (when === AFTER) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1132);
delete this.afters[s.id];
            } else {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1134);
delete this.subscribers[s.id];
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1138);
if (this.host) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1139);
this.host._monitor('detach', this.type, {
                ce: this,
                sub: s
            });
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1145);
if (s) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1146);
s.deleted = true;
        }
    }
};
/**
 * Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The wrapped function to execute.
 * @param {Object}   context  The value of the keyword 'this' in the listener.
 * @param {Array} args*       0..n additional arguments to supply the listener.
 *
 * @class Subscriber
 * @constructor
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1159);
Y.Subscriber = function(fn, context, args, when) {

    /**
     * The callback that will be execute when the event fires
     * This is wrapped by Y.rbind if obj was supplied.
     * @property fn
     * @type Function
     */
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "Subscriber", 1159);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1167);
this.fn = fn;

    /**
     * Optional 'this' keyword for the listener
     * @property context
     * @type Object
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1174);
this.context = context;

    /**
     * Unique subscriber id
     * @property id
     * @type String
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1181);
this.id = Y.stamp(this);

    /**
     * Additional arguments to propagate to the subscriber
     * @property args
     * @type Array
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1188);
this.args = args;

    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1190);
this._when = when;

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

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1207);
Y.Subscriber.prototype = {
    constructor: Y.Subscriber,

    _notify: function(c, args, ce) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_notify", 1210);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1211);
if (this.deleted && !this.postponed) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1212);
if (this.postponed) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1213);
delete this.fn;
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1214);
delete this.context;
            } else {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1216);
delete this.postponed;
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1217);
return null;
            }
        }
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1220);
var a = this.args, ret;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1221);
switch (ce.signature) {
            case 0:
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1223);
ret = this.fn.call(c, ce.type, args, c);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1224);
break;
            case 1:
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1226);
ret = this.fn.call(c, args[0] || null, c);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1227);
break;
            default:
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1229);
if (a || args) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1230);
args = args || [];
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1231);
a = (a) ? args.concat(a) : args;
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1232);
ret = this.fn.apply(c, a);
                } else {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1234);
ret = this.fn.call(c);
                }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1238);
if (this.once) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1239);
ce._delete(this);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1242);
return ret;
    },

    /**
     * Executes the subscriber.
     * @method notify
     * @param args {Array} Arguments array for the subscriber.
     * @param ce {CustomEvent} The custom event that sent the notification.
     */
    notify: function(args, ce) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "notify", 1251);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1252);
var c = this.context,
            ret = true;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1255);
if (!c) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1256);
c = (ce.contextFn) ? ce.contextFn() : ce.context;
        }

        // only catch errors if we will not re-throw them.
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1260);
if (Y.config && Y.config.throwFail) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1261);
ret = this._notify(c, args, ce);
        } else {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1263);
try {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1264);
ret = this._notify(c, args, ce);
            } catch (e) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1266);
Y.error(this + ' failed: ' + e.message, e);
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1270);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "contains", 1283);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1284);
if (context) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1285);
return ((this.fn == fn) && this.context == context);
        } else {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1287);
return (this.fn == fn);
        }
    },
    
    valueOf : function() {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "valueOf", 1291);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1292);
return this.id;
    }

};
/**
 * Return value from all subscribe operations
 * @class EventHandle
 * @constructor
 * @param {CustomEvent} evt the custom event.
 * @param {Subscriber} sub the subscriber.
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1303);
Y.EventHandle = function(evt, sub) {

    /**
     * The custom event
     *
     * @property evt
     * @type CustomEvent
     */
    _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "EventHandle", 1303);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1311);
this.evt = evt;

    /**
     * The subscriber object
     *
     * @property sub
     * @type Subscriber
     */
    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1319);
this.sub = sub;
};

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1322);
Y.EventHandle.prototype = {
    batch: function(f, c) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "batch", 1323);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1324);
f.call(c || this, this);
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1325);
if (Y.Lang.isArray(this.evt)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1326);
Y.Array.each(this.evt, function(h) {
                _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 2)", 1326);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1327);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "detach", 1337);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1338);
var evt = this.evt, detached = 0, i;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1339);
if (evt) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1340);
if (Y.Lang.isArray(evt)) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1341);
for (i = 0; i < evt.length; i++) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1342);
detached += evt[i].detach();
                }
            } else {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1345);
evt._delete(this.sub);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1346);
detached = 1;
            }

        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1351);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "monitor", 1362);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1363);
return this.evt.monitor.apply(this.evt, arguments);
    }
};

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
 * @config prefix {String} the prefix to apply to non-prefixed event names
 */

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1391);
var L = Y.Lang,
    PREFIX_DELIMITER = ':',
    CATEGORY_DELIMITER = '|',
    AFTER_PREFIX = '~AFTER~',
    WILD_TYPE_RE = /(.*?)(:)(.*?)/,

    _wildType = Y.cached(function(type) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 3)", 1397);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1398);
return type.replace(WILD_TYPE_RE, "*$2$3");
    }),

    /**
     * If the instance has a prefix attribute and the
     * event type is not prefixed, the instance prefix is
     * applied to the supplied type.
     * @method _getType
     * @private
     */
    _getType = Y.cached(function(type, pre) {

        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 4)", 1408);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1410);
if (!pre || !L.isString(type) || type.indexOf(PREFIX_DELIMITER) > -1) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1411);
return type;
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1414);
return pre + PREFIX_DELIMITER + type;
    }),

    /**
     * Returns an array with the detach key (if provided),
     * and the prefixed event name from _getType
     * Y.on('detachcategory| menu:click', fn)
     * @method _parseType
     * @private
     */
    _parseType = Y.cached(function(type, pre) {

        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 5)", 1424);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1426);
var t = type, detachcategory, after, i;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1428);
if (!L.isString(t)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1429);
return t;
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1432);
i = t.indexOf(AFTER_PREFIX);

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1434);
if (i > -1) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1435);
after = true;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1436);
t = t.substr(AFTER_PREFIX.length);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1439);
i = t.indexOf(CATEGORY_DELIMITER);

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1441);
if (i > -1) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1442);
detachcategory = t.substr(0, (i));
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1443);
t = t.substr(i+1);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1444);
if (t == '*') {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1445);
t = null;
            }
        }

        // detach category, full type with instance prefix, is this an after listener, short type
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1450);
return [detachcategory, (pre) ? _getType(t, pre) : t, after, t];
    }),

    ET = function(opts) {


        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "ET", 1453);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1456);
var o = (L.isObject(opts)) ? opts : {};

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1458);
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

    };


_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1488);
ET.prototype = {
    constructor: ET,

    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>on</code> except the
     * listener is immediatelly detached when it is executed.
     * @method once
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching the
     *                       subscription
     */
    once: function() {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "once", 1503);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1504);
var handle = this.on.apply(this, arguments);
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1505);
handle.batch(function(hand) {
            _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 6)", 1505);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1506);
if (hand.sub) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1507);
hand.sub.once = true;
            }
        });
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1510);
return handle;
    },

    /**
     * Listen to a custom event hosted by this object one time.
     * This is the equivalent to <code>after</code> except the
     * listener is immediatelly detached when it is executed.
     * @method onceAfter
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching that
     *                       subscription
     */
    onceAfter: function() {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "onceAfter", 1525);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1526);
var handle = this.after.apply(this, arguments);
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1527);
handle.batch(function(hand) {
            _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 7)", 1527);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1528);
if (hand.sub) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1529);
hand.sub.once = true;
            }
        });
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1532);
return handle;
    },

    /**
     * Takes the type parameter passed to 'on' and parses out the
     * various pieces that could be included in the type.  If the
     * event type is passed without a prefix, it will be expanded
     * to include the prefix one is supplied or the event target
     * is configured with a default prefix.
     * @method parseType
     * @param {String} type the type
     * @param {String} [pre=this._yuievt.config.prefix] the prefix
     * @since 3.3.0
     * @return {Array} an array containing:
     *  * the detach category, if supplied,
     *  * the prefixed event type,
     *  * whether or not this is an after listener,
     *  * the supplied event type
     */
    parseType: function(type, pre) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "parseType", 1551);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1552);
return _parseType(type, pre || this._yuievt.config.prefix);
    },

    /**
     * Subscribe a callback function to a custom event fired by this object or
     * from an object that bubbles its events to this object.
     *
     * Callback functions for events published with `emitFacade = true` will
     * receive an `EventFacade` as the first argument (typically named "e").
     * These callbacks can then call `e.preventDefault()` to disable the
     * behavior published to that event's `defaultFn`.  See the `EventFacade`
     * API for all available properties and methods. Subscribers to
     * non-`emitFacade` events will receive the arguments passed to `fire()`
     * after the event name.
     *
     * To subscribe to multiple events at once, pass an object as the first
     * argument, where the key:value pairs correspond to the eventName:callback,
     * or pass an array of event names as the first argument to subscribe to
     * all listed events with the same callback.
     *
     * Returning `false` from a callback is supported as an alternative to
     * calling `e.preventDefault(); e.stopPropagation();`.  However, it is
     * recommended to use the event methods whenever possible.
     *
     * @method on
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching that
     *                       subscription
     */
    on: function(type, fn, context) {

        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "on", 1584);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1586);
var parts = _parseType(type, this._yuievt.config.prefix), f, c, args, ret, ce,
            detachcategory, handle, store = Y.Env.evt.handles, after, adapt, shorttype,
            Node = Y.Node, n, domevent, isArr;

        // full name, args, detachcategory, after
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1591);
this._monitor('attach', parts[1], {
            args: arguments,
            category: parts[0],
            after: parts[2]
        });

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1597);
if (L.isObject(type)) {

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1599);
if (L.isFunction(type)) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1600);
return Y.Do.before.apply(Y.Do, arguments);
            }

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1603);
f = fn;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1604);
c = context;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1605);
args = nativeSlice.call(arguments, 0);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1606);
ret = [];

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1608);
if (L.isArray(type)) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1609);
isArr = true;
            }

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1612);
after = type._after;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1613);
delete type._after;

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1615);
Y.each(type, function(v, k) {

                _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 8)", 1615);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1617);
if (L.isObject(v)) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1618);
f = v.fn || ((L.isFunction(v)) ? v : f);
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1619);
c = v.context || c;
                }

                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1622);
var nv = (after) ? AFTER_PREFIX : '';

                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1624);
args[0] = nv + ((isArr) ? v : k);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1625);
args[1] = f;
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1626);
args[2] = c;

                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1628);
ret.push(this.on.apply(this, args));

            }, this);

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1632);
return (this._yuievt.chain) ? this : new Y.EventHandle(ret);

        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1636);
detachcategory = parts[0];
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1637);
after = parts[2];
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1638);
shorttype = parts[3];

        // extra redirection so we catch adaptor events too.  take a look at this.
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1641);
if (Node && Y.instanceOf(this, Node) && (shorttype in Node.DOM_EVENTS)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1642);
args = nativeSlice.call(arguments, 0);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1643);
args.splice(2, 0, Node.getDOMNode(this));
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1644);
return Y.on.apply(Y, args);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1647);
type = parts[1];

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1649);
if (Y.instanceOf(this, YUI)) {

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1651);
adapt = Y.Env.evt.plugins[type];
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1652);
args  = nativeSlice.call(arguments, 0);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1653);
args[0] = shorttype;

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1655);
if (Node) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1656);
n = args[2];

                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1658);
if (Y.instanceOf(n, Y.NodeList)) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1659);
n = Y.NodeList.getDOMNodes(n);
                } else {_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1660);
if (Y.instanceOf(n, Node)) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1661);
n = Node.getDOMNode(n);
                }}

                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1664);
domevent = (shorttype in Node.DOM_EVENTS);

                // Captures both DOM events and event plugins.
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1667);
if (domevent) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1668);
args[2] = n;
                }
            }

            // check for the existance of an event adaptor
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1673);
if (adapt) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1674);
handle = adapt.on.apply(Y, args);
            } else {_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1675);
if ((!type) || domevent) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1676);
handle = Y.Event._attach(args);
            }}

        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1681);
if (!handle) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1682);
ce = this._yuievt.events[type] || this.publish(type);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1683);
handle = ce._on(fn, context, (arguments.length > 3) ? nativeSlice.call(arguments, 3) : null, (after) ? 'after' : true);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1686);
if (detachcategory) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1687);
store[detachcategory] = store[detachcategory] || {};
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1688);
store[detachcategory][type] = store[detachcategory][type] || [];
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1689);
store[detachcategory][type].push(handle);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1692);
return (this._yuievt.chain) ? this : handle;

    },

    /**
     * subscribe to an event
     * @method subscribe
     * @deprecated use on
     */
    subscribe: function() {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "subscribe", 1701);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1702);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "detach", 1721);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1722);
var evts = this._yuievt.events, i,
            Node = Y.Node, isNode = Node && (Y.instanceOf(this, Node));

        // detachAll disabled on the Y instance.
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1726);
if (!type && (this !== Y)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1727);
for (i in evts) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1728);
if (evts.hasOwnProperty(i)) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1729);
evts[i].detach(fn, context);
                }
            }
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1732);
if (isNode) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1733);
Y.Event.purgeElement(Node.getDOMNode(this));
            }

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1736);
return this;
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1739);
var parts = _parseType(type, this._yuievt.config.prefix),
        detachcategory = L.isArray(parts) ? parts[0] : null,
        shorttype = (parts) ? parts[3] : null,
        adapt, store = Y.Env.evt.handles, detachhost, cat, args,
        ce,

        keyDetacher = function(lcat, ltype, host) {
            _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "keyDetacher", 1745);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1746);
var handles = lcat[ltype], ce, i;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1747);
if (handles) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1748);
for (i = handles.length - 1; i >= 0; --i) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1749);
ce = handles[i].evt;
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1750);
if (ce.host === host || ce.el === host) {
                        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1751);
handles[i].detach();
                    }
                }
            }
        };

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1757);
if (detachcategory) {

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1759);
cat = store[detachcategory];
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1760);
type = parts[1];
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1761);
detachhost = (isNode) ? Y.Node.getDOMNode(this) : this;

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1763);
if (cat) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1764);
if (type) {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1765);
keyDetacher(cat, type, detachhost);
                } else {
                    _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1767);
for (i in cat) {
                        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1768);
if (cat.hasOwnProperty(i)) {
                            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1769);
keyDetacher(cat, i, detachhost);
                        }
                    }
                }

                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1774);
return this;
            }

        // If this is an event handle, use it to detach
        } else {_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1778);
if (L.isObject(type) && type.detach) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1779);
type.detach();
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1780);
return this;
        // extra redirection so we catch adaptor events too.  take a look at this.
        } else {_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1782);
if (isNode && ((!shorttype) || (shorttype in Node.DOM_EVENTS))) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1783);
args = nativeSlice.call(arguments, 0);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1784);
args[2] = Node.getDOMNode(this);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1785);
Y.detach.apply(Y, args);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1786);
return this;
        }}}

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1789);
adapt = Y.Env.evt.plugins[shorttype];

        // The YUI instance handles DOM events and adaptors
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1792);
if (Y.instanceOf(this, YUI)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1793);
args = nativeSlice.call(arguments, 0);
            // use the adaptor specific detach code if
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1795);
if (adapt && adapt.detach) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1796);
adapt.detach.apply(Y, args);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1797);
return this;
            // DOM event fork
            } else {_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1799);
if (!type || (!adapt && Node && (type in Node.DOM_EVENTS))) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1800);
args[0] = type;
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1801);
Y.Event.detach.apply(Y.Event, args);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1802);
return this;
            }}
        }

        // ce = evts[type];
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1807);
ce = evts[parts[1]];
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1808);
if (ce) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1809);
ce.detach(fn, context);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1812);
return this;
    },

    /**
     * detach a listener
     * @method unsubscribe
     * @deprecated use detach
     */
    unsubscribe: function() {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "unsubscribe", 1820);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1821);
return this.detach.apply(this, arguments);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method detachAll
     * @param type {String}   The type, or name of the event
     */
    detachAll: function(type) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "detachAll", 1831);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1832);
return this.detach(type);
    },

    /**
     * Removes all listeners from the specified event.  If the event type
     * is not specified, all listeners from all hosted custom events will
     * be removed.
     * @method unsubscribeAll
     * @param type {String}   The type, or name of the event
     * @deprecated use detachAll
     */
    unsubscribeAll: function() {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "unsubscribeAll", 1843);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1844);
return this.detachAll.apply(this, arguments);
    },

    /**
     * Creates a new custom event of the specified type.  If a custom event
     * by that name already exists, it will not be re-created.  In either
     * case the custom event is returned.
     *
     * @method publish
     *
     * @param type {String} the type, or name of the event
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "publish", 1913);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1914);
var events, ce, ret, defaults,
            edata    = this._yuievt,
            pre      = edata.config.prefix;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1918);
if (L.isObject(type)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1919);
ret = {};
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1920);
Y.each(type, function(v, k) {
                _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "(anonymous 9)", 1920);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1921);
ret[k] = this.publish(k, v || opts);
            }, this);

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1924);
return ret;
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1927);
type = (pre) ? _getType(type, pre) : type;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1929);
this._monitor('publish', type, {
            args: arguments
        });

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1933);
events = edata.events;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1934);
ce = events[type];

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1936);
if (ce) {
            // ce.log("publish applying new config to published event: '"+type+"' exists", 'info', 'event');
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1938);
if (opts) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1939);
ce.applyConfig(opts, true);
            }
        } else {
            // TODO: Lazy publish goes here.
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1943);
defaults = edata.defaults;

            // apply defaults
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1946);
ce = new Y.CustomEvent(type, defaults);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1947);
if (opts) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1948);
ce.applyConfig(opts, true);
            }

            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1951);
events[type] = ce;
        }

        // make sure we turn the broadcast flag off if this
        // event was published as a result of bubbling
        // if (opts instanceof Y.CustomEvent) {
          //   events[type].broadcast = false;
        // }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1960);
return events[type];
    },

    /**
     * This is the entry point for the event monitoring system.
     * You can monitor 'attach', 'detach', 'fire', and 'publish'.
     * When configured, these events generate an event.  click ->
     * click_attach, click_detach, click_publish -- these can
     * be subscribed to like other events to monitor the event
     * system.  Inividual published events can have monitoring
     * turned on or off (publish can't be turned off before it
     * it published) by setting the events 'monitor' config.
     *
     * @method _monitor
     * @param what {String} 'attach', 'detach', 'fire', or 'publish'
     * @param type {String} Name of the event being monitored
     * @param o {Object} Information about the event interaction, such as
     *                  fire() args, subscription category, publish config
     * @private
     */
    _monitor: function(what, type, o) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "_monitor", 1980);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1981);
var monitorevt, ce = this.getEvent(type);
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1982);
if ((this._yuievt.config.monitored && (!ce || ce.monitored)) || (ce && ce.monitored)) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1983);
monitorevt = type + '_' + what;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1984);
o.monitored = what;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 1985);
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

        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "fire", 2017);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2019);
var typeIncluded = L.isString(type),
            t = (typeIncluded) ? type : (type && type.type),
            ce, ret, pre = this._yuievt.config.prefix, ce2,
            args = (typeIncluded) ? nativeSlice.call(arguments, 1) : arguments;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2024);
t = (pre) ? _getType(t, pre) : t;

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2026);
this._monitor('fire', t, {
            args: args
        });

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2030);
ce = this.getEvent(t, true);
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2031);
ce2 = this.getSibling(t, ce);

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2033);
if (ce2 && !ce) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2034);
ce = this.publish(t);
        }

        // this event has not been published or subscribed to
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2038);
if (!ce) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2039);
if (this._yuievt.hasTargets) {
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2040);
return this.bubble({ type: t }, args, this);
            }

            // otherwise there is nothing to be done
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2044);
ret = true;
        } else {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2046);
ce.sibling = ce2;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2047);
ret = ce.fire.apply(ce, args);
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2050);
return (this._yuievt.chain) ? this : ret;
    },

    getSibling: function(type, ce) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "getSibling", 2053);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2054);
var ce2;
        // delegate to *:type events if there are subscribers
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2056);
if (type.indexOf(PREFIX_DELIMITER) > -1) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2057);
type = _wildType(type);
            // console.log(type);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2059);
ce2 = this.getEvent(type, true);
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2060);
if (ce2) {
                // console.log("GOT ONE: " + type);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2062);
ce2.applyConfig(ce);
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2063);
ce2.bubbles = false;
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2064);
ce2.broadcast = 0;
                // ret = ce2.fire.apply(ce2, a);
            }
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2069);
return ce2;
    },

    /**
     * Returns the custom event of the provided type has been created, a
     * falsy value otherwise
     * @method getEvent
     * @param type {String} the type, or name of the event
     * @param prefixed {String} if true, the type is prefixed already
     * @return {CustomEvent} the custom event or null
     */
    getEvent: function(type, prefixed) {
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "getEvent", 2080);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2081);
var pre, e;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2082);
if (!prefixed) {
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2083);
pre = this._yuievt.config.prefix;
            _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2084);
type = (pre) ? _getType(type, pre) : type;
        }
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2086);
e = this._yuievt.events;
        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2087);
return e[type] || null;
    },

    /**
     * Subscribe to a custom event hosted by this object.  The
     * supplied callback will execute after any listeners add
     * via the subscribe method, and after the default function,
     * if configured for the event, has executed.
     *
     * @method after
     * @param {String} type The name of the event
     * @param {Function} fn The callback to execute in response to the event
     * @param {Object} [context] Override `this` object in callback
     * @param {Any} [arg*] 0..n additional arguments to supply to the subscriber
     * @return {EventHandle} A subscription handle capable of detaching the
     *                       subscription
     */
    after: function(type, fn) {

        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "after", 2104);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2106);
var a = nativeSlice.call(arguments, 0);

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2108);
switch (L.type(type)) {
            case 'function':
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2110);
return Y.Do.after.apply(Y.Do, arguments);
            case 'array':
            //     YArray.each(a[0], function(v) {
            //         v = AFTER_PREFIX + v;
            //     });
            //     break;
            case 'object':
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2117);
a[0]._after = true;
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2118);
break;
            default:
                _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2120);
a[0] = AFTER_PREFIX + type;
        }

        _yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2123);
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
        _yuitest_coverfunc("/build/event-custom-base/event-custom-base.js", "before", 2142);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2143);
return this.on.apply(this, arguments);
    }

};

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2148);
Y.EventTarget = ET;

// make Y an event target
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2151);
Y.mix(Y, ET.prototype);
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2152);
ET.call(Y, { bubbles: false });

_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2154);
YUI.Env.globalEvents = YUI.Env.globalEvents || new ET();

/**
 * Hosts YUI page level events.  This is where events bubble to
 * when the broadcast config is set to 2.  This property is
 * only available if the custom event module is loaded.
 * @property Global
 * @type EventTarget
 * @for YUI
 */
_yuitest_coverline("/build/event-custom-base/event-custom-base.js", 2164);
Y.Global = YUI.Env.globalEvents;

// @TODO implement a global namespace function on Y.Global?

/**
`Y.on()` can do many things:

<ul>
    <li>Subscribe to custom events `publish`ed and `fire`d from Y</li>
    <li>Subscribe to custom events `publish`ed with `broadcast` 1 or 2 and
        `fire`d from any object in the YUI instance sandbox</li>
    <li>Subscribe to DOM events</li>
    <li>Subscribe to the execution of a method on any object, effectively
    treating that method as an event</li>
</ul>

For custom event subscriptions, pass the custom event name as the first argument and callback as the second. The `this` object in the callback will be `Y` unless an override is passed as the third argument.

    Y.on('io:complete', function () {
        Y.MyApp.updateStatus('Transaction complete');
    });

To subscribe to DOM events, pass the name of a DOM event as the first argument
and a CSS selector string as the third argument after the callback function.
Alternately, the third argument can be a `Node`, `NodeList`, `HTMLElement`,
array, or simply omitted (the default is the `window` object).

    Y.on('click', function (e) {
        e.preventDefault();

        // proceed with ajax form submission
        var url = this.get('action');
        ...
    }, '#my-form');

The `this` object in DOM event callbacks will be the `Node` targeted by the CSS
selector or other identifier.

`on()` subscribers for DOM events or custom events `publish`ed with a
`defaultFn` can prevent the default behavior with `e.preventDefault()` from the
event object passed as the first parameter to the subscription callback.

To subscribe to the execution of an object method, pass arguments corresponding to the call signature for 
<a href="../classes/Do.html#methods_before">`Y.Do.before(...)`</a>.

NOTE: The formal parameter list below is for events, not for function
injection.  See `Y.Do.before` for that signature.

@method on
@param {String} type DOM or custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@see Do.before
@for YUI
**/

/**
Listen for an event one time.  Equivalent to `on()`, except that
the listener is immediately detached when executed.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

@see on
@method once
@param {String} type DOM or custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/

/**
Listen for an event one time.  Equivalent to `once()`, except, like `after()`,
the subscription callback executes after all `on()` subscribers and the event's
`defaultFn` (if configured) have executed.  Like `after()` if any `on()` phase
subscriber calls `e.preventDefault()`, neither the `defaultFn` nor the `after()`
subscribers will execute.

The listener is immediately detached when executed.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

@see once
@method onceAfter
@param {String} type The custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [arg*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/

/**
Like `on()`, this method creates a subscription to a custom event or to the
execution of a method on an object.

For events, `after()` subscribers are executed after the event's
`defaultFn` unless `e.preventDefault()` was called from an `on()` subscriber.

See the <a href="#methods_on">`on()` method</a> for additional subscription
options.

NOTE: The subscription signature shown is for events, not for function
injection.  See <a href="../classes/Do.html#methods_after">`Y.Do.after`</a>
for that signature.

@see on
@see Do.after
@method after
@param {String} type The custom event name
@param {Function} fn The callback to execute in response to the event
@param {Object} [context] Override `this` object in callback
@param {Any} [args*] 0..n additional arguments to supply to the subscriber
@return {EventHandle} A subscription handle capable of detaching the
                      subscription
@for YUI
**/


}, '@VERSION@' ,{requires:['oop']});

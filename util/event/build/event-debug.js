/**
 * The YUI event system
 * @module event
 */
YUI.add("event", function(Y) {

    /**
     * Subscribes to the yui:load event, which fires when a Y.use operation
     * is complete.
     * @method ready
     * @param f {Function} the function to execute
     * @param c Optional execution context
     * @param args* 0..n Additional arguments to append 
     * to the signature provided when the event fires.
     * @return {YUI} the YUI instance
     */
    // Y.ready = function(f, c) {
    //     var a = arguments, m = (a.length > 1) ? Y.bind.apply(Y, a) : f;
    //     Y.on("yui:load", m);
    //     return this;
    // };

    /**
     * Attach an event listener, either to a DOM object
     * or to an Event.Target.
     * @param type {string} the event type
     * @param f {Function} the function to execute
     * @param o the Event.Target or element to attach to
     * @param context Optional execution context
     * @param args* 0..n additional arguments to append
     * to the signature provided when the event fires.
     * @method on
     * @for YUI
     * @return {Event.Handle} a handle object for 
     * unsubscribing to this event.
     */
    Y.on = function(type, f, o) {

        if (type.indexOf(':') > -1) {
            var cat = type.split(':');
            switch (cat[0]) {
                default:
                    return Y.subscribe.apply(Y, arguments);
            }
        } else {
            return Y.Event.attach.apply(Y.Event, arguments);
        }

    };

    /**
     * Detach an event listener (either a custom event or a
     * DOM event
     * @method detach
     * @param type the type of event, or a Event.Handle to
     * for the subscription.  If the Event.Handle is passed
     * in, the other parameters are not used.
     * @param f {Function} the subscribed function
     * @param o the object or element the listener is subscribed
     * to.
     * @method detach
     * @return {YUI} the YUI instance
     */
    Y.detach = function(type, f, o) {
        if (Y.Lang.isObject(type) && type.detach) {
            return type.detach();
        } else if (type.indexOf(':') > -1) {
            var cat = type.split(':');
            switch (cat[0]) {
                default:
                    return Y.unsubscribe.apply(Y, arguments);
            }
        } else {
            return Y.Event.detach.apply(Y.Event, arguments);
        }
    };

    /**
     * Executes the callback before a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.
     *
     * For DOM and custom events:
     * type, callback, context, 1-n arguments
     *  
     * For methods:
     * callback, object (method host), methodName, context, 1-n arguments
     *
     * @method before
     * @return unsubscribe handle
     */
    Y.before = function(type, f, o) { 
        // method override
        // callback, object, sMethod
        if (Y.Lang.isFunction(type)) {
            return Y.Do.before.apply(Y.Do, arguments);
        }

        return Y;
    };

    /**
     * Executes the callback after a DOM event, custom event
     * or method.  If the first argument is a function, it
     * is assumed the target is a method.
     *
     * @TODO add event
     *
     * For DOM and custom events:
     * type, callback, context, 1-n arguments
     *  
     * For methods:
     * callback, object (method host), methodName, context, 1-n arguments
     *
     * @method after
     * @return unsubscribe handle
     */
    Y.after = function(type, f, o) {
        if (Y.Lang.isFunction(type)) {
            return Y.Do.after.apply(Y.Do, arguments);
        }

        return Y;
    };

}, "3.0.0", {
    use: [
          "aop", 
          "event-custom", 
          "event-target", 
          "event-ready",
          "event-dom", 
          "event-facade"
          ]
});
/*
 * Method displacement
 * @submodule event-aop
 * @module event
 */
YUI.add("aop", function(Y) {

    var BEFORE = 0,
        AFTER = 1;

    /**
     * Allows for the insertion of methods that are executed before or after
     * a specified method
     * @class Do
     * @static
     */
    Y.Do = {

        /**
         * Cache of objects touched by the utility
         * @property objs
         * @static
         */
        objs: {},

        /**
         * Execute the supplied method before the specified function
         * @method before
         * @param fn {Function} the function to execute
         * @param obj the object hosting the method to displace
         * @param sFn {string} the name of the method to displace
         * @param c The execution context for fn
         * @return {string} handle for the subscription
         * @static
         */
        before: function(fn, obj, sFn, c) {
            var f = fn;
            if (c) {
                var a = [fn, c].concat(Y.Array(arguments, 4, true));
                f = Y.bind.apply(Y, a);
            }

            return this._inject(BEFORE, f, obj, sFn);
        },

        /**
         * Execute the supplied method after the specified function
         * @method after
         * @param fn {Function} the function to execute
         * @param obj the object hosting the method to displace
         * @param sFn {string} the name of the method to displace
         * @param c The execution context for fn
         * @return {string} handle for the subscription
         * @static
         */
        after: function(fn, obj, sFn, c) {
            var f = fn;
            if (c) {
                var a = [fn, c].concat(Y.Array(arguments, 4, true));
                f = Y.bind.apply(Y, a);
            }

            return this._inject(AFTER, f, obj, sFn);
        },

        /**
         * Execute the supplied method after the specified function
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
            var id = Y.stamp(obj);

            if (! this.objs[id]) {
                // create a map entry for the obj if it doesn't exist
                this.objs[id] = {};
            }
            var o = this.objs[id];

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
            var sid = id + Y.stamp(fn) + sFn;

            // register the callback
            o[sFn].register(sid, fn, when);

            return sid;

        },

        /**
         * Detach a before or after subscription
         * @method detach
         * @param sid {string} the subscription handle
         */
        detach: function(sid) {
            delete this.before[sid];
            delete this.after[sid];
        },

        _unload: function(e, me) {

        }
    };

    //////////////////////////////////////////////////////////////////////////

    /**
     * Wrapper for a displaced method with aop enabled
     * @class Do.Method
     * @constructor
     * @param obj The object to operate on
     * @param sFn The name of the method to displace
     */
    Y.Do.Method = function(obj, sFn) {
        this.obj = obj;
        this.methodName = sFn;
        this.method = obj[sFn];
        // this.before = [];
        // this.after = [];
        this.before = {};
        this.after = {};
    };

    /**
     * Register a aop subscriber
     * @method register
     * @param sid {string} the subscriber id
     * @param fn {Function} the function to execute
     * @param when {string} when to execute the function
     */
    Y.Do.Method.prototype.register = function (sid, fn, when) {
        if (when) {
            // this.after.push(fn);
            this.after[sid] = fn;
        } else {
            // this.before.push(fn);
            this.before[sid] = fn;
        }
    };

    /**
     * Execute the wrapped method
     * @method exec
     */
    Y.Do.Method.prototype.exec = function () {

        var args = Y.Array(arguments, 0, true), 
            i, ret, newRet, 
            bf = this.before,
            af = this.after;

        // for (i=0; i<this.before.length; ++i) {
        for (i in bf) {
            if (bf.hasOwnProperty(i)) {
                ret = bf[i].apply(this.obj, args);

                // Stop processing if an Error is returned
                if (ret && ret.constructor == Y.Do.Error) {
                    // this.logger.debug("Error before " + this.methodName + 
                    //      ": " ret.msg);
                    return ret.retVal;
                // Check for altered arguments
                } else if (ret && ret.constructor == Y.Do.AlterArgs) {
                    // this.logger.debug("Params altered before " + 
                    //      this.methodName + ": " ret.msg);
                    args = ret.newArgs;
                }
            }
        }

        // execute method
        ret = this.method.apply(this.obj, args);

        // execute after methods.
        // for (i=0; i<this.after.length; ++i) {
        for (i in af) {
            if (af.hasOwnProperty(i)) {
                newRet = af[i].apply(this.obj, args);
                // Stop processing if an Error is returned
                if (newRet && newRet.constructor == Y.Do.Error) {
                    // this.logger.debug("Error after " + this.methodName + 
                    //      ": " ret.msg);
                    return newRet.retVal;
                // Check for a new return value
                } else if (newRet && newRet.constructor == Y.Do.AlterReturn) {
                    // this.logger.debug("Return altered after " + 
                    //      this.methodName + ": " newRet.msg);
                    ret = newRet.newRetVal;
                }
            }
        }

        return ret;
    };

    //////////////////////////////////////////////////////////////////////////

    /**
     * Return an Error object when you want to terminate the execution
     * of all subsequent method calls
     * @class Do.Error
     */
    Y.Do.Error = function(msg, retVal) {
        this.msg = msg;
        this.retVal = retVal;
    };

    /**
     * Return an AlterArgs object when you want to change the arguments that
     * were passed into the function.  An example would be a service that scrubs
     * out illegal characters prior to executing the core business logic.
     * @class Do.AlterArgs
     */
    Y.Do.AlterArgs = function(msg, newArgs) {
        this.msg = msg;
        this.newArgs = newArgs;
    };

    /**
     * Return an AlterReturn object when you want to change the result returned
     * from the core method to the caller
     * @class Do.AlterReturn
     */
    Y.Do.AlterReturn = function(msg, newRetVal) {
        this.msg = msg;
        this.newRetVal = newRetVal;
    };

    //////////////////////////////////////////////////////////////////////////

// Y["Event"] && Y.Event.addListener(window, "unload", Y.Do._unload, Y.Do);

}, "3.0.0");
/*
 * YUI Custom Events
 * @submodule event-custom
 * @module event
 */
YUI.add("event-custom", function(Y) {

    var onsubscribeType = "_event:onsub",

        AFTER = 'after', 

        CONFIGS = [

            'broadcast',

            'bubbles',

            'context',

            'configured',

            'currentTarget',

            'defaultFn',

            'details',

            'emitFacade',

            'fireOnce',

            'host',

            'preventable',

            'preventedFn',

            'queuable',

            'silent',

            'stoppedFn',

            'target',

            'type'

        ];

    /**
     * Return value from all subscribe operations
     * @class Event.Handle
     * @constructor
     * @param evt {Event.Custom} the custom event
     * @param sub {Event.Subscriber} the subscriber
     */
    Y.EventHandle = function(evt, sub) {

        /**
         * The custom event
         * @type Event.Custom
         */
        this.evt = evt;

        /**
         * The subscriber object
         * @type Event.Subscriber
         */
        this.sub = sub;
    };

    Y.EventHandle.prototype = {
        /**
         * Detaches this subscriber
         * @method detach
         */
        detach: function() {
            this.evt._delete(this.sub);
        }
    };

    /**
     * The Event.Custom class lets you define events for your application
     * that can be subscribed to by one or more independent component.
     *
     * @param {String}  type The type of event, which is passed to the callback
     *                  when the event fires
     * @param {Object}  context The context the event will fire from.  "this" will
     *                  refer to this object in the callback.  Default value: 
     *                  the window object.  The listener can override this.
     * @param {boolean} silent pass true to prevent the event from writing to
     *                  the debug system
     * @class Event.Custom
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

        this.logSystem = (type == "yui:log");

        /**
         * If 0, this event does not broadcast.  If 1, the YUI instance is notified
         * every time this event fires.  If 2, the YUI instance and the YUI global
         * (if event is enabled on the global) are notified every time this event
         * fires.
         * @property broadcast
         * @type int
         */
        this.broadcast = 0;

        /**
         * By default all custom events are logged in the debug build, set silent
         * to true to disable debug outpu for this event.
         * @property silent
         * @type boolean
         */
        this.silent = this.logSystem;

        // this.queuable = !(this.logSystem);
        this.queuable = false;

        /**
         * The subscribers to this event
         * @property subscribers
         * @type Event.Subscriber{}
         */
        this.subscribers = {};

        /*
         * The publisher has configured this event
         * @property configured
         * @type boolean
         * @default true
         */
        // this.configured = true;

        /**
         * 'After' subscribers
         * @property afters
         * @type Event.Subscriber{}
         */
        this.afters = {};

        /**
         * This event has fired if true
         *
         * @property fired
         * @type boolean
         * @default false;
         */
        this.fired = false;

        /**
         * This event should only fire one time if true, and if
         * it has fired, any new subscribers should be notified
         * immediately.
         *
         * @property fireOnce
         * @type boolean
         * @default false;
         */
        this.fireOnce = false;

        /**
         * Flag for stopPropagation that is modified during fire()
         * 1 means to stop propagation to bubble targets.  2 means
         * to also stop additional subscribers on this target.
         * @property stopped
         * @type int
         */
        this.stopped = 0;

        /**
         * Flag for preventDefault that is modified during fire().
         * if it is not 0, the default behavior for this event
         * @property prevented
         * @type int
         */
        this.prevented = 0;

        /**
         * Specifies the host for this custom event.  This is used
         * to enable event bubbling
         * @property host
         * @type Event.Target
         */
        this.host = null;

        /**
         * The default function to execute after event listeners
         * have fire, but only if the default action was not
         * prevented.
         * @property defaultFn
         * @type Function
         */
        this.defaultFn = null;

        /**
         * The function to execute if a subscriber calls
         * stopPropagation or stopImmediatePropagation
         * @property stoppedFn
         * @type Function
         */
        this.stoppedFn = null;

        /**
         * The function to execute if a subscriber calls
         * preventDefault
         * @property preventedFn
         * @type Function
         */
        this.preventedFn = null;

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
         * @property bubbles
         * @type boolean
         * @default true
         */
        this.bubbles = true;

        this.emitFacade = false;

        this.applyConfig(o, true);

        this.log("Creating " + this.type);

        // Only add subscribe events for events that are not generated by 
        // Event.Custom
        if (type !== onsubscribeType) {

            /**
             * Custom events provide a custom event that fires whenever there is
             * a new subscriber to the event.  This provides an opportunity to
             * handle the case where there is a non-repeating event that has
             * already fired has a new subscriber.  
             *
             * @event subscribeEvent
             * @type Y.Event.Custom
             * @param {Function} fn The function to execute
             * @param {Object}   obj An object to be passed along when the event 
             *                       fires
             * @param {boolean|Object}  override If true, the obj passed in becomes 
             *                                   the execution context of the listener.
             *                                   if an object, that object becomes the
             *                                   the execution context.
             */
            this.subscribeEvent = new Y.CustomEvent(onsubscribeType, {
                    context: this,
                    silent: true
                });
        } 

    };

    Y.CustomEvent.prototype = {

        _YUI_EVENT: true,

        /**
         * Apply configuration properties.  Only applies the CONFIG whitelist
         * @method applyConfig
         * @param o hash of properties to apply
         * @param force {boolean} if true, properties that exist on the event 
         * will be overwritten.
         */
        applyConfig: function(o, force) {
            if (o) {
                Y.mix(this, o, force, CONFIGS);
            }
        },

        _subscribe: function(fn, obj, args, when) {

            if (!fn) {
                Y.fail("Invalid callback for CE: " + this.type);
            }

            var se = this.subscribeEvent;
            if (se) {
                se.fire.apply(se, args);
            }

            var s = new Y.Subscriber(fn, obj, args, when);


            if (this.fireOnce && this.fired) {

                // this._notify(s);
                // setTimeout(Y.bind(this._notify, this, s), 0);
                Y.later(0, this, this._notify, s);
            }

            if (when == AFTER) {
                this.afters[s.id] = s;
            } else {
                this.subscribers[s.id] = s;
            }

            return new Y.EventHandle(this, s);

        },

        /**
         * Listen for this event
         * @method subscribe
         * @param {Function} fn        The function to execute
         * @param {Object}   obj       An object to be passed along when the event fires
         * @param args* 1..n params to provide to the listener
         * @return {Event.Handle} unsubscribe handle
         */
        subscribe: function(fn, obj) {
            return this._subscribe(fn, obj, Y.Array(arguments, 2, true));
        },

        /**
         * Listen for this event after the normal subscribers have been notified and
         * the default behavior has been applied.  If a normal subscriber prevents the 
         * default behavior, it also prevents after listeners from firing.
         * @method after
         * @param {Function} fn        The function to execute
         * @param {Object}   obj       An object to be passed along when the event fires
         * @param args* 1..n params to provide to the listener
         * @return {Event.Handle} unsubscribe handle
         */
        after: function(fn, obj) {
            return this._subscribe(fn, obj, Y.Array(arguments, 2, true), AFTER);
        },

        /**
         * Unsubscribes subscribers.
         * @method unsubscribe
         * @param {Function} fn  The subscribed function to remove, if not supplied
         *                       all will be removed
         * @param {Object}   obj  The custom object passed to subscribe.  This is
         *                        optional, but if supplied will be used to
         *                        disambiguate multiple listeners that are the same
         *                        (e.g., you subscribe many object using a function
         *                        that lives on the prototype)
         * @return {boolean} True if the subscriber was found and detached.
         */
        unsubscribe: function(fn, obj) {

            // if arg[0] typeof unsubscribe handle
            if (fn && fn.detach) {
                return fn.detach();
            }

            if (!fn) {
                return this.unsubscribeAll();
            }

            var found = false, subs = this.subscribers;
            for (var i in subs) {
                if (subs.hasOwnProperty(i)) {
                    var s = subs[i];
                    if (s && s.contains(fn, obj)) {
                        this._delete(s);
                        found = true;
                    }
                }
            }

            return found;
        },

        _getFacade: function(args) {

            var ef = this._facade;

            if (!ef) {
                ef = new Y.Event.Facade(this, this.currentTarget);
            }

            // if the first argument is an object literal, apply the
            // properties to the event facade
            var o = args && args[0];
            if (Y.Lang.isObject(o, true) && !o._yuifacade) {
                Y.mix(ef, o, true);
            }

            // update the details field with the arguments
            ef.details = this.details;
            ef.target = this.target;
            ef.currentTarget = this.currentTarget;
            ef.stopped = 0;
            ef.prevented = 0;

            this._facade = ef;

            return this._facade;
        },

        /**
         * Notify a single subscriber
         * @method _notify
         * @param s {Event.Subscriber} the subscriber
         * @param args {Array} the arguments array to apply to the listener
         * @private
         */
        _notify: function(s, args, ef) {

            this.log(this.type + "->" + ": " +  s);

            var ret;

            // emit an Event.Facade if this is that sort of event
            // if (this.emitFacade && (!args[0] || !args[0]._yuifacade)) {
            if (this.emitFacade) {

                // @TODO object literal support to fire makes it possible for
                // config info to be passed if we wish.
                
                if (!ef) {
                    ef = this._getFacade(args);
                }

                // args[0] = ef;
            }
             
            ret = s.notify(this.context, args);

            if (false === ret || this.stopped > 1) {
                this.log(this.type + " cancelled by subscriber");
                return false;
            }

            return true;
        },

        /**
         * Logger abstraction to centralize the application of the silent flag
         * @method log
         * @param msg {string} message to log
         * @param cat {string} log category
         */
        log: function(msg, cat) {
            var es = Y.Env._eventstack, s =  es && es.silent;
            // if (!s && !this.silent) {
            if (!this.silent) {
                Y.log(msg, cat || "info", "event");
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
         *                   true otherwise
         */
        fire: function() {

            var es = Y.Env._eventstack;

            if (es) {

                // var b = this.bubbles, h = this.host;
                // if (b && h) {
                //     b = (h._yuievt.targets.length);
                // }

                // es.silent = (es.silent || this.silent);

                // queue this event if the current item in the queue bubbles
                // if (b && this.queuable && this.type != es.next.type) {
                if (this.queuable && this.type != es.next.type) {

                    this.log('queue ' + this.type);

                    es.queue.push([this, arguments]);
                    return true;
                }

            } else {

                Y.Env._eventstack = {
                   // id of the first event in the stack
                   id: this.id,
                   next: this,
                   silent: this.silent,
                   logging: (this.type === 'yui:log'),
                   stopped: 0,
                   prevented: 0,
                   queue: []
                };

                es = Y.Env._eventstack;
            }

            var ret = true;

            if (this.fireOnce && this.fired) {

                this.log('fireOnce event: ' + this.type + ' already fired');

            } else {

                // var subs = this.subscribers.slice(), len=subs.length,
                var subs = Y.merge(this.subscribers), s,
                           args=Y.Array(arguments, 0, true), i;

                this.stopped = 0;
                this.prevented = 0;
                this.target = this.target || this.host;

                this.currentTarget = this.host || this.currentTarget;

                this.fired = true;
                this.details = args;

                // this.log("Firing " + this  + ", " + "args: " + args);
                this.log("Firing " + this.type);

                var hasSub = false;
                es.lastLogState = es.logging;


                var ef = null;
                if (this.emitFacade) {
                    ef = this._getFacade(args);
                    args[0] = ef;
                }

                for (i in subs) {
                    if (subs.hasOwnProperty(i)) {

                        if (!hasSub) {
                            es.logging = (es.logging || (this.type === 'yui:log'));
                            hasSub = true;
                        }

                        // stopImmediatePropagation
                        if (this.stopped == 2) {
                            break;
                        }

                        s = subs[i];
                        if (s && s.fn) {
                            ret = this._notify(s, args, ef);
                            if (false === ret) {
                                this.stopped = 2;
                            }
                        }
                    }
                }

                es.logging = (es.lastLogState);

                // bubble if this is hosted in an event target and propagation has not been stopped
                // @TODO check if we need to worry about defaultFn order
                if (this.bubbles && this.host && !this.stopped) {
                    es.stopped = 0;
                    es.prevented = 0;
                    ret = this.host.bubble(this);

                    this.stopped = Math.max(this.stopped, es.stopped);
                    this.prevented = Math.max(this.prevented, es.prevented);
                }

                // execute the default behavior if not prevented
                // @TODO need context
                if (this.defaultFn && !this.prevented) {
                    this.defaultFn.apply(this.host || this, args);
                }

                // process after listeners.  If the default behavior was
                // prevented, the after events don't fire.
                if (!this.prevented && this.stopped < 2) {
                    subs = Y.merge(this.afters);
                    for (i in subs) {
                        if (subs.hasOwnProperty(i)) {

                            if (!hasSub) {
                                es.logging = (es.logging || (this.type === 'yui:log'));
                                hasSub = true;
                            }

                            // stopImmediatePropagation
                            if (this.stopped == 2) {
                                break;
                            }

                            s = subs[i];
                            if (s && s.fn) {
                                ret = this._notify(s, args, ef);
                                if (false === ret) {
                                    this.stopped = 2;
                                }
                            }
                        }
                    }
                }
            }

            if (es.id === this.id) {
// console.log('clearing stack: ' + es.id + ', ' + this);

// reset propragation properties while processing the rest of the queue

// process queued events
                var queue = es.queue;

                while (queue.length) {
                    // q[0] = the event, q[1] = arguments to fire
                    var q = queue.pop(), ce = q[0];

// Y.log('firing queued event ' + ce.type + ', from ' + this);
                    es.stopped = 0;
                    es.prevented = 0;
                    
// set up stack to allow the next item to be processed
                    es.next = ce;

                    ret = ce.fire.apply(ce, q[1]);
                }

                Y.Env._eventstack = null;
            } 

            return (ret !== false);
        },

        /**
         * Removes all listeners
         * @method unsubscribeAll
         * @return {int} The number of listeners unsubscribed
         */
        unsubscribeAll: function() {
            var subs = this.subscribers, i;
            for (i in subs) {
                if (subs.hasOwnProperty(i)) {
                    this._delete(subs[i]);
                }
            }

            this.subscribers={};

            return i;
        },

        /**
         * @method _delete
         * @param subscriber object
         * @private
         */
        _delete: function(s) {

            if (s) {
                delete s.fn;
                delete s.obj;
                delete this.subscribers[s.id];
                delete this.afters[s.id];
            }

        },

        /**
         * @method toString
         */
        toString: function() {
             // return "{ CE '" + this.type + "' " + "id: " + this.id +
                  // ", host: " + (this.host && Y.stamp(this.host) + " }");
             return this.type;
        },

        /**
         * Stop propagation to bubble targets
         * @method stopPropagation
         */
        stopPropagation: function() {
            this.stopped = 1;
            Y.Env._eventstack.stopped = 1;
            if (this.stoppedFn) {
                this.stoppedFn.call(this.host || this, this);
            }
        },

        /**
         * Stops propagation to bubble targets, and prevents any remaining
         * subscribers on the current target from executing.
         * @method stopImmediatePropagation
         */
        stopImmediatePropagation: function() {
            this.stopped = 2;
            Y.Env._eventstack.stopped = 2;
            if (this.stoppedFn) {
                this.stoppedFn.call(this.host || this, this);
            }
        },

        /**
         * Prevents the execution of this event's defaultFn
         * @method preventDefault
         */
        preventDefault: function() {
            if (this.preventable) {
                this.prevented = 1;
                Y.Env._eventstack.prevented = 1;
            }
            if (this.preventedFn) {
                this.preventedFn.call(this.host || this, this);
            }
        }

    };

    /////////////////////////////////////////////////////////////////////

    /**
     * Stores the subscriber information to be used when the event fires.
     * @param {Function} fn       The wrapped function to execute
     * @param {Object}   obj      An object to be passed along when the event fires
     * @param {Array} args        subscribe() additional arguments
     *
     * @class Event.Subscriber
     * @constructor
     */
    Y.Subscriber = function(fn, obj, args) {

        /**
         * The callback that will be execute when the event fires
         * This is wrapped by Y.bind if obj was supplied.
         * @property fn
         * @type Function
         */
        this.fn = fn;

        /**
         * An optional custom object that will passed to the callback when
         * the event fires
         * @property obj
         * @type Object
         */
        this.obj = obj;

        /**
         * Unique subscriber id
         * @property id
         * @type String
         */
        this.id = Y.stamp(this);

        /**
         * Optional additional arguments supplied to subscribe().  If present,
         * these will be appended to the arguments supplied to fire()
         * @property args
         * @type Array
         */
        // this.args = args;

        var m = fn;
        
        if (obj) {
            var a = (args) ? Y.Array(args) : [];
            a.unshift(fn, obj);
            m = Y.bind.apply(Y, a);
        }
        
        /**
         * }
         * fn bound to obj with additional arguments applied via Y.bind
         * @property wrappedFn
         * @type Function
         */
        this.wrappedFn = m;

    };

    Y.Subscriber.prototype = {

        /**
         * Executes the subscriber.
         * @method notify
         * @param defaultContext The execution context if not overridden
         * by the subscriber
         * @param args {Array} Arguments array for the subscriber
         */
        notify: function(defaultContext, args) {
            var c = this.obj || defaultContext, ret = true;

            try {
                ret = this.wrappedFn.apply(c, args);
            } catch(e) {
                Y.fail(this + ' failed: ' + e.message, e);
            }

            return ret;
        },

        /**
         * Returns true if the fn and obj match this objects properties.
         * Used by the unsubscribe method to match the right subscriber.
         *
         * @method contains
         * @param {Function} fn the function to execute
         * @param {Object} obj an object to be passed along when the event fires
         * @return {boolean} true if the supplied arguments match this 
         *                   subscriber's signature.
         */
        contains: function(fn, obj) {
            if (obj) {
                return ((this.fn == fn) && this.obj == obj);
            } else {
                return (this.fn == fn);
            }
        },

        /**
         * @method toString
         */
        toString: function() {
            return "Subscriber " + this.id;
        }
    };

}, "3.0.0");
/*
 * Configures an object to be able to be targeted for events, and to publish events
 * @submodule event-target
 * @module event
 */
YUI.add("event-target", function(Y) {

    var SILENT = { 'yui:log': true };

    /**
     * Event.Target is designed to be used with Y.augment to wrap 
     * Event.Custom in an interface that allows events to be subscribed to 
     * and fired by name.  This makes it possible for implementing code to
     * subscribe to an event that either has not been created yet, or will
     * not be created at all.
     *
     * @Class Event.Target
     */
    Y.EventTarget = function(opts) { 

        // console.log('Event.Target constructor executed: ' + this._yuid);

        var o = (Y.Lang.isObject(opts)) ? opts : {};

        this._yuievt = {

            events: {},

            targets: {},

            config: o,

            defaults: {
                context: this, 
                host: this,
                emitFacade: o.emitFacade || false,
                bubbles: ('bubbles' in o) ? o.bubbles : true
            }
            
        };

    };

    var ET = Y.EventTarget;

    ET.prototype = {

        /**
         * Subscribe to a custom event hosted by this object
         * @method subscribe
         * @param type    {string}   The type of the event
         * @param fn {Function} The callback
         * @param context The execution context
         * @param args* 1..n params to supply to the callback
         */
        subscribe: function(type, fn, context) {

            var ce = this._yuievt.events[type] || 
                // this.publish(type, {
                //     configured: false
                // }),
                this.publish(type),
                a = Y.Array(arguments, 1, true);

            return ce.subscribe.apply(ce, a);

        },

        /**
         * Unsubscribes one or more listeners the from the specified event
         * @method unsubscribe
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
         * @return {boolean} true if the subscriber was found and detached.
         */
        unsubscribe: function(type, fn, context) {

            // If this is an event handle, use it to detach
            if (Y.Lang.isObject(type) && type.detach) {
                return type.detach();
            }

            var evts = this._yuievt.events;

            if (type) {
                var ce = evts[type];
                if (ce) {
                    return ce.unsubscribe(fn, context);
                }
            } else {
                var ret = true;
                for (var i in evts) {
                    if (Y.Object.owns(evts, i)) {
                        ret = ret && evts[i].unsubscribe(fn, context);
                    }
                }
                return ret;
            }

            return false;
        },
        
        /**
         * Removes all listeners from the specified event.  If the event type
         * is not specified, all listeners from all hosted custom events will
         * be removed.
         * @method unsubscribeAll
         * @param type {string}   The type, or name of the event
         */
        unsubscribeAll: function(type) {
            return this.unsubscribe(type);
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
         *   'fireOnce': if an event is configured to fire once, new subscribers after
         *   the fire will be notified immediately.
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
         *    <li>
         *   'type': the event type (valid option if not provided as the first parameter to publish)
         *    </li>
         *  </ul>
         *
         *  @return {Event.Custom} the custom event
         *
         */
        publish: function(type, opts) {

            var events = this._yuievt.events, ce = events[type];

            //if (ce && !ce.configured) {
            if (ce) {
Y.log("publish applying config to published event: '"+type+"' exists", 'info', 'event');

                // This event could have been published
                ce.applyConfig(opts, true);
                // ce.configured = true;

            } else {
                var o = opts || {};

                // apply defaults
                Y.mix(o, this._yuievt.defaults);

                ce = new Y.CustomEvent(type, o);

                events[type] = ce;

                if (o.onSubscribeCallback) {
                    ce.subscribeEvent.subscribe(o.onSubscribeCallback);
                }

            }

            return events[type];
        },

        /**
         * Registers another Event.Target as a bubble target.  Bubble order
         * is determined by the order registered.  Multiple targets can
         * be specified.
         * @method addTarget
         * @param o {Event.Target} the target to add
         */
        addTarget: function(o) {
            this._yuievt.targets[Y.stamp(o)] = o;
            this._yuievt.hasTargets = true;
        },

        /**
         * Removes a bubble target
         * @method removeTarget
         * @param o {Event.Target} the target to remove
         */
        removeTarget: function(o) {
            delete this._yuievt.targets[Y.stamp(o)];
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
         * @method fire
         * @param type {String|Object} The type of the event, or an object that contains
         * a 'type' property.
         * @param arguments {Object*} an arbitrary set of parameters to pass to 
         * the handler.
         * @return {boolean} the return value from Event.Custom.fire
         *                   
         */
        fire: function(type) {

            var typeIncluded = Y.Lang.isString(type),
                t = (typeIncluded) ? type : (type && type.type);

            var ce = this.getEvent(t);

            // this event has not been published or subscribed to
            if (!ce) {
                
                // if this object has bubble targets, we need to publish the
                // event in order for it to bubble.
                if (this._yuievt.hasTargets) {
                    // ce = this.publish(t, {
                    //     configured: false
                    // });
                    ce = this.publish(t);
                    ce.details = Y.Array(arguments, (typeIncluded) ? 1 : 0, true);

                    return this.bubble(ce);
                }

                // otherwise there is nothing to be done
                return true;
            }

            // Provide this object's subscribers the object they are listening to.
            // ce.currentTarget = this;

            // This this the target unless target is current not null
            // (set in bubble()).
            // ce.target = ce.target || this;

            var a = Y.Array(arguments, (typeIncluded) ? 1 : 0, true);
            var ret = ce.fire.apply(ce, a);

            // clear target for next fire()
            ce.target = null;

            return ret;
        },

        /**
         * Returns the custom event of the provided type has been created, a
         * falsy value otherwise
         * @method getEvent
         * @param type {string} the type, or name of the event
         * @return {Event.Custom} the custom event or null
         */
        getEvent: function(type) {
            var e = this._yuievt.events;
            return (e && type in e) ? e[type] : null;
        },

        /**
         * Propagate an event
         * @method bubble
         * @param evt {Event.Custom} the custom event to propagate
         * @return {boolean} the aggregated return value from Event.Custom.fire
         */
        bubble: function(evt) {

            var targs = this._yuievt.targets, ret = true;

            if (!evt.stopped && targs) {

                // Y.log('Bubbling ' + evt.type);

                for (var i in targs) {
                    if (targs.hasOwnProperty(i)) {

                        var t = targs[i], type = evt.type,
                            ce = t.getEvent(type), targetProp = evt.target || this;
                            
                        // if this event was not published on the bubble target,
                        // publish it with sensible default properties
                        if (!ce) {

                            // publish the event on the bubble target using this event
                            // for its configuration
                            ce = t.publish(type, evt);
                            // ce.configured = false;

                            // set the host and context appropriately
                            ce.context = (evt.host === evt.context) ? t : evt.context;
                            ce.host = t;

                            // clear handlers if specified on this event
                            ce.defaultFn = null;
                            ce.preventedFn = null;
                            ce.stoppedFn = null;
                        }

                        ce.target = targetProp;
                        ce.currentTarget = t;

                        // ce.target = evt.target;

                        ret = ret && ce.fire.apply(ce, evt.details);

                        // stopPropagation() was called
                        if (ce.stopped) {
                            break;
                        }
                    }
                }
            }

            return ret;
        },

        /**
         * Subscribe to a custom event hosted by this object.  The
         * supplied callback will execute after any listeners add
         * via the subscribe method, and after the default function,
         * if configured for the event, has executed.
         * @method after
         * @param type    {string}   The type of the event
         * @param fn {Function} The callback
         * @param context The execution context
         * @param args* 1..n params to supply to the callback
         */
        after: function(type, fn) {
            var ce = this._yuievt.events[type] || 
                // this.publish(type, {
                //     configured: false
                // }),
                this.publish(type),
                a = Y.Array(arguments, 1, true);

            return ce.after.apply(ce, a);
        }

    };

    // make Y an event target
    Y.mix(Y, ET.prototype, false, false, { 
        bubbles: false 
    });
    ET.call(Y);


}, "3.0.0");
/*
 * DOMReady
 * @submodule event-ready
 * @module event
 */
YUI.add("event-ready", function(Y) {

    if (Y === YUI) {
        return;
    }

    var env = YUI.Env, C = Y.config, D = C.doc, POLL_INTERVAL = C.pollInterval || 20;

    if (!env._ready) {

        env._ready = function() {
            if (!env.DOMReady) {
                env.DOMReady=true;

                // Fire the content ready custom event
                // E.DOMReadyEvent.fire();

                // Remove the DOMContentLoaded (FF/Opera)

                if (D.removeEventListener) {
                    D.removeEventListener("DOMContentLoaded", env._ready, false);
                }
            }
        };

        // create custom event

        /////////////////////////////////////////////////////////////
        // DOMReady
        // based on work by: Dean Edwards/John Resig/Matthias Miller 

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (Y.UA.ie) {

            env._dri = setInterval(function() {
                var n = D.createElement('p');  
                try {
                    // throws an error if doc is not ready
                    n.doScroll('left');
                    clearInterval(env._dri);
                    env._dri = null;
                    env._ready();
                    n = null;
                } catch (ex) { 
                    n = null;
                }
            }, POLL_INTERVAL); 

        
        // The document's readyState in Safari currently will
        // change to loaded/complete before images are loaded.
        } else if (Y.UA.webkit && Y.UA.webkit < 525) {

            env._dri = setInterval(function() {
                var rs=D.readyState;
                if ("loaded" == rs || "complete" == rs) {
                    clearInterval(env._dri);
                    env._dri = null;
                    env._ready();
                }
            }, POLL_INTERVAL); 

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {
            D.addEventListener("DOMContentLoaded", env._ready, false);
        }

        /////////////////////////////////////////////////////////////

    }

    Y.publish('event:ready', {
        fireOnce: true
    });

    var yready = function() {
        Y.fire('event:ready');
    };

    if (env.DOMReady) {
        yready();
    } else {
        Y.before(yready, env, "_ready");
    }


}, "3.0.0");
/*
 * The YUI DOM event system
 * @submodule event-dom
 * @module event
 */
YUI.add("event-dom", function(Y) {

    /*
     * The Event Utility provides utilities for managing DOM Events and tools
     * for building event systems
     *
     * @module event
     * @title Event Utility
     */

    /**
     * The event utility provides functions to add and remove event listeners,
     * event cleansing.  It also tries to automatically remove listeners it
     * registers during the unload event.
     *
     * @class Event
     * @static
     */
        Y.Event = function() {

            /**
             * True after the onload event has fired
             * @property loadComplete
             * @type boolean
             * @static
             * @private
             */
            var loadComplete =  false;

            /**
             * The number of times to poll after window.onload.  This number is
             * increased if additional late-bound handlers are requested after
             * the page load.
             * @property _retryCount
             * @static
             * @private
             */
            var _retryCount = 0;

            /**
             * onAvailable listeners
             * @property _avail
             * @static
             * @private
             */
            var _avail = [];

            /**
             * Custom event wrappers for DOM events.  Key is 
             * 'event:' + Element uid stamp + event type
             * @property _wrappers
             * @type Y.Event.Custom
             * @static
             * @private
             */
            var _wrappers = {};

            var _windowLoadKey = null;

            /**
             * Custom event wrapper map DOM events.  Key is 
             * Element uid stamp.  Each item is a hash of custom event
             * wrappers as provided in the _wrappers collection.  This
             * provides the infrastructure for getListeners.
             * @property _el_events
             * @static
             * @private
             */
            var _el_events = {};

            return {

                /**
                 * The number of times we should look for elements that are not
                 * in the DOM at the time the event is requested after the document
                 * has been loaded.  The default is 2000@amp;20 ms, so it will poll
                 * for 40 seconds or until all outstanding handlers are bound
                 * (whichever comes first).
                 * @property POLL_RETRYS
                 * @type int
                 * @static
                 * @final
                 */
                POLL_RETRYS: 2000,

                /**
                 * The poll interval in milliseconds
                 * @property POLL_INTERVAL
                 * @type int
                 * @static
                 * @final
                 */
                POLL_INTERVAL: 20,

                /**
                 * addListener/removeListener can throw errors in unexpected scenarios.
                 * These errors are suppressed, the method returns false, and this property
                 * is set
                 * @property lastError
                 * @static
                 * @type Error
                 */
                lastError: null,


                /**
                 * poll handle
                 * @property _interval
                 * @static
                 * @private
                 */
                _interval: null,

                /**
                 * document readystate poll handle
                 * @property _dri
                 * @static
                 * @private
                 */
                 _dri: null,

                /**
                 * True when the document is initially usable
                 * @property DOMReady
                 * @type boolean
                 * @static
                 */
                DOMReady: false,

                /**
                 * @method startInterval
                 * @static
                 * @private
                 */
                startInterval: function() {
                    if (!this._interval) {
this._interval = setInterval(Y.bind(this._tryPreloadAttach, this), this.POLL_INTERVAL);
                    }
                },

                /**
                 * Executes the supplied callback when the item with the supplied
                 * id is found.  This is meant to be used to execute behavior as
                 * soon as possible as the page loads.  If you use this after the
                 * initial page load it will poll for a fixed time for the element.
                 * The number of times it will poll and the frequency are
                 * configurable.  By default it will poll for 10 seconds.
                 *
                 * <p>The callback is executed with a single parameter:
                 * the custom object parameter, if provided.</p>
                 *
                 * @method onAvailable
                 *
                 * @param {string||string[]}   id the id of the element, or an array
                 * of ids to look for.
                 * @param {function} fn what to execute when the element is found.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to fn.
                 * @param {boolean|object}  p_override If set to true, fn will execute
                 *                   in the context of p_obj, if set to an object it
                 *                   will execute in the context of that object
                 * @param checkContent {boolean} check child node readiness (onContentReady)
                 * @static
                 */
                // @TODO fix arguments
                onAvailable: function(id, fn, p_obj, p_override, checkContent) {

                    // var a = (Y.Lang.isString(id)) ? [id] : id;
                    var a = Y.Array(id);

                    for (var i=0; i<a.length; i=i+1) {
                        _avail.push({ id:         a[i], 
                                      fn:         fn, 
                                      obj:        p_obj, 
                                      override:   p_override, 
                                      checkReady: checkContent });
                    }
                    _retryCount = this.POLL_RETRYS;
                    // this.startInterval();
                    // this._tryPreloadAttach();

                    // We want the first test to be immediate, but async
                    setTimeout(Y.bind(this._tryPreloadAttach, this), 0);
                },

                /**
                 * Works the same way as onAvailable, but additionally checks the
                 * state of sibling elements to determine if the content of the
                 * available element is safe to modify.
                 *
                 * <p>The callback is executed with a single parameter:
                 * the custom object parameter, if provided.</p>
                 *
                 * @method onContentReady
                 *
                 * @param {string}   id the id of the element to look for.
                 * @param {function} fn what to execute when the element is ready.
                 * @param {object}   p_obj an optional object to be passed back as
                 *                   a parameter to fn.
                 * @param {boolean|object}  p_override If set to true, fn will execute
                 *                   in the context of p_obj.  If an object, fn will
                 *                   exectute in the context of that object
                 *
                 * @static
                 */
                // @TODO fix arguments
                onContentReady: function(id, fn, p_obj, p_override) {
                    this.onAvailable(id, fn, p_obj, p_override, true);
                },

                /**
                 * Executes the supplied callback when the DOM is first usable.  This
                 * will execute immediately if called after the DOMReady event has
                 * fired.   @todo the DOMContentReady event does not fire when the
                 * script is dynamically injected into the page.  This means the
                 * DOMReady custom event will never fire in FireFox or Opera when the
                 * library is injected.  It _will_ fire in Safari, and the IE 
                 * implementation would allow for us to fire it if the defered script
                 * is not available.  We want this to behave the same in all browsers.
                 * Is there a way to identify when the script has been injected 
                 * instead of included inline?  Is there a way to know whether the 
                 * window onload event has fired without having had a listener attached 
                 * to it when it did so?
                 *
                 * <p>The callback is a Event.Custom, so the signature is:</p>
                 * <p>type &lt;string&gt;, args &lt;array&gt;, customobject &lt;object&gt;</p>
                 * <p>For DOMReady events, there are no fire argments, so the
                 * signature is:</p>
                 * <p>"DOMReady", [], obj</p>
                 *
                 *
                 * @method onDOMReady
                 *
                 * @param {function} fn what to execute when the element is found.
                 * @optional context execution context
                 * @optional args 1..n arguments to send to the listener
                 *
                 * @static
                 */
                onDOMReady: function(fn) {
                    // var ev = Y.Event.DOMReadyEvent;
                    // ev.subscribe.apply(ev, arguments);
                    var a = Y.Array(arguments, 0, true);
                    a.unshift('event:ready');
                    Y.on.apply(Y, a);
                },

                /**
                 * Appends an event handler
                 *
                 * @method addListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to assign the 
                 *  listener to.
                 * @param {String}   type     The type of event to append
                 * @param {Function} fn        The method the event invokes
                 * @param {Object}   obj    An arbitrary object that will be 
                 *                             passed as a parameter to the handler
                 * @param {Boolean|object}  args 1..n ar
                 * @return {Boolean} True if the action was successful or defered,
                 *                        false if one or more of the elements 
                 *                        could not have the listener attached,
                 *                        or if the operation throws an exception.
                 * @static
                 */
                addListener: function(el, type, fn, obj) {

                    // Y.log('addListener: ' + Y.Lang.dump(Y.Array(arguments, 0, true), 1));

                    var a=Y.Array(arguments, 1, true), override = a[3], E = Y.Event,
                        aa=Y.Array(arguments, 0, true);

                    if (!fn || !fn.call) {
    // throw new TypeError(type + " addListener call failed, callback undefined");
    Y.log(type + " addListener call failed, invalid callback", "error", "event");
                        return false;
                    }

                    // The el argument can be an array of elements or element ids.
                    if (this._isValidCollection(el)) {

                        // Y.log('collection: ' + el);
                        // Y.log('collection: ' + el.item(0) + ', ' + el.item(1));

                        var handles=[], h, i, l, proc = function(v, k) {
                            // handles.push(this.addListener(el[i], type, fn, obj, override));
                            // var node = el.item(k);
                            // Y.log('collection stuff: ' + node);
                            
                            var b = a.slice();
                            b.unshift(v);
                            h = E.addListener.apply(E, b);
                            handles.push(h);
                        };

                        Y.each(el, proc, E);


                        return handles;


                    } else if (Y.Lang.isString(el)) {
                        var oEl = Y.all(el);
                        // If the el argument is a string, we assume it is 
                        // actually the id of the element.  If the page is loaded
                        // we convert el to the actual element, otherwise we 
                        // defer attaching the event until onload event fires

                        // check to see if we need to delay hooking up the event 
                        // until after the page loads.
                        var size = oEl.size();
                        if (size) {
                            if (size > 1) {
                                aa[0] = oEl;
                                return E.addListener.apply(E, aa);
                            } else {
                                el = oEl.item(0);
                            }
                        } else {
                            //
                            // defer adding the event until the element is available
                            this.onAvailable(el, function() {
                                // Y.Event.addListener(el, type, fn, obj, override);
                                Y.Event.addListener.apply(Y.Event, aa);
                            });

                            return true;
                        }
                    }

                    // Element should be an html element or an array if we get 
                    // here.
                    if (!el) {
                        // Y.log("unable to attach event " + type);
                        return false;
                    }

                    // the custom event key is the uid for the element + type

                    var ek = Y.stamp(el), key = 'event:' + ek + type,
                        cewrapper = _wrappers[key];


                    if (!cewrapper) {
                        // create CE wrapper
                        cewrapper = Y.publish(key, {
                            silent: true,
                            // host: this,
                            bubbles: false
                        });

                        // cache the dom event details in the custom event
                        // for later removeListener calls
                        cewrapper.el = el;
                        cewrapper.type = type;
                        cewrapper.fn = function(e) {
                            cewrapper.fire(Y.Event.getEvent(e, el));
                        };

                        if (el == Y.config.win && type == "load") {
                            // window load happens once
                            cewrapper.fireOnce = true;
                            _windowLoadKey = key;

                            // if the load is complete, fire immediately.
                            // all subscribers, including the current one
                            // will be notified.
                            if (loadComplete) {
                                cewrapper.fire();
                            }
                        }

                        _wrappers[key] = cewrapper;
                        _el_events[ek] = _el_events[ek] || {};
                        _el_events[ek][key] = cewrapper;

                        // var capture = (Y.lang.isObject(obj) && obj.capture);
                        // attach a listener that fires the custom event
                        this.nativeAdd(el, type, cewrapper.fn, false);
                    }

        
                    // from type, fn, etc to fn, obj, override
                    a = Y.Array(arguments, 2, true);
                    // a = a.shift();

                    var context = obj || Y.get(el);
                    // if (override) {
                        // if (override === true) {
                            // context = obj;
                        // } else {
                            // context = override;
                        // }
                    // }

                    a[1] = context;

                    // set context to the Node if not specified
                    return cewrapper.subscribe.apply(cewrapper, a);


                },

                /**
                 * Removes an event listener
                 *
                 * @method removeListener
                 *
                 * @param {String|HTMLElement|Array|NodeList} el An id, an element 
                 *  reference, or a collection of ids and/or elements to remove
                 *  the listener from.
                 * @param {String} type the type of event to remove.
                 * @param {Function} fn the method the event invokes.  If fn is
                 *  undefined, then all event handlers for the type of event are *  removed.
                 * @return {boolean} true if the unbind was successful, false *  otherwise.
                 * @static
                 */
                removeListener: function(el, type, fn) {

                    if (el && el.detach) {
                        return el.detach();
                    }
                    var i, len, li;

                    // The el argument can be a string
                    if (typeof el == "string") {
                        el = Y.get(el);
                    // The el argument can be an array of elements or element ids.
                    } else if ( this._isValidCollection(el)) {
                        var ok = true;
                        for (i=0,len=el.length; i<len; ++i) {
                            ok = ( this.removeListener(el[i], type, fn) && ok );
                        }
                        return ok;
                    }

                    if (!fn || !fn.call) {
                        // Y.log("Error, function is not valid " + fn);
                        //return false;
                        return this.purgeElement(el, false, type);
                    }


                    var id = 'event:' + Y.stamp(el) + type, 
                        ce = _wrappers[id];
                    if (ce) {
                        return ce.unsubscribe(fn);
                    } else {
                        return false;
                    }

                },

                /**
                 * Finds the event in the window object, the caller's arguments, or
                 * in the arguments of another method in the callstack.  This is
                 * executed automatically for events registered through the event
                 * manager, so the implementer should not normally need to execute
                 * this function at all.
                 * @method getEvent
                 * @param {Event} e the event parameter from the handler
                 * @param {HTMLElement} boundEl the element the listener is attached to
                 * @return {Event} the event 
                 * @static
                 */
                getEvent: function(e, boundEl) {
                    var ev = e || window.event;

                    if (!ev) {
                        var c = this.getEvent.caller;
                        while (c) {
                            ev = c.arguments[0];
                            if (ev && Event == ev.constructor) {
                                break;
                            }
                            c = c.caller;
                        }
                    }

                    // Y.log('wrapper for facade: ' + 'event:' + Y.stamp(boundEl) + e.type);

                    return new Y.Event.Facade(ev, boundEl, _wrappers['event:' + Y.stamp(boundEl) + e.type]);
                },


                /**
                 * Generates an unique ID for the element if it does not already 
                 * have one.
                 * @method generateId
                 * @param el the element to create the id for
                 * @return {string} the resulting id of the element
                 * @static
                 */
                generateId: function(el) {
                    var id = el.id;

                    if (!id) {
                        id = Y.stamp(el);
                        el.id = id;
                    }

                    return id;
                },


                /**
                 * We want to be able to use getElementsByTagName as a collection
                 * to attach a group of events to.  Unfortunately, different 
                 * browsers return different types of collections.  This function
                 * tests to determine if the object is array-like.  It will also 
                 * fail if the object is an array, but is empty.
                 * @method _isValidCollection
                 * @param o the object to test
                 * @return {boolean} true if the object is array-like and populated
                 * @static
                 * @private
                 */
                _isValidCollection: function(o) {
                    try {
                        return ( o                     && // o is something
                                 typeof o !== "string" && // o is not a string
                                 (o.each || o.length)  && // o is indexed
                                 !o.tagName            && // o is not an HTML element
                                 !o.alert              && // o is not a window
                                 (o.item || typeof o[0] !== "undefined") );
                    } catch(ex) {
                        Y.log("collection check failure", "warn", "event");
                        return false;
                    }

                },

                /*
                 * Custom event the fires when the dom is initially usable
                 * @event DOMReadyEvent
                 */
                // DOMReadyEvent: new Y.CustomEvent("event:ready", this),
                // DOMReadyEvent: Y.publish("event:ready", this, {
                    // fireOnce: true
                // }),

                /**
                 * hook up any deferred listeners
                 * @method _load
                 * @static
                 * @private
                 */
                _load: function(e) {

                    if (!loadComplete) {

                        // Y.log('Load Complete', 'info', 'event');

                        loadComplete = true;

                        // Just in case DOMReady did not go off for some reason
                        // E._ready();
                        if (Y.fire) {
                            Y.fire('event:ready');
                        }

                        // Available elements may not have been detected before the
                        // window load event fires. Try to find them now so that the
                        // the user is more likely to get the onAvailable notifications
                        // before the window load notification
                        Y.Event._tryPreloadAttach();

                    }
                },

                /**
                 * Polling function that runs before the onload event fires, 
                 * attempting to attach to DOM Nodes as soon as they are 
                 * available
                 * @method _tryPreloadAttach
                 * @static
                 * @private
                 */
                _tryPreloadAttach: function() {

                    if (this.locked) {
                        return;
                    }

                    if (Y.UA.ie) {
                        // Hold off if DOMReady has not fired and check current
                        // readyState to protect against the IE operation aborted
                        // issue.
                        if (!this.DOMReady) {
                            this.startInterval();
                            return;
                        }
                    }

                    this.locked = true;

                    // Y.log.debug("tryPreloadAttach");

                    // keep trying until after the page is loaded.  We need to 
                    // check the page load state prior to trying to bind the 
                    // elements so that we can be certain all elements have been 
                    // tested appropriately
                    var tryAgain = !loadComplete;
                    if (!tryAgain) {
                        tryAgain = (_retryCount > 0);
                    }

                    // onAvailable
                    var notAvail = [];

                    var executeItem = function (el, item) {
                        var context;
                        if (item.override) {
                            if (item.override === true) {
                                context = item.obj;
                            } else {
                                context = item.override;
                            }
                        } else {
                            context = Y.get(el);
                        }
                        item.fn.call(context, item.obj);
                    };

                    var i,len,item,el;

                    // onAvailable
                    for (i=0,len=_avail.length; i<len; ++i) {
                        item = _avail[i];
                        if (item && !item.checkReady) {
                            el = Y.get(item.id);
                            if (el) {
                                executeItem(el, item);
                                _avail[i] = null;
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    // onContentReady
                    for (i=0,len=_avail.length; i<len; ++i) {
                        item = _avail[i];
                        if (item && item.checkReady) {
                            el = Y.get(item.id);

                            if (el) {
                                // The element is available, but not necessarily ready
                                // @todo should we test parentNode.nextSibling?
                                if (loadComplete || el.nextSibling) {
                                    executeItem(el, item);
                                    _avail[i] = null;
                                }
                            } else {
                                notAvail.push(item);
                            }
                        }
                    }

                    _retryCount = (notAvail.length === 0) ? 0 : _retryCount - 1;

                    if (tryAgain) {
                        // we may need to strip the nulled out items here
                        this.startInterval();
                    } else {
                        clearInterval(this._interval);
                        this._interval = null;
                    }

                    this.locked = false;

                    return;

                },

                /**
                 * Removes all listeners attached to the given element via addListener.
                 * Optionally, the node's children can also be purged.
                 * Optionally, you can specify a specific type of event to remove.
                 * @method purgeElement
                 * @param {HTMLElement} el the element to purge
                 * @param {boolean} recurse recursively purge this element's children
                 * as well.  Use with caution.
                 * @param {string} type optional type of listener to purge. If
                 * left out, all listeners will be removed
                 * @static
                 */
                purgeElement: function(el, recurse, type) {
                    var oEl = (Y.Lang.isString(el)) ? Y.get(el) : el,
                        id = Y.stamp(oEl);
                    var lis = this.getListeners(oEl, type), i, len;
                    if (lis) {
                        for (i=0,len=lis.length; i<len ; ++i) {
                            lis[i].unsubscribeAll();
                        }
                    }

                    if (recurse && oEl && oEl.childNodes) {
                        for (i=0,len=oEl.childNodes.length; i<len ; ++i) {
                            this.purgeElement(oEl.childNodes[i], recurse, type);
                        }
                    }
                },

                /**
                 * Returns all listeners attached to the given element via addListener.
                 * Optionally, you can specify a specific type of event to return.
                 * @method getListeners
                 * @param el {HTMLElement|string} the element or element id to inspect 
                 * @param type {string} optional type of listener to return. If
                 * left out, all listeners will be returned
                 * @return {Y.Custom.Event} the custom event wrapper for the DOM event(s)
                 * @static
                 */           
                getListeners: function(el, type) {
                    var results=[], ek = Y.stamp(el), key = (type) ? 'event:' + type : null,
                        evts = _el_events[ek];

                    if (key) {
                        if (evts[key]) {
                            results.push(evts[key]);
                        }
                    } else {
                        for (var i in evts) {
                            results.push(evts[i]);
                        }
                    }

                    return (results.length) ? results : null;
                },

                /**
                 * Removes all listeners registered by pe.event.  Called 
                 * automatically during the unload event.
                 * @method _unload
                 * @static
                 * @private
                 */
                _unload: function(e) {

                    var E = Y.Event, i, w;

                    for (i in _wrappers) {
                        w = _wrappers[i];
                        w.unsubscribeAll();
                        E.nativeRemove(w.el, w.type, w.fn);
                        delete _wrappers[i];
                    }

                    E.nativeRemove(window, "unload", E._unload);
                },

                
                /**
                 * Adds a DOM event directly without the caching, cleanup, context adj, etc
                 *
                 * @method nativeAdd
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      type   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                nativeAdd: function(el, type, fn, capture) {
                    if (el.addEventListener) {
                            el.addEventListener(type, fn, !!capture);
                    } else if (el.attachEvent) {
                            el.attachEvent("on" + type, fn);
                    } 
                    // else {
                      //   Y.log('DOM evt error');
                    // }
                },

                /**
                 * Basic remove listener
                 *
                 * @method nativeRemove
                 * @param {HTMLElement} el      the element to bind the handler to
                 * @param {string}      type   the type of event handler
                 * @param {function}    fn      the callback to invoke
                 * @param {boolen}      capture capture or bubble phase
                 * @static
                 * @private
                 */
                nativeRemove: function(el, type, fn, capture) {
                    if (el.removeEventListener) {
                            el.removeEventListener(type, fn, !!capture);
                    } else if (el.detachEvent) {
                            el.detachEvent("on" + type, fn);
                    }
                }
            };

        }();

        var E = Y.Event;

        // Process onAvailable/onContentReady items when when the DOM is ready in IE
        if (Y.UA.ie) {
            Y.subscribe && Y.on('event:ready', E._tryPreloadAttach, E, true);
        }

        E.Custom = Y.CustomEvent;
        E.Subscriber = Y.Subscriber;
        E.Target = Y.EventTarget;

        /**
         * Y.Event.on is an alias for addListener
         * @method on
         * @see addListener
         * @static
         */
        E.attach = function(type, fn, el, data, context) {
            var a = Y.Array(arguments, 0, true),
                oEl = a.splice(2, 1);
            a.unshift(oEl[0]);
            return E.addListener.apply(E, a);
        };

        E.detach = function(type, fn, el, data, context) {
            return E.removeListener(el, type, fn, data, context);
        };

        // for the moment each instance will get its own load/unload listeners
        E.nativeAdd(window, "load", E._load);
        E.nativeAdd(window, "unload", E._unload);

        E._tryPreloadAttach();

}, "3.0.0");
/*
 * A wrapper for DOM events and Custom Events
 * @submodule event-facade
 * @module event
 */
YUI.add("event-facade", function(Y) {


    var whitelist = {
        "altKey"          : 1,
        // "button"          : 1, // we supply
        // "bubbles"         : 1, // needed?
        // "cancelable"      : 1, // needed? 
        // "charCode"        : 1, // we supply
        "cancelBubble"    : 1,
        // "currentTarget"   : 1, // we supply
        "ctrlKey"         : 1,
        "clientX"         : 1, // needed?
        "clientY"         : 1, // needed?
        "detail"          : 1, // not fully implemented
        // "fromElement"     : 1,
        "keyCode"         : 1,
        // "height"          : 1, // needed?
        // "initEvent"       : 1, // need the init events?
        // "initMouseEvent"  : 1,
        // "initUIEvent"     : 1,
        // "layerX"          : 1, // needed?
        // "layerY"          : 1, // needed?
        "metaKey"         : 1,
        // "modifiers"       : 1, // needed?
        // "offsetX"         : 1, // needed?
        // "offsetY"         : 1, // needed?
        // "preventDefault"  : 1, // we supply
        // "reason"          : 1, // IE proprietary
        // "relatedTarget"   : 1,
        // "returnValue"     : 1, // needed?
        "shiftKey"        : 1,
        // "srcUrn"          : 1, // IE proprietary
        // "srcElement"      : 1,
        // "srcFilter"       : 1, IE proprietary
        // "stopPropagation" : 1, // we supply
        // "target"          : 1,
        // "timeStamp"       : 1, // needed?
        // "toElement"       : 1,
        "type"            : 1,
        // "view"            : 1,
        // "which"           : 1, // we supply
        // "width"           : 1, // needed?
        "x"               : 1,
        "y"               : 1
    };

    var ua = Y.UA,

        /**
         * webkit key remapping required for Safari < 3.1
         * @property webkitKeymap
         * @private
         */
        webkitKeymap = {
            63232: 38, // up
            63233: 40, // down
            63234: 37, // left
            63235: 39, // right
            63276: 33, // page up
            63277: 34, // page down
            25: 9      // SHIFT-TAB (Safari provides a different key code in
                       // this case, even though the shiftKey modifier is set)
        },

        /**
         * Returns a wrapped node.  Intended to be used on event targets,
         * so it will return the node's parent if the target is a text
         * node
         * @method resolve
         * @private
         */
        resolve = function(n) {

            if (!n) {
                return null;
            }

            try {
                if (ua.webkit && 3 == n.nodeType) {
                    n = n.parentNode;
                } 
            } catch(ex) { }

            return Y.Node.get(n);
        };


    // provide a single event with browser abstractions resolved
    //
    // include all properties for both browers?
    // include only DOM2 spec properties?
    // provide browser-specific facade?

    /**
     * Wraps a DOM event, properties requiring browser abstraction are
     * fixed here.  Provids a security layer when required.
     * @class Event.Facade
     * @param ev {Event} the DOM event
     * @param currentTarget {HTMLElement} the element the listener was attached to
     * @param wrapper {Event.Custom} the custom event wrapper for this DOM event
     */
    Y.Event.Facade = function(ev, currentTarget, wrapper, details) {

        // @TODO the document should be the target's owner document

        var e = ev, ot = currentTarget, d = Y.config.doc, b = d.body,
            x = e.pageX, y = e.pageY, isCE = (ev._YUI_EVENT);

        // copy all primitives ... this is slow in FF
        // for (var i in e) {
        for (var i in whitelist) {
            // if (!Y.Lang.isObject(e[i])) {
            if (whitelist.hasOwnProperty(i)) {
                this[i] = e[i];
            }
        }

        //////////////////////////////////////////////////////

        if (!x && 0 !== x) {
            x = e.clientX || 0;
            y = e.clientY || 0;

            if (ua.ie) {
                x += Math.max(d.documentElement.scrollLeft, b.scrollLeft);
                y += Math.max(d.documentElement.scrollTop, b.scrollTop);
            }
        }

        this._yuifacade = true;

        /**
         * The X location of the event on the page (including scroll)
         * @property pageX
         * @type int
         */
        this.pageX = x;

        /**
         * The Y location of the event on the page (including scroll)
         * @property pageY
         * @type int
         */
        this.pageY = y;

        //////////////////////////////////////////////////////

        /**
         * The keyCode for key events.  Uses charCode if keyCode is not available
         * @property keyCode
         * @type int
         */
        var c = e.keyCode || e.charCode || 0;

        if (ua.webkit && (c in webkitKeymap)) {
            c = webkitKeymap[c];
        }

        /**
         * The keyCode for key events.  Uses charCode if keyCode is not available
         * @property keyCode
         * @type int
         */
        this.keyCode = c;

        /**
         * The charCode for key events.  Same as keyCode
         * @property charCode
         * @type int
         */
        this.charCode = c;

        //////////////////////////////////////////////////////

        /**
         * The button that was pushed.
         * @property button
         * @type int
         */
        this.button = e.which || e.button;

        /**
         * The button that was pushed.  Same as button.
         * @property which
         * @type int
         */
        this.which = this.button;

        /**
         * The event details.  Currently supported for Custom
         * Events only, where it contains the arguments that
         * were passed to fire().
         * @property details
         * @type Array
         */
        this.details = details;

        //////////////////////////////////////////////////////

        /**
         * Timestamp for the event
         * @property time
         * @type Date
         */
        this.time = e.time || new Date().getTime();

        //////////////////////////////////////////////////////
        
        /**
         * Node reference for the targeted element
         * @propery target
         * @type Node
         */
        this.target = (isCE) ? e.target : resolve(e.target || e.srcElement);

        /**
         * Node reference for the element that the listener was attached to.
         * @propery currentTarget
         * @type Node
         */
        this.currentTarget = (isCE) ? ot :  resolve(ot);

        var t = e.relatedTarget;
        if (!t) {
            if (e.type == "mouseout") {
                t = e.toElement;
            } else if (e.type == "mouseover") {
                t = e.fromElement;
            }
        }

        /**
         * Node reference to the relatedTarget
         * @propery relatedTarget
         * @type Node
         */
        this.relatedTarget = (isCE) ? t : resolve(t);
        
        //////////////////////////////////////////////////////
        // methods

        /**
         * Stops the propagation to the next bubble target
         * @method stopPropagation
         */
        this.stopPropagation = function() {
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            if (wrapper) {
                wrapper.stopPropagation();
            }
        };

        /**
         * Stops the propagation to the next bubble target and
         * prevents any additional listeners from being exectued
         * on the current target.
         * @method stopImmediatePropagation
         */
        this.stopImmediatePropagation = function() {

            if (e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            } else {
                this.stopPropagation();
            }

            if (wrapper) {
                wrapper.stopImmediatePropagation();
            }

        };

        /**
         * Prevents the event's default behavior
         * @method preventDefault
         */
        this.preventDefault = function() {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            if (wrapper) {
                wrapper.preventDefault();
            }
        };

        /**
         * Stops the event propagation and prevents the default
         * event behavior.
         * @method halt
         * @param immediate {boolean} if true additional listeners
         * on the current target will not be executed
         */
        this.halt = function(immediate) {
            if (immediate) {
                this.stopImmediatePropagation();
            } else {
                this.stopPropagation();
            }
            this.preventDefault();
        };

    };

}, "3.0.0");

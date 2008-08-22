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
                    args[0] = ef;
                }

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
            var es = Y.Env._eventstack, s =  es && es.logging;
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
                this.details = args.slice(); // original arguments in the details

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

(function() {
/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM 
 * events.
 * @module event
 */

/**
 * EventTarget is designed to be used with Y.augment to wrap 
 * EventCustom in an interface that allows events to be listened to 
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 *
 * @Class Event.Target
 */

var L = Y.Lang,
    PREFIX_DELIMITER = ':',
    DETACH_PREFIX_SPLITTER = /[,|]\s*/,
    AFTER_PREFIX = '~AFTER~',

    /**
     * An event target can fire events and be targeted by events.
     * @class EventTarget
     * @param opts a configuration object
     * @config emitFacade {boolean} if true, all events will emit event 
     * facade payloads by default (default false)
     * @config prefix {string} the prefix to apply to non-prefixed event names 
     * @config chain {boolean} if true, on/after/detach return the host to allow 
     * chaining, otherwise they return an EventHandle (default false)
     */
    ET = function(opts) {

        // console.log('Event.Target constructor executed: ' + this._yuid);

        var o = (L.isObject(opts)) ? opts : {},

            defaults = {
                context: o.context || this, 
                host: this,
                emitFacade: o.emitFacade,
                fireOnce: o.fireOnce,
                queuable: o.queuable,
                broadcast: o.broadcast,
                bubbles: ('bubbles' in o) ? o.bubbles : true
            };

        this._yuievt = {
            id: Y.guid(),
            events: {},
            targets: {},
            config: o,
            chain: ('chain' in o) ? o.chain : Y.config.chain,
            defaults: defaults,
            defaultkeys: Y.Object.keys(defaults)
        };


        this._getType = Y.cached(function(type) {

            var t = type,
                pre = this._yuievt.config.prefix;

            if (!L.isString(t)) {
                return t;
            } 

            if (t == '*') {
                return null;
            }
            
            if (t.indexOf(PREFIX_DELIMITER) == -1 && pre) {
                t = pre + PREFIX_DELIMITER + t;
            }

            return t;
        });

        /**
         * Returns an array with the detach key (if provided),
         * and the prefixed event name from _getType
         * Y.on('detachcategory, menu:click', fn)
         * @method _parseType
         * @private
         */
        this._parseType = Y.cached(function(type) {

            var t = type, parts, detachcategory, after, i, full_t,
                pre = this._yuievt.config.prefix;

            if (!L.isString(t)) {
                return t;
            } 
            
            i = t.indexOf(AFTER_PREFIX);

            if (i > -1) {
                after = true;
                t = t.substr(AFTER_PREFIX.length);
                // Y.log(t);
            }

            parts = t.split(DETACH_PREFIX_SPLITTER);

            if (parts.length > 1) {
                detachcategory = parts[0];
                t = parts[1];
            }

            full_t = this._getType(t);

            return [detachcategory, full_t, after, t];
        });

    };


ET.prototype = {


    /**
     * Subscribe to a custom event hosted by this object
     * @method on 
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @return the event target or a detach handle per 'chain' config
     */
    on: function(type, fn, context) {

        var parts = this._parseType(type), f, c, args, ret, ce,
            detachcategory, handle, store = Y.Env.evt.handles, after, adapt, shorttype,
            Node = Y.Node, n;

        if (L.isObject(type, true)) {

            f = fn; 
            c = context; 
            args = Y.Array(arguments, 0, true);
            ret = {};
            after = type._after;
            delete type._after;

            Y.each(type, function(v, k) {

                if (v) {
                    f = v.fn || ((Y.Lang.isFunction(v)) ? v : f);
                    c = v.context || c;
                }

                args[0] = (after) ? AFTER_PREFIX + k : k;
                args[1] = f;
                args[2] = c;

                ret[k] = this.on.apply(this, args); 

            }, this);

            return (this._yuievt.chain) ? this : ret;

        } else if (L.isFunction(type)) {
            return Y.Do.before.apply(Y.Do, arguments);
        }

        detachcategory = parts[0];
        after = parts[2];
        shorttype = parts[3];


        // extra redirection so we catch adaptor events too.  take a look at this.
        if (Node && (this instanceof Node) && (shorttype in Node.DOM_EVENTS)) {
            args = Y.Array(arguments, 0, true);
            args.splice(2, 0, Node.getDOMNode(this));
            return Y.on.apply(Y, args);
        }

        type = parts[1];

        if (this instanceof YUI) {
            adapt = Y.Env.evt.plugins[type];
            args  = Y.Array(arguments, 0, true);
            args[0] = shorttype;
            // check for the existance of an event adaptor
            if (adapt && adapt.on) {
                n = args[2];
                Y.log('Using adaptor for ' + shorttype + ', ' + n, 'info', 'event');
                if (Node && n && (n instanceof Node)) {
                    args[2] = Node.getDOMNode(n);
                }
                handle = adapt.on.apply(Y, args);
            // check to see if the target is an Event.Target.  If so,
            // delegate to it (the Event.Target should handle whether
            // or not the prefix was included);
            // } else if (o && !(o instanceof YUI) && o.getEvent) {
            //     a = Y.Array(arguments, 0, true);
            //     a.splice(2, 1);
            //     return o.on.apply(o, a);
            // } else if ((!type) || (!adapt && type.indexOf(':') == -1)) {
            } else if ((!type) || (!adapt && Node && (shorttype in Node.DOM_EVENTS))) {
                handle = Y.Event.attach.apply(Y.Event, args);
            }

        } 

        if (!handle) {

            // Y.log('parts: ' + parts);
            ce     = this._yuievt.events[type] || this.publish(type);
            args   = Y.Array(arguments, 1, true);

            f = (after) ? ce.after : ce.on;

            handle = f.apply(ce, args);
        }

        if (detachcategory) {

            store[detachcategory] = store[detachcategory] || {};
            store[detachcategory][type] = store[detachcategory][type] || [];
            store[detachcategory][type].push(handle);


            // Y.log('storing: ' + key);
        }

        return (this._yuievt.chain) ? this : handle;

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

        var parts = this._parseType(type), 
        detachcategory = L.isArray(parts) ? parts[0] : null,
        shorttype = (parts) ? parts[3] : null,
        handle, adapt, store = Y.Env.evt.handles, cat, args,
        evts = this._yuievt.events, ce, i, ret = true,

        keyDetacher = function(lcat, ltype) {
            var handles = lcat[ltype];
            if (handles) {
                while (handles.length) {
                    handle = handles.pop();
                    handle.detach();
                }
            }
        };

        if (detachcategory) {

            cat = store[detachcategory];
            type = parts[1];

            if (cat) {
                if (type) {
                    keyDetacher(cat, type);
                } else {
                    for (i in cat) {
                        if (cat.hasOwnProperty(i)) {
                            keyDetacher(cat, i);
                        }
                    }
                }

                return (this._yuievt.chain) ? this : true;
            }

        // If this is an event handle, use it to detach
        } else if (L.isObject(type) && type.detach) {
            ret = type.detach();
            return (this._yuievt.chain) ? this : true;
        // extra redirection so we catch adaptor events too.  take a look at this.
        } else if (Y.Node && (this instanceof Y.Node) && ((!shorttype) || (shorttype in Y.Node.DOM_EVENTS))) {
            args = Y.Array(arguments, 0, true);
            args[2] = Y.Node.getDOMNode(this);
            return Y.detach.apply(Y, args);
        }

        adapt = Y.Env.evt.plugins[shorttype];

        // The YUI instance handles DOM events and adaptors
        if (this instanceof YUI) {
            args = Y.Array(arguments, 0, true);
            // use the adaptor specific detach code if
            if (adapt && adapt.detach) {
                return adapt.detach.apply(Y, args);
            // DOM event fork
            } else if (!type || (!adapt && type.indexOf(':') == -1)) {
                args[0] = type;
                return Y.Event.detach.apply(Y.Event, args);
            }
        }

        if (type) {
            ce = evts[type];
            if (ce) {
                return ce.detach(fn, context);
            }
        } else {
            for (i in evts) {
                if (evts.hasOwnProperty(i)) {
                    ret = ret && evts[i].detach(fn, context);
                }
            }
            return ret;
        }

        return (this._yuievt.chain) ? this : false;
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
     * @method unsubscribeAll
     * @param type {string}   The type, or name of the event
     */
    detachAll: function(type) {
        type = this._getType(type);
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
        // this._yuievt.config.prefix

        var events, ce, ret, o = opts || {}, meta = this._yuievt;

        type = this._getType(type);

        if (L.isObject(type)) {
            ret = {};
            Y.each(type, function(v, k) {
                ret[k] = this.publish(k, v || opts); 
            }, this);

            return ret;
        }

        events = meta.events; 
        ce = events[type];

        //if (ce && !ce.configured) {
        if (ce) {
// ce.log("publish applying new config to published event: '"+type+"' exists", 'info', 'event');
            if (opts) {
                ce.applyConfig(opts, true);
            }

        } else {
            // apply defaults
            Y.mix(o, meta.defaults, false, meta.defaultkeys);

            ce = new Y.CustomEvent(type, o);

            events[type] = ce;

            // if (o.onSubscribeCallback) {
            //     ce.subscribeEvent.on(o.onSubscribeCallback);
            // }
        }

        // make sure we turn the broadcast flag off if this
        // event was published as a result of bubbling
        if (typeof o == Y.CustomEvent) {
            events[type].broadcast = false;
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

        var typeIncluded = L.isString(type),
            t = (typeIncluded) ? type : (type && type.type),
            ce, a, ret;

        t = this._getType(t);
        ce = this.getEvent(t);

        // this event has not been published or subscribed to
        if (!ce) {
            
            // if this object has bubble targets, we need to publish the
            // event in order for it to bubble.
            if (this._yuievt.hasTargets) {
                ce = this.publish(t);
                ce.details = Y.Array(arguments, (typeIncluded) ? 1 : 0, true);

                return this.bubble(ce);
            }

            // otherwise there is nothing to be done
            ret = true;

        } else {

            a = Y.Array(arguments, (typeIncluded) ? 1 : 0, true);
            ret = ce.fire.apply(ce, a);

            // clear target for next fire()
            ce.target = null;
        }

        return (this._yuievt.chain) ? this : ret;
    },

    /**
     * Returns the custom event of the provided type has been created, a
     * falsy value otherwise
     * @method getEvent
     * @param type {string} the type, or name of the event
     * @return {Event.Custom} the custom event or null
     */
    getEvent: function(type) {
        type = this._getType(type);
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

        var targs = this._yuievt.targets, ret = true,
            t, type, ce, targetProp, i;

        if (!evt.stopped && targs) {

            // Y.log('Bubbling ' + evt.type);

            for (i in targs) {
                if (targs.hasOwnProperty(i)) {

                    t = targs[i]; 
                    type = evt.type;
                    ce = t.getEvent(type); 
                    targetProp = evt.target || this;
                        
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
     * @return the event target or a detach handle per 'chain' config
     */
    after: function(type, fn) {

        var a = Y.Array(arguments, 0, true);

        switch (L.type(type)) {
            case 'function':
                return Y.Do.after.apply(Y.Do, arguments);
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
     * type, callback, context, 1-n arguments
     *  
     * For methods:
     * callback, object (method host), methodName, context, 1-n arguments
     *
     * @method before
     * @return detach handle
     * @deprecated use the on method
     */
    before: function() { 
        return this.on.apply(this, arguments);
    }

};

Y.EventTarget = ET;

// make Y an event target
Y.mix(Y, ET.prototype, false, false, { 
    bubbles: false 
});

ET.call(Y);

YUI.Env.globalEvents = YUI.Env.globalEvents || new ET();

/**
 * Hosts YUI page level events.  This is where events bubble to
 * when the broadcast config is set to 2.
 * @property Global
 * @type EventTarget
 */
Y.Global = YUI.Env.globalEvents;

// @TODO implement a global namespace function on Y.Global?

})();

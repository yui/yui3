(function() {
/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM 
 * events.
 * @module event
 */

/**
 * Event.Target is designed to be used with Y.augment to wrap 
 * Event.Custom in an interface that allows events to be subscribed to 
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 *
 * @Class Event.Target
 */

var L = Y.Lang,
    after   = Y.after,
    DELIMITER = ':',

    ET = function(opts) { 

        // console.log('Event.Target constructor executed: ' + this._yuid);

        var o = (L.isObject(opts)) ? opts : {};

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

    },

    _getType = function(instance, type) {

        if (!L.isString(type)) {
            return type;
        }

        var t = type, 
            pre = instance._yuievt.config.prefix;

        // Y.log("pre: " + pre, 'info', 'event');

        if (t.indexOf(DELIMITER) == -1 && pre) {
            t = pre + DELIMITER + t;
        }

        // Y.log("type: " + t, 'info', 'event');

        return t;
    };


ET.prototype = {

    /**
     * Subscribe to a custom event hosted by this object
     * @method on 
     * @param type    {string}   The type of the event
     * @param fn {Function} The callback
     * @param context The execution context
     * @param args* 0..n params to supply to the callback
     */
    on: function(type, fn, context) {

        type = _getType(this, type);

        var f, c, args, ret, ce;

        if (L.isObject(type)) {

            f = fn; 
            c = context; 
            args = Y.Array(arguments, 0, true);
            ret = {};

            Y.each(type, function(v, k) {

                if (v) {
                    f = v.fn || f;
                    c = v.context || c;
                }

                args[0] = k;
                args[1] = f;
                args[2] = c;

                ret[k] = this.on.apply(this, args); 

            }, this);

            return ret;

        }

        ce = this._yuievt.events[type] || this.publish(type);
        args = Y.Array(arguments, 1, true);

        return ce.on.apply(ce, args);

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
     * @return {boolean} true if the subscriber was found and detached.
     */
    detach: function(type, fn, context) {

        type = _getType(this, type);

        // If this is an event handle, use it to detach
        if (L.isObject(type) && type.detach) {
            return type.detach();
        }

        var evts = this._yuievt.events, ce, i, ret = true;

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

        return false;
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
        type = _getType(this, type);
        return this.unsubscribe(type);
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

        type = _getType(this, type);

        var events, ce, ret, o;

        if (L.isObject(type)) {
            ret = {};
            Y.each(type, function(v, k) {
                ret[k] = this.publish(k, v || opts); 
            }, this);

            return ret;
        }

        events = this._yuievt.events; 
        ce = events[type];

        //if (ce && !ce.configured) {
        if (ce) {
// ce.log("publish applying config to published event: '"+type+"' exists", 'info', 'event');

            // This event could have been published
            ce.applyConfig(opts, true);
            // ce.configured = true;

        } else {
            o = opts || {};

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

        var typeIncluded = L.isString(type),
            t = (typeIncluded) ? type : (type && type.type),
            ce, a, ret;

        t = _getType(this, t);
        ce = this.getEvent(t);

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

        a = Y.Array(arguments, (typeIncluded) ? 1 : 0, true);
        ret = ce.fire.apply(ce, a);

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
        type = _getType(this, type);
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
     * @param context The execution context
     * @param args* 0..n params to supply to the callback
     */
    after: function(type, fn) {
        if (L.isFunction(type)) {
            return Y.Do.after.apply(Y.Do, arguments);
        } else {
            var ce = this._yuievt.events[type] || 
                // this.publish(type, {
                //     configured: false
                // }),
                this.publish(type),
                a = Y.Array(arguments, 1, true);

            return ce.after.apply(ce, a);
        }
    }

};

Y.EventTarget = ET;

// make Y an event target
Y.mix(Y, ET.prototype, false, false, { 
    bubbles: false 
});

ET.call(Y);

Y._on = Y.on;
Y._detach = Y.detach;

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

    if (L.isFunction(type)) {
        return Y.Do.before.apply(Y.Do, arguments);
    }
    
    var adapt = Y.Env.eventAdaptors[type], a;

    // check to see if the target is an Event.Target.  If so,
    // delegate to it (the Event.Target should handle whether
    // or not the prefix was included);
    if (o && o._yuievt && o.subscribe) {
        a = Y.Array(arguments, 0, true);
        a.splice(2, 1);
        return o.on.apply(o, a);
    // check for the existance of an event adaptor
    } else if (adapt && adapt.on) {
        Y.log('Using adaptor for ' + type, 'info', 'event');
        return adapt.on.apply(Y, arguments);
    } else {
        // the pattern for custom events is 'prefix:event',
        // however it is possible to have an event adaptor that
        // doesn't do anything special for subscribe.
        if (adapt || type.indexOf(':') > -1) {
            return Y._on.apply(Y, arguments);
        // DOM event listener
        } else {
            return Y.Event.attach.apply(Y.Event, arguments);
        }
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

    var adapt = Y.Env.eventAdaptors[type], a;

    if (o && o._yuievt && o.unsubscribe) {
        a = Y.Array(arguments, 0, true);
        a.splice(2, 1);
        return o.unsubscribe.apply(o, a);
    } else if (L.isObject(type) && type.detach) {
        return type.detach();
    } else {
        if (adapt && adapt.detach) {
            return adapt.detach.apply(Y, arguments);
        } else if (adapt || type.indexOf(':') > -1) {
            return Y._detach.apply(Y, arguments);
        } else {
            return Y.Event.detach.apply(Y.Event, arguments);
        }
    }
};

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
Y.before = function() { 
    return Y.on.apply(Y, arguments);
};

/**
 * Executes the callback after a DOM event, custom event
 * or method.  If the first argument is a function, it
 * is assumed the target is a method.
 *
 * For DOM and custom events:
 * type, callback, context, 1-n arguments
 *  
 * For methods:
 * callback, object (method host), methodName, context, 1-n arguments
 *
 * @method after
 * @return {Event.Handle} unsubscribe handle
 */
Y.after = function(type, f, o) {
    if (L.isFunction(type)) {
        return Y.Do.after.apply(Y.Do, arguments);
    } else {
        return after.apply(Y, arguments);
    }
};

})();

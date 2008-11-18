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

            if (Y.Lang.isObject(type)) {

                var f = fn, c = context, args = Y.Array(arguments, 0, true),
                    ret = {};

                Y.each(type, function(v, k) {

                    if (v) {
                        f = v.fn || f;
                        c = v.context || c;
                    }

                    args[0] = k;
                    args[1] = f;
                    args[2] = c;

                    ret[k] = this.subscribe.apply(this, args); 

                }, this);

                return ret;

            }

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

            if (Y.Lang.isObject(type)) {
                var ret = {};
                Y.each(type, function(v, k) {
                    ret[k] = this.publish(k, v || opts); 
                }, this);

                return ret;
            }

            var events = this._yuievt.events, ce = events[type];

            //if (ce && !ce.configured) {
            if (ce) {
// ce.log("publish applying config to published event: '"+type+"' exists", 'info', 'event');

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
            if (Y.Lang.isFunction(type)) {
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
        },

        before: function(type, fn) {
            if (Y.Lang.isFunction(type)) {
                return Y.Do.after.apply(Y.Do, arguments);
            } else {
                return this.subscribe.apply(this, arguments);
            }
        }

    };

    // make Y an event target
    Y.mix(Y, ET.prototype, false, false, { 
        bubbles: false 
    });
    ET.call(Y);


}, "3.0.0");
